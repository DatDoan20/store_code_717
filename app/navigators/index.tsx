import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { VideoCallScreenWebRtc } from '../../app/screens/videoCall';
import { createNavigationContainerRef } from '@react-navigation/native';
import LoginScreen from '../screens/login';
import LoginSuccess from '../screens/loginSuccess';

interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> { }

export type NavigatorParamList = {
  videoCallWebRtc: undefined;
  login: undefined
  loginSuccess: undefined
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
