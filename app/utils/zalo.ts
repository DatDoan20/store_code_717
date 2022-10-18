import {NativeModules, Platform} from 'react-native';

const zaloModule = NativeModules.Zalo as ZaloInterface; // "Zalo is name that was returned in getName() in ZaloModule()"

interface ZaloInterface {
  getApplicationHashKey: () => Promise<string>;
  login: (authType: string) => Promise<any>; // return accessToken and refreshToken (WritableMap)
  getUserProfile: () => Promise<UserProfile>; // return data user profile (WritableMap)
  AUTH_VIA_WEB: string;
  AUTH_VIA_APP: string;
  AUTH_VIA_APP_OR_WEB: string;
}
type DataPicture = {
  url: string;
};
type Picture = {
  data: DataPicture;
};

export type UserProfile = {
  birthday: string;
  error: number;
  extCode: number;
  gender: string;
  id: string;
  message: string;
  name: string;
  picture: Picture;
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
    console.log('A&R TOKEN: ', data);
    return true;
  } catch (error) {
    console.log('ZaloLogin Error: ', error);
    return false;
  }
};

export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const userProfile: UserProfile = await zaloModule.getUserProfile();
    console.log('-----Data User Profile-----');
    console.log(userProfile, '++++++');
    return userProfile;
  } catch (error: any) {
    console.log('getUserProfile Error: ', error.toString());
    return null;
  }
};
