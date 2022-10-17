package com.nichietsu.storecode717;

import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.zing.zalo.zalosdk.oauth.LoginVia;
import com.zing.zalo.zalosdk.oauth.OAuthCompleteListener;
import com.zing.zalo.zalosdk.oauth.OauthResponse;
import com.zing.zalo.zalosdk.oauth.ZaloOpenAPICallback;
import com.zing.zalo.zalosdk.oauth.ZaloSDK;
import com.zing.zalo.zalosdk.oauth.model.ErrorResponse;

import org.json.JSONException;
import org.json.JSONObject;

import java.security.NoSuchAlgorithmException;

interface OAuthAccessTokenCompleteListener {
    void onSuccess(WritableMap map);
}

class TokenData {
    String accessToken;
    String refreshToken;

    public TokenData(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}

public class ZaloModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private static final String ZaloKitAccessToken = "RN_ZALO_ACCESS_TOKEN";
    private static final String ZaloKitRefreshToken = "RN_ZALO_REFRESH_TOKEN";
    private static final String AUTH_VIA_WEB = "web";
    private static final String AUTH_VIA_APP = "app";
    private static final String AUTH_VIA_APP_OR_WEB = "app_or_web";

    public ZaloModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "Zalo";
    }

    @ReactMethod
    public void getApplicationHashKey(Promise promise) {
        try {
            promise.resolve(Utils.getApplicationHashKey(reactContext));
        } catch (Exception e) {
            promise.reject("Error when getting Application Hash Key", e);
        }
    }

    /*
     * get codeVerifier -> get codeChallenge -> getOauthCode (OauthCode) ->
     * get AccessToken and RefreshToken
     *  */
    @ReactMethod
    public void login(String authType, final Promise promise) {
        LoginVia type = LoginVia.APP_OR_WEB;
        String codeVerifier = Utils.generateCodeVerifier();
        String codeChallenge = null;

        if (authType.equals(AUTH_VIA_WEB)) type = LoginVia.WEB;
        else if (authType.equals(AUTH_VIA_APP)) type = LoginVia.APP;

        try {
            codeChallenge = Utils.generateCodeChallenge(codeVerifier);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }

        ZaloSDK.Instance.authenticateZaloWithAuthenType(reactContext.getCurrentActivity(), type, codeChallenge,
                new OAuthCompleteListener() {
                    @Override
                    public void onAuthenError(ErrorResponse errorResponse) {
                        promise.reject(errorResponse.getErrorCode() + "", errorResponse.getErrorMsg());
                        Log.d("LOGIN_ZALO", errorResponse.getErrorCode() + "" + errorResponse.getErrorMsg());
                    }

                    @Override
                    public void onGetOAuthComplete(OauthResponse response) {
                        String OauthCode = response.getOauthCode();
                        OAuthAccessTokenCompleteListener callback = new OAuthAccessTokenCompleteListener() {
                            @Override
                            public void onSuccess(WritableMap map) {
                                saveTokenToCache(map.getString("accessToken"), map.getString("refreshToken"));
                                promise.resolve(map);
                            }
                        };
                        getAccessToken(OauthCode, codeVerifier, callback);
                    }
                });
    }

    private void getAccessToken(String oauthCode, String codeVerifier, OAuthAccessTokenCompleteListener listener) {
        Thread thread = new Thread(() -> {
            try {
                ZaloSDK.Instance.getAccessTokenByOAuthCode(reactContext.getCurrentActivity(), oauthCode, codeVerifier, data -> {
                    int err = data.optInt("error");
                    if (err == 0) {
                        WritableMap map = Arguments.createMap();
                        map.putString("accessToken", data.optString("access_token"));
                        map.putString("refreshToken", data.optString("refresh_token"));

                        listener.onSuccess(map);
                    }
                });
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
        thread.start();
    }

    private void saveTokenToCache(String accessToken, String refreshToken) {
        SharedPreferences myPreferences = PreferenceManager.getDefaultSharedPreferences(reactContext.getCurrentActivity());
        SharedPreferences.Editor myEditor = myPreferences.edit();
        myEditor.putString(ZaloKitAccessToken, accessToken);
        myEditor.putString(ZaloKitRefreshToken, refreshToken);
        myEditor.apply();
    }

    private TokenData getTokenFromCache() {
        SharedPreferences myPreferences = PreferenceManager.getDefaultSharedPreferences(reactContext.getCurrentActivity());
        return new TokenData(myPreferences.getString(ZaloKitAccessToken, ""), myPreferences.getString(ZaloKitRefreshToken, ""));
    }

    private void clearTokenFromCache() {
        SharedPreferences myPreferences = PreferenceManager.getDefaultSharedPreferences(reactContext.getCurrentActivity());
        SharedPreferences.Editor myEditor = myPreferences.edit();
        myEditor.remove(ZaloKitAccessToken);
        myEditor.remove(ZaloKitRefreshToken);
        myEditor.apply();
    }

    @ReactMethod
    public void isAuthenticated(final Promise promise) {
        TokenData tokenData = this.getTokenFromCache();
        ZaloSDK.Instance.isAuthenticate(tokenData.refreshToken, (validated, errorCode, oauthResponse) -> {
            if (validated) {
                promise.resolve(true);
            } else {
                promise.reject("Error", "Have not login yet");
            }
        });
    }

    @ReactMethod
    public void getUserProfile(final Promise promise) {
        TokenData tokenData = this.getTokenFromCache();

        final String[] fields = {"id", "birthday", "gender", "picture", "name"};
        ZaloOpenAPICallback callback = new ZaloOpenAPICallback() {
            @Override
            public void onResult(JSONObject jsonObject) {
                try {
                    final WritableMap data = Utils.convertJsonToMap(jsonObject);
                    System.out.println(data);
                    if (data.hasKey("error") && data.getInt("error") != 0) {
                        promise.reject(String.valueOf(data.getInt("error")), data.getString("message"));
                    } else {
                        promise.resolve(data);
                    }
                } catch (JSONException e) {
                    promise.reject("422", "Error when passing user profile data");
                }
            }
        };

        ZaloSDK.Instance.getProfile(reactContext.getCurrentActivity(), tokenData.accessToken, callback, fields);
    }

    @ReactMethod
    public void logout() {
        ZaloSDK.Instance.unauthenticate();
        clearTokenFromCache();
    }
}
