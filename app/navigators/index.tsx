import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {VideoCallScreenWebRtc} from '../../app/screens/videoCall';
import {createNavigationContainerRef} from '@react-navigation/native';
import {StartCallUserScreen} from '../screens/videoCall/startCallUser';
import TestClassScreen from '../screens/test';

interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export type NavigatorParamList = {
  StartCallUser: undefined;
  VideoCallWebRtc: undefined;
  TestClassScreen: undefined;
};

export const navigationRef = createNavigationContainerRef();

const Stack = createNativeStackNavigator<NavigatorParamList>();

const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="TestClassScreen">
      <Stack.Screen name="VideoCallWebRtc" component={VideoCallScreenWebRtc} />
      <Stack.Screen name="StartCallUser" component={StartCallUserScreen} />
      <Stack.Screen name="TestClassScreen" component={TestClassScreen} />
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
