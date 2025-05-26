import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthLoadingScreen from '../screens/auth/AuthLoadingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ParentDashboard from '../screens/parent/ParentDashboard';
import ChildDashboard from '../screens/child/ChildDashboard';
import ParentNavigator from './ParentNavigator';


const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="AuthLoading">
      <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Parent" component={ParentNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="ChildDashboard" component={ChildDashboard} />
    </Stack.Navigator>
  );
}
