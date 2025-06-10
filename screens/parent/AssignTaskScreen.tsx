import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../services/api';
import { themeStyles } from '../../styles/theme';
import DropdownPicker from '../../components/DropdownPicker';

export default function AssignTaskScreen() {
    const [children, setChildren] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedChildId, setSelectedChildId] = useState(null);
    const [selectedTaskId, setSelectedTaskId] = useState(null);

    const [childDropdownVisible, setChildDropdownVisible] = useState(false);
    const [taskDropdownVisible, setTaskDropdownVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                const childRes = await api.get('/children', { headers });
                setChildren(childRes.data.children);
                if (childRes.data.children.length === 1) {
                    setSelectedChildId(childRes.data.children[0].ID);
                }

                console.log('Children:', childRes.data.children);

                const taskRes = await api.get('/boilerplate/tasks', { headers });
                setTasks(taskRes.data.tasks);
            } catch (err) {
                console.error('Failed to fetch tasks or children:', err);
                Alert.alert('Error', 'Could not load data');
            }
        };

        fetchData();
    }, []);

    const handleAssign = async () => {
        if (!selectedTaskId || !selectedChildId) {
            Alert.alert('Missing Info', 'Please select a task and child.');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('token');
            await api.post(
                '/tasks/assign',
                { template_id: selectedTaskId, assigned_to_id: selectedChildId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            Alert.alert('Success', 'Task assigned!');
            setSelectedTaskId(null);
            if (children.length > 1) setSelectedChildId(null);
        } catch (err) {
            console.error('Task assignment error:', err);
            Alert.alert('Error', 'Could not assign task.');
        }
    };

    return (
        <View style={themeStyles.container}>
            <Text style={themeStyles.title}>Assign a Task</Text>

            {children.length > 1 && (
                <DropdownPicker
                    label="Select Child"
                    selectedValue={selectedChildId}
                    options={children.map((child) => ({ label: child.name, value: child.ID }))}
                    onSelect={setSelectedChildId}
                    visible={childDropdownVisible}
                    setVisible={setChildDropdownVisible}
                />
            )}

            <DropdownPicker
                label="Select Task"
                selectedValue={selectedTaskId}
                options={tasks.map((task) => ({ label: task.title, value: task.id }))}
                onSelect={setSelectedTaskId}
                visible={taskDropdownVisible}
                setVisible={setTaskDropdownVisible}
            />

            <Pressable onPress={handleAssign} style={themeStyles.button}>
                <Text style={themeStyles.buttonText}>Assign Task</Text>
            </Pressable>
        </View>
    );
}