import {NativeModules, Platform} from 'react-native';

const zaloModule = NativeModules.Zalo as ZaloInterface; // "Zalo is name that was returned in getName() in ZaloModule()"

interface ZaloInterface {
  getApplicationHashKey: () => Promise<string>;
  login: (authType: string) => Promise<any>; // return accessToken and refreshToken (WritableMap)
  getUserProfile: () => Promise<any>; // return data user profile (WritableMap)
  AUTH_VIA_WEB: string;
  AUTH_VIA_APP: string;
  AUTH_VIA_APP_OR_WEB: string;
}

export const LoginVia = {
  AUTH_VIA_WEB: zaloModule.AUTH_VIA_WEB,
  AUTH_VIA_APP: zaloModule.AUTH_VIA_APP,
  AUTH_VIA_APP_OR_WEB: zaloModule.AUTH_VIA_APP_OR_WEB,
};

export const getHashKey = async () => {
  if (Platform.OS === 'android') {
    return await zaloModule.getApplicationHashKey();
  }
  return 'getHasKey error, this only work in android';
};

export const zaloLogin = async (authType: string): Promise<boolean> => {
  try {
    const data = await zaloModule.login(authType);
    console.log(data);
    return true;
  } catch (error) {
    console.log('ZaloLogin Error: ', error);
    return false;
  }
};

export const getUserProfile = async (): Promise<any> => {
  try {
    const userProfile = await zaloModule.getUserProfile();
    console.log('-----Data User Profile-----');
    console.log(userProfile, '++++++');
  } catch (error: any) {
    console.log('getUserProfile Error: ', error.toString());
  }
};
