import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NavigatorParamList} from '.';

export type LoginProps = NativeStackScreenProps<NavigatorParamList, 'login'>;
export type loginSuccessProps = NativeStackScreenProps<
  NavigatorParamList,
  'loginSuccess'
>;
