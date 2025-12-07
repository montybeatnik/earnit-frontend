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
import { useNavigation } from '@react-navigation/native';
import { themeStyles } from '../../styles/theme';
import { api } from '../../services/api';
import { storeSession } from '../../services/session';

export default function ChildLoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleLogin = async () => {
        try {
            const res = await api.post(`/child/login`, {
                username,
                password,
            });

            const { token } = res.data;
            if (token) {
                await storeSession(token, 'child');
                navigation.navigate('Child');
            } else {
                Alert.alert('Login failed', 'No token received');
            }
        } catch (err) {
            console.error(err);
            Alert.alert('Login failed', 'Invalid username or password');
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
                    <Text style={themeStyles.title}>Child Login</Text>

                    <TextInput
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                        style={themeStyles.input}
                        autoCapitalize="none"
                    />

                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="password"
                        textContentType="password"
                        importantForAutofill="no"
                        style={themeStyles.input}
                    />

                    <Pressable onPress={handleLogin} style={themeStyles.button}>
                        <Text style={themeStyles.buttonText}>Login</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
