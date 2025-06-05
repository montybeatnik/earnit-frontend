import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import RoleSelectScreen from '../screens/onboarding/RoleSelectScreen';
import BoilerplateSelectionScreen from '../screens/onboarding/BoilerplateSelectionScreen';
import ParentChildLinkScreen from '../screens/onboarding/ParentChildLinkScreen';
import ChildSetupScreen from '../screens/onboarding/ChildSetupScreen';
import ParentRegisterScreen from '../screens/onboarding/ParentRegisterScreen';

const Stack = createNativeStackNavigator();

export default function OnboardingNavigator() {
    return (
        <Stack.Navigator initialRouteName="Welcome">
            <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="RoleSelect" component={RoleSelectScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ParentRegister" component={ParentRegisterScreen} />
            <Stack.Screen name="BoilerplateSelection" component={BoilerplateSelectionScreen} options={{ headerShown: false }} />
            <Stack.Screen
                name="ChildSetup"
                component={ChildSetupScreen}
                options={{ headerShown: true, title: 'Set Up Your Children' }}
            />
            <Stack.Screen name="ParentChildLink" component={ParentChildLinkScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}