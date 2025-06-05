import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StarterSetupScreen() {
    const navigation = useNavigation<any>();

    const handleLoadStarterContent = async () => {
        const token = await AsyncStorage.getItem('token');
        try {
            await api.post('/setup-starter-content', null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            navigation.navigate('ParentDashboard'); // or 'ChildDashboard'
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Want help getting started?</Text>
            <Text style={styles.subText}>We can add a few common tasks and rewards for you.</Text>

            <Button title="Yes, set up starter tasks" onPress={handleLoadStarterContent} />
            <View style={{ height: 20 }} />
            <Button title="No thanks, I'll start fresh" onPress={() => navigation.navigate('ParentDashboard')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    text: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
    subText: { fontSize: 16, marginBottom: 24 },
});