import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NavigatorParamList} from '.';

export type LoginProps = NativeStackScreenProps<NavigatorParamList, 'login'>;
export type loginSuccessProps = NativeStackScreenProps<
  NavigatorParamList,
  'loginSuccess'
>;
export type RegisterProps = NativeStackScreenProps<
  NavigatorParamList,
  'register'
>;
export type EditProfileProps = NativeStackScreenProps<
  NavigatorParamList,
  'editProfile'
>;
