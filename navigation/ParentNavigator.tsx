import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ParentDashboard from '../screens/parent/ParentDashboard';
import CreateTaskScreen from '../screens/parent/CreateTaskScreen';
import RewardListScreen from '../screens/parent/RewardListScreen';
import CreateRewardScreen from '../screens/parent/CreateRewardScreen';


const Stack = createNativeStackNavigator();

export default function ParentNavigator() {
    return (
        <Stack.Navigator initialRouteName="ParentDashboard">
            <Stack.Screen name="ParentDashboard" component={ParentDashboard} />
            <Stack.Screen name="CreateTask" component={CreateTaskScreen} />
            <Stack.Screen name="Rewards" component={RewardListScreen} />
            <Stack.Screen name="CreateReward" component={CreateRewardScreen} />
        </Stack.Navigator>
    );
}
