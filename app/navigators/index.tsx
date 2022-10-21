import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createNavigationContainerRef } from '@react-navigation/native';
import { ChatScreen, LoginScreen, LoginSuccess, RegisterScreen, StartCallUserScreen, VideoCallScreenWebRtc } from '../screens';

interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> { }

export type NavigatorParamList = {
  videoCallWebRtc: undefined;
  login: undefined
  loginSuccess: undefined
  StartCallUser: undefined;
  VideoCallWebRtc: undefined;
  register: undefined;
  chat: {
    userName: string,
    userId: string,
    userAvatar?: string | undefined | null
  }
};

export const navigationRef = createNavigationContainerRef();

const Stack = createNativeStackNavigator<NavigatorParamList>();

const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="login">
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name='loginSuccess' component={LoginSuccess} />
      <Stack.Screen name="videoCallWebRtc" component={VideoCallScreenWebRtc} />
      <Stack.Screen name="VideoCallWebRtc" component={VideoCallScreenWebRtc} />
      <Stack.Screen name="StartCallUser" component={StartCallUserScreen} />
      <Stack.Screen name="register" component={RegisterScreen} />
      <Stack.Screen name="chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};

export const AppNavigator = (props: NavigationProps) => {
  return (
    <NavigationContainer ref={navigationRef} {...props}>
      <AppStack />
    </NavigationContainer>
  );
};
