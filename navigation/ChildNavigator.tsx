import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChildDashboard from '../screens/child/ChildDashboard';
import RewardShopScreen from '../screens/child/RewardShopScreen';

const Stack = createNativeStackNavigator();

export default function ChildNavigator() {
    return (
        <Stack.Navigator initialRouteName="ChildDashboard">
            <Stack.Screen name="ChildDashboard" component={ChildDashboard} />
            <Stack.Screen name="RewardShop" component={RewardShopScreen} />
        </Stack.Navigator>
    );
}