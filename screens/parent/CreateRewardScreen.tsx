import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../services/api';

export default function CreateRewardScreen() {
    const navigation = useNavigation<any>();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [cost, setCost] = useState('');

    const handleSubmit = async () => {
        if (!title || !cost) {
            Alert.alert('Missing fields', 'Title and cost are required');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('token');
            await api.post(
                '/rewards',
                {
                    title,
                    description,
                    cost: parseInt(cost),
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            Alert.alert('Success', 'Reward created!');
            navigation.goBack();
        } catch (err) {
            console.error(err);
            Alert.alert('Error creating reward');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={styles.title}>Create Reward</Text>

                    <TextInput
                        placeholder="Reward Title"
                        value={title}
                        onChangeText={setTitle}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Description (optional)"
                        value={description}
                        onChangeText={setDescription}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Cost in points"
                        value={cost}
                        onChangeText={setCost}
                        keyboardType="numeric"
                        style={styles.input}
                    />

                    <Button title="Create Reward" onPress={handleSubmit} />
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'flex-start',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        marginBottom: 12,
        padding: 12,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 6,
    },
});