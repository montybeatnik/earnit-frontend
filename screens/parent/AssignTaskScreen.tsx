import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Alert,
    Pressable,
    ImageBackground,
    Animated,
    Easing,
    StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../services/api';
import { themeStyles } from '../../styles/theme';
import DropdownPicker from '../../components/DropdownPicker';
import FloatingActionButton from '../../components/FloatingActionButton';


export default function AssignTaskScreen() {
    const [children, setChildren] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedChildId, setSelectedChildId] = useState(null);
    const [selectedTaskId, setSelectedTaskId] = useState(null);

    const [childDropdownVisible, setChildDropdownVisible] = useState(false);
    const [taskDropdownVisible, setTaskDropdownVisible] = useState(false);

    const background = require('../../assets/assign-task-bg.png');
    const scaleAnim = useState(new Animated.Value(1))[0];

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

                const taskRes = await api.get('/boilerplate/tasks', { headers });
                setTasks(taskRes.data.tasks);
            } catch (err) {
                console.error('Failed to fetch tasks or children:', err);
                Alert.alert('Error', 'Could not load data');
            }
        };

        fetchData();
    }, []);

    const triggerAnimation = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.2,
                duration: 150,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 150,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start();
    };

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

            triggerAnimation();
            Alert.alert('✅ Success!', 'Task assigned!');
            setSelectedTaskId(null);
            if (children.length > 1) setSelectedChildId(null);
        } catch (err) {
            console.error('Task assignment error:', err);
            Alert.alert('Error', 'Could not assign task.');
        }
    };

    return (
        <ImageBackground
            source={background}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
        >
            <View style={[themeStyles.fullScreenOverlay]}>
                <Text style={themeStyles.screenHeader}>📝 Assign a Task</Text>

                <View style={themeStyles.buttonGroup}>
                    {children.length > 1 && (
                        <DropdownPicker
                            label="Select Child"
                            selectedValue={selectedChildId}
                            options={children.map((child) => ({
                                label: child.name,
                                value: child.ID,
                            }))}
                            onSelect={setSelectedChildId}
                            visible={childDropdownVisible}
                            setVisible={setChildDropdownVisible}
                        />
                    )}

                    <DropdownPicker
                        label="Select Task"
                        selectedValue={selectedTaskId}
                        options={tasks.map((task) => ({
                            label: task.title,
                            value: task.id,
                        }))}
                        onSelect={setSelectedTaskId}
                        visible={taskDropdownVisible}
                        setVisible={setTaskDropdownVisible}
                    />


                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                        <Pressable style={themeStyles.button} onPress={handleAssign}>
                            <Text style={themeStyles.buttonText}>Assign Task</Text>
                        </Pressable>
                    </Animated.View>

                </View>
                {/* you're using a different approach (hard coded) on the dashboard
                  You'll probably want to add some conditionals to not present an 
                  option for the current screen. 
                 */}
                <FloatingActionButton onPress={() => Alert.alert('Quick Action!')} />
            </View>
        </ImageBackground>
    );
}
