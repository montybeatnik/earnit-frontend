import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { themeStyles, typography, spacing } from '../../styles/theme';

export default function CreateTaskScreen() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [points, setPoints] = useState('');
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState('');
    const navigation = useNavigation<any>();
    const [selectedChildId, setSelectedChildId] = useState('');

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const res = await axios.get(`${API_BASE_URL}/children`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setChildren(res.data.children);
                if (res.data.children.length > 0) {
                    setSelectedChild(res.data.children[0].id.toString());
                }
            } catch (err) {
                console.error('Failed to fetch children', err);
                Alert.alert('Error', 'Could not load children');
            }
        };

        fetchChildren();
    }, []);

    const handleCreate = async () => {
        const pointsInt = parseInt(points, 10);
        const assignedToId = parseInt(selectedChildId, 10);

        if (!title || !description || isNaN(pointsInt) || isNaN(assignedToId)) {
            Alert.alert('Missing fields', 'Please fill out all fields correctly.');
            return;
        }

        const token = await AsyncStorage.getItem('token');

        try {
            await axios.post(`${API_BASE_URL}/tasks`, {
                title,
                description,
                points: pointsInt,
                assigned_to_id: assignedToId, // ✅ Converted to number here
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            Alert.alert('Success', 'Task created!');
            // Optionally reset inputs here
        } catch (err) {
            console.error('Task creation error:', err);
            Alert.alert('Error', 'Could not create task.');
        }
    };

    return (
        <View style={themeStyles.fullScreenContainer}>
            <Text style={[typography.title, { textAlign: 'center', marginBottom: spacing.lg }]}>Create Task</Text>

            <TextInput
                placeholder="Task Title"
                value={title}
                onChangeText={setTitle}
                style={themeStyles.input}
            />

            <TextInput
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                style={themeStyles.input}
            />

            <TextInput
                placeholder="Points"
                value={points}
                onChangeText={setPoints}
                keyboardType="numeric"
                style={themeStyles.input}
            />

            <Text style={themeStyles.label}>Assign To:</Text>
            <Picker
                selectedValue={selectedChildId}
                onValueChange={(itemValue) => setSelectedChildId(itemValue)}
            >
                {children.map((child) => (
                    <Picker.Item key={child.id} label={child.username} value={child.id.toString()} />
                ))}
            </Picker>

            <Pressable onPress={handleCreate} style={themeStyles.button}>
                <Text style={themeStyles.buttonText}>Create</Text>
            </Pressable>
        </View>
    );
}