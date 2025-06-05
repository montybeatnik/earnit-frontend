import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    Switch,
    Keyboard,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../services/api';
import { Picker } from '@react-native-picker/picker';
import { themeStyles, typography } from '../../styles/theme';

export default function CreateTaskScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [points, setPoints] = useState('');
    const [children, setChildren] = useState([]);
    const [selectedChildId, setSelectedChildId] = useState(null);
    const [useTemplate, setUseTemplate] = useState(true);
    const [templates, setTemplates] = useState([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');

                const [childRes, templateRes] = await Promise.all([
                    api.get('/children', { headers: { Authorization: `Bearer ${token}` } }),
                    api.get('/task-templates', { headers: { Authorization: `Bearer ${token}` } }),
                ]);

                setChildren(childRes.data.children);
                setTemplates(templateRes.data.templates);
            } catch (err) {
                console.error(err);
                Alert.alert('Error', 'Unable to fetch templates or children');
            }
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        if (useTemplate && selectedTemplateId) {
            const template = templates.find((t) => t.id === Number(selectedTemplateId));
            if (template) {
                setTitle(template.title);
                setDescription(template.description);
                setPoints(template.points.toString());
            }
        } else {
            setTitle('');
            setDescription('');
            setPoints('');
        }
    }, [selectedTemplateId, useTemplate]);

    const isValid = () => {
        if (!title.trim()) {
            console.log('Validation failed: Title is empty');
            Alert.alert('Validation Error', 'Title is required.');
            return false;
        }
        const parsedPoints = parseInt(points, 10);
        if (isNaN(parsedPoints) || parsedPoints <= 0) {
            console.log('Validation failed: Invalid points', points);
            Alert.alert('Validation Error', 'Points must be a positive number.');
            return false;
        }
        if (!selectedChildId) {
            console.log('Validation failed: No child selected');
            Alert.alert('Validation Error', 'Please select a child to assign the task to.');
            return false;
        }
        console.log('Validation passed');
        return true;
    };

    const handleCreate = async () => {
        console.log('Create Task button pressed')
        if (!isValid()) return;

        try {
            const token = await AsyncStorage.getItem('token');
            const payload = {
                title: title.trim(),
                description: description.trim(),
                points: parseInt(points, 10),
                assigned_to_id: Number(selectedChildId),
            };

            await api.post('/tasks', payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            Alert.alert('Success', 'Task Created!');
            navigation.goBack();
        } catch (err) {
            console.error('Task creation error:', err);
            Alert.alert('Error', err.response?.data?.error || 'Failed to create task.');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={themeStyles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={typography.title}>Assign Task</Text>

                    <View style={themeStyles.row}>
                        <Text style={{ flex: 1 }}>Use Template</Text>
                        <Switch value={useTemplate} onValueChange={setUseTemplate} />
                    </View>

                    {useTemplate ? (
                        <Picker
                            selectedValue={selectedTemplateId}
                            onValueChange={setSelectedTemplateId}
                            style={themeStyles.input}
                        >
                            <Picker.Item label="Select a template" value={null} />
                            {templates.map((t) => (
                                <Picker.Item key={t.id} label={t.title} value={t.id} />
                            ))}
                        </Picker>
                    ) : (
                        <>
                            <TextInput
                                placeholder="Task Title *"
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
                                placeholder="Points *"
                                value={points}
                                onChangeText={setPoints}
                                keyboardType="numeric"
                                style={themeStyles.input}
                            />
                        </>
                    )}

                    <Picker
                        selectedValue={selectedChildId}
                        onValueChange={setSelectedChildId}
                        style={themeStyles.input}
                    >
                        <Picker.Item label="Assign to child *" value={null} />
                        {children.map((child) => (
                            <Picker.Item key={child.id} label={child.name} value={child.id} />
                        ))}
                    </Picker>

                    <View style={themeStyles.button}>
                        <Button title="Create Task" onPress={handleCreate} />
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}