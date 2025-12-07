import React from 'react';
import { View, Button, StyleSheet, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../services/api';
import { storeSession } from '../services/session';

const DevSwitchUserScreen = () => {
    const navigation = useNavigation();

    const loginAs = async (email: string, password: string, role: 'parent' | 'child') => {
        try {
            const response = await api.post(`/login`, {
                email,
                password,
            });

            const token = response.data.token;
            console.log(`✅ Logged in as ${role}:`, token);

            await storeSession(token, role);

            navigation.navigate(role === 'parent' ? 'Parent' : 'Child');
        } catch (err) {
            console.error(`❌ Login failed for ${role}:`, err);
            Alert.alert('Login Failed', `Could not log in as ${role}.`);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dev Mode: Switch User</Text>
            <Button title="Switch to Parent" onPress={() => loginAs('parent@test.com', 'test123', 'parent')} />
            <View style={{ height: 20 }} />
            <Button title="Switch to Child" onPress={() => loginAs('child@test.com', 'test123', 'child')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 22, marginBottom: 20 },
});

export default DevSwitchUserScreen;
