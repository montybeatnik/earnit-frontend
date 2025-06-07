import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_BASE_URL } from '@env';
import { themeStyles } from '../../styles/theme';

export default function ChildPasswordSetupScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    const route = useRoute();
    const { childId } = route.params as { childId: number };

    const handleSetCredentials = async () => {
        if (!username.trim() || !password.trim()) {
            Alert.alert('Missing info', 'Please enter both username and password.');
            return;
        }

        try {
            const res = await axios.post(`${API_BASE_URL}/children/${childId}/setup-password`, {
                username,
                password,
            });

            if (res.status === 200) {
                Alert.alert('Success', 'Credentials set! You can now log in.');
                navigation.navigate('ChildLogin');
            } else {
                throw new Error('Unexpected response');
            }
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Username might already be taken or something went wrong.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={themeStyles.fullScreenContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={100}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
                <View style={{ alignItems: 'center' }}>
                    <Text style={themeStyles.title}>Create Your Login</Text>

                    <TextInput
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={themeStyles.input}
                    />

                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="password"
                        textContentType="newPassword"
                        style={themeStyles.input}
                    />

                    <Pressable onPress={handleSetCredentials} style={themeStyles.button}>
                        <Text style={themeStyles.buttonText}>Submit</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}