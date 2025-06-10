import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChildDashboard from '../screens/child/ChildDashboard';
import RewardShopScreen from '../screens/child/RewardShopScreen';
import ChildLoginScreen from '../screens/child/ChildLoginScreen';
import RewardCelebrationScreen from '../screens/child/RewardCelebrationScreen';

const Stack = createNativeStackNavigator();

export default function ChildNavigator() {
    return (
        <Stack.Navigator initialRouteName="ChildDashboard">
            <Stack.Screen name="ChildDashboard" component={ChildDashboard} />
            <Stack.Screen name="RewardShop" component={RewardShopScreen} />
            <Stack.Screen name="ChildLogin" component={ChildLoginScreen} />
            <Stack.Screen
                name="RewardCelebration"
                component={RewardCelebrationScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}