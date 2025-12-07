// --- 1. UI Update: CompleteTaskScreen.js (Child)

import React, { useState } from 'react';
import { View, Text, Pressable, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { api } from '../../services/api';
import { themeStyles } from '../../styles/theme';


export default function CompleteTaskScreen({ route, navigation }) {
    const { taskId } = route.params;
    const [photo, setPhoto] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const askPhoto = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permission needed', 'Camera access is required.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.5,
            base64: true
        });

        if (!result.canceled) {
            setPhoto(result.assets[0]);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const formData = new FormData();


            console.log('Photo object:', photo);
            if (photo) {
                formData.append('photo', {
                    uri: photo.uri,
                    name: 'task-photo.jpg',
                    type: 'image/jpeg',
                });
            }

            console.log('Submitting task with ID:', taskId);
            console.log('Final URL:', `/tasks/${taskId}/submit`);
            await api.put(`/tasks/${taskId}/submit`, formData);

            Alert.alert('✅ Submitted', 'Task marked for approval!');
            navigation.goBack();
        } catch (err) {
            console.error('Error submitting task:', err.response?.data || err.message);
            Alert.alert('Error', 'Could not submit task');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={themeStyles.fullScreenContainer}>
            <Text style={themeStyles.screenHeader}>📸 Submit Task</Text>

            {photo && (
                <Image
                    source={{ uri: photo.uri }}
                    style={{ width: 200, height: 200, marginBottom: 16 }}
                />
            )}

            <Pressable style={themeStyles.button} onPress={askPhoto}>
                <Text style={themeStyles.buttonText}>Take a Photo</Text>
            </Pressable>

            <Pressable
                style={[themeStyles.button, { marginTop: 12 }]}
                onPress={handleSubmit}
                disabled={submitting}
            >
                <Text style={themeStyles.buttonText}>Submit Task</Text>
            </Pressable>
        </View>
    );
}
