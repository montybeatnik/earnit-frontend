import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './navigation/AuthNavigator';
import DevFooter from './components/DevFooter';

declare const __DEV__: boolean;
export default function App() {
  console.log("Dev mode?", __DEV__);
  return (
    <NavigationContainer>
      <AuthNavigator />
      {__DEV__ && <DevFooter />}
    </NavigationContainer>
  );
}
