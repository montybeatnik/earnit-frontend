import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    StyleSheet,
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
                Alert.alert('Error fetching data');
            }
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        if (useTemplate && selectedTemplateId) {
            const template = templates.find((t) => t.id === selectedTemplateId);
            if (template) {
                setTitle(template.title);
                setDescription(template.description);
                setPoints(template.points.toString());
            }
        }
    }, [selectedTemplateId]);

    const handleCreate = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            await api.post(
                '/tasks',
                {
                    title,
                    description,
                    points: parseInt(points),
                    assigned_to_id: selectedChildId,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            Alert.alert('Task Created!');
            navigation.goBack();
        } catch (err) {
            console.error(err);
            Alert.alert('Error creating task');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, padding: 20 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={styles.title}>Assign Task</Text>

                    <View style={styles.row}>
                        <Text style={{ flex: 1 }}>Use Template</Text>
                        <Switch value={useTemplate} onValueChange={setUseTemplate} />
                    </View>

                    {useTemplate ? (
                        <Picker
                            selectedValue={selectedTemplateId}
                            onValueChange={(value) => setSelectedTemplateId(value)}
                            style={styles.input}
                        >
                            <Picker.Item label="Select a template" value={null} />
                            {templates.map((t) => (
                                <Picker.Item key={t.id} label={t.title} value={t.id} />
                            ))}
                        </Picker>
                    ) : (
                        <>
                            <TextInput
                                placeholder="Task Title"
                                value={title}
                                onChangeText={setTitle}
                                style={styles.input}
                            />
                            <TextInput
                                placeholder="Description"
                                value={description}
                                onChangeText={setDescription}
                                style={styles.input}
                            />
                            <TextInput
                                placeholder="Points"
                                value={points}
                                onChangeText={setPoints}
                                keyboardType="numeric"
                                style={styles.input}
                            />
                        </>
                    )}

                    <Picker
                        selectedValue={selectedChildId}
                        onValueChange={(value) => setSelectedChildId(value)}
                        style={styles.input}
                    >
                        <Picker.Item label="Assign to child" value={null} />
                        {children.map((child) => (
                            <Picker.Item key={child.id} label={child.name} value={child.id} />
                        ))}
                    </Picker>

                    <Button title="Create Task" onPress={handleCreate} />
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );

}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },

    scrollContainer: {
        padding: 20,
        flexGrow: 1,
        justifyContent: 'flex-start',
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        marginVertical: 8,
        padding: 12,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 6,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },


});
