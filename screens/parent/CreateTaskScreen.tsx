import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    Alert,
    ImageBackground,
    ScrollView,
} from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { themeStyles, typography, spacing, colors } from '../../styles/theme';
import FloatingActionButton from '../../components/FloatingActionButton';

export default function CreateTaskScreen() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [points, setPoints] = useState('');
    const [children, setChildren] = useState([]);
    const [selectedChildIds, setSelectedChildIds] = useState<string[]>([]);
    const navigation = useNavigation<any>();
    const background = require('../../assets/create-task-bg.png');

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const res = await axios.get(`${API_BASE_URL}/children`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setChildren(res.data.children || []);
            } catch (err) {
                console.error('Failed to fetch children', err);
                Alert.alert('Error', 'Could not load children');
            }
        };

        fetchChildren();
    }, []);

    const toggleChild = (childId: string) => {
        setSelectedChildIds((prev) =>
            prev.includes(childId)
                ? prev.filter((id) => id !== childId)
                : [...prev, childId]
        );
    };

    const handleCreate = async () => {
        const pointsInt = parseInt(points, 10);
        if (!title || !description || isNaN(pointsInt) || selectedChildIds.length === 0) {
            Alert.alert('Missing fields', 'Please fill out all fields correctly.');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('token');
            await Promise.all(
                selectedChildIds.map((idStr) => {
                    const assignedToId = parseInt(idStr, 10);
                    return axios.post(
                        `${API_BASE_URL}/tasks`,
                        { title, description, points: pointsInt, assigned_to_id: assignedToId },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                })
            );

            Alert.alert('Success', 'Task(s) created!');
            setTitle('');
            setDescription('');
            setPoints('');
            setSelectedChildIds([]);
        } catch (err) {
            console.error('Task creation error:', err);
            Alert.alert('Error', 'Could not create task(s).');
        }
    };

    return (
        <ImageBackground source={background} style={{ flex: 1 }} resizeMode="cover">
            <ScrollView contentContainerStyle={themeStyles.fullScreenOverlay}>
                <Text style={[typography.title, { textAlign: 'center', marginBottom: spacing.lg }]}>Create a Task</Text>

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

                <Text style={[typography.subtitle, { marginTop: spacing.lg }]}>Assign To:</Text>

                {children.length === 0 ? (
                    <Text style={themeStyles.bodyCenter}>No children found.</Text>
                ) : (
                    <View style={{ width: '100%', marginTop: spacing.sm }}>
                        {children.map((child) => {
                            const idStr = child.id?.toString() || child.ID?.toString();
                            const isSelected = selectedChildIds.includes(idStr);

                            return (
                                <Pressable
                                    key={idStr}
                                    onPress={() => toggleChild(idStr)}
                                    style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}
                                >
                                    <View
                                        style={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: 4,
                                            borderWidth: 2,
                                            borderColor: isSelected ? colors.primary : colors.gray,
                                            backgroundColor: isSelected ? colors.primary : 'transparent',
                                            marginRight: 12,
                                        }}
                                    />
                                    <Text style={typography.body}>{child.name}</Text>
                                </Pressable>
                            );
                        })}
                    </View>
                )}

                <Pressable onPress={handleCreate} style={[themeStyles.button, { marginTop: spacing.lg }]}>
                    <Text style={themeStyles.buttonText}>Create Task</Text>
                </Pressable>
            </ScrollView>
            <FloatingActionButton onPress={() => Alert.alert('Quick Action')} />
        </ImageBackground>
    );
}