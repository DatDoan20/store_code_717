/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';

import { LogBox, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs();

import { AppNavigator } from './navigators';

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar hidden />
      <AppNavigator />
    </SafeAreaProvider>
  )
};
export default App;
