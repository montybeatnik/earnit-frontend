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
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { themeStyles, typography, colors, spacing } from '../../styles/theme';
import { api } from '../../services/api';
import { storeSession } from '../../services/session';
import { storeValue } from '../../services/session';


export default function ParentRegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation<any>();

    const handleRegister = async () => {
        try {
            const res = await api.post(`/register`, {
                name,
                email,
                password,
                role: 'parent',
            });

            const token = res.data.token;
            if (token) {
                await storeSession(token, 'parent');

                // ✅ Fetch and store parent code
                const parent_code_res = await api.get(`/parent/code`);
                const parent_code_resp = parent_code_res.data;

                if (parent_code_resp.code) {
                    await storeValue('parentCode', parent_code_resp.code);
                    console.log('Stored parent code:', parent_code_resp.code);
                } else {
                    console.warn('Parent code was null or missing');
                }

                navigation.navigate('BoilerplateSelection');
            } else {
                Alert.alert('Registration failed', 'No token returned');
            }

        } catch (err) {
            console.error('Registration error:', err);
            Alert.alert('Registration failed', 'Check your input or try again later');
        }
    };

    const Wrapper = Platform.OS === 'web' ? View : KeyboardAvoidingView;

    return (
        <Wrapper
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={themeStyles.fullScreenContainer}
        >
            <TouchableWithoutFeedback
                onPress={Platform.OS !== 'web' ? Keyboard.dismiss : undefined}
            >
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'center',
                        padding: spacing.lg,
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={[typography.title, { marginBottom: spacing.lg }]}>
                        Create Your Account
                    </Text>

                    <TextInput
                        placeholder="Full Name"
                        value={name}
                        onChangeText={setName}
                        style={themeStyles.input}
                    />
                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        style={themeStyles.input}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        style={themeStyles.input}
                        secureTextEntry
                    />

                    <Pressable
                        onPress={handleRegister}
                        style={{
                            backgroundColor: colors.primary,
                            padding: spacing.md,
                            borderRadius: 8,
                            alignItems: 'center',
                            marginTop: spacing.lg,
                        }}
                    >
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Register</Text>
                    </Pressable>
                </ScrollView>
            </TouchableWithoutFeedback>
        </Wrapper>
    );
}
