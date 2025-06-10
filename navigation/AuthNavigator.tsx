import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthLoadingScreen from '../screens/auth/AuthLoadingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ChildDashboard from '../screens/child/ChildDashboard';
import ParentNavigator from './ParentNavigator';
import ChildNavigator from './ChildNavigator';
import OnboardingNavigator from './OnboardingNavigator';
import RoleSelectionScreen from '../screens/onboarding/RoleSelectScreen';
import StarterSetupScreen from '../screens/onboarding/StarterSetupScreen';
import ParentRegisterScreen from '../screens/onboarding/ParentRegisterScreen';
import BoilerplateSelectionScreen from '../screens/onboarding/BoilerplateSelectionScreen';
import ChildSetupScreen from '../screens/onboarding/ChildSetupScreen';
import ChildLoginScreen from '../screens/child/ChildLoginScreen';
import ChildSelectorScreen from '../screens/onboarding/ChildSelectorScreen';
import SelectChildScreen from '../screens/onboarding/SelectChildScreen';
import ChildPasswordSetupScreen from '../screens/onboarding/ChildPasswordSetupScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="AuthLoading">
      <Stack.Screen name="Onboarding" component={OnboardingNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="StarterSetup" component={StarterSetupScreen} />
      <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Parent" component={ParentNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Child" component={ChildNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="ParentRegister" component={ParentRegisterScreen} />
      <Stack.Screen name="BoilerplateSelection" component={BoilerplateSelectionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ChildSelector" component={ChildSelectorScreen} />
      <Stack.Screen name="ChildPasswordSetup" component={ChildPasswordSetupScreen} />
      <Stack.Screen name="ChildSetupScreen" component={ChildSetupScreen} />
      <Stack.Screen
        name="SelectChild"
        component={SelectChildScreen}
        options={{ headerShown: true, title: 'Choose Your Name' }}
      />
      <Stack.Screen name="ChildLogin" component={ChildLoginScreen} options={{ headerShown: false }} />
    </Stack.Navigator >
  );
}
