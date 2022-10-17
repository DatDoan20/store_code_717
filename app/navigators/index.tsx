import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createNavigationContainerRef} from '@react-navigation/native';
import {StartCallUserScreen, VideoCallScreenWebRtc} from '../screens/videoCall';
import {ZaloLoginScreen} from '../screens/zaloLogin';

interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export type NavigatorParamList = {
  StartCallUser: undefined;
  VideoCallWebRtc: undefined;
  ZaloLogin: undefined;
};

export const navigationRef = createNavigationContainerRef();

const Stack = createNativeStackNavigator<NavigatorParamList>();

const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="ZaloLogin">
      <Stack.Screen name="VideoCallWebRtc" component={VideoCallScreenWebRtc} />
      <Stack.Screen name="StartCallUser" component={StartCallUserScreen} />
      <Stack.Screen name="ZaloLogin" component={ZaloLoginScreen} />
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
