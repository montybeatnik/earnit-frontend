import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ParentDashboard from '../screens/parent/ParentDashboard';
import CreateTaskTemplateScreen from '../screens/parent/CreateTaskScreen';
import RewardListScreen from '../screens/parent/RewardListScreen';
import CreateRewardScreen from '../screens/parent/CreateRewardScreen';
import AssignTaskScreen from '../screens/parent/AssignTaskScreen';


const Stack = createNativeStackNavigator();

export default function ParentNavigator() {
    return (
        <Stack.Navigator initialRouteName="ParentDashboard">
            <Stack.Screen name="ParentDashboard" component={ParentDashboard} />
            <Stack.Screen name="AssignTask" component={AssignTaskScreen} />
            <Stack.Screen name="CreateTaskTemplate" component={CreateTaskTemplateScreen} />
            <Stack.Screen name="Rewards" component={RewardListScreen} />
            <Stack.Screen name="CreateReward" component={CreateRewardScreen} />
        </Stack.Navigator>
    );
}
