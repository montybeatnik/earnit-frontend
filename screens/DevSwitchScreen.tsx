// screens/DevSwitchScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { api } from '../services/api';
import { themeStyles } from '../styles/theme';

export default function DevSwitchScreen() {
    const navigation = useNavigation<any>();
    const [userInfo, setUserInfo] = useState<any>(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (token) {
                    const res = await api.get('/me', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUserInfo(res.data.user);
                } else {
                    setUserInfo(null);
                }
            } catch (err) {
                setUserInfo(null);
            }
        };

        fetchUserInfo();
    }, []);

    const clearToken = async () => {
        await AsyncStorage.removeItem('token');
        setUserInfo(null);
        Alert.alert('Token cleared');
    };

    return (
        <View style={themeStyles.container}>
            <Text style={themeStyles.title}>🛠 Dev Switch Screen</Text>

            {userInfo ? (
                <View>
                    <Text style={themeStyles.subtitle}>Logged in as: {userInfo.name || userInfo.username}</Text>
                    <Text style={themeStyles.subtitle}>Role: {userInfo.role}</Text>
                </View>
            ) : (
                <Text style={themeStyles.subtitle}>Not logged in</Text>
            )}

            <View style={themeStyles.buttonGroup}>
                <Button title="👨‍👩‍👧 Register Parent" onPress={() => navigation.navigate('CreateAccount')} />
                <Button title="🔑 Login as Parent" onPress={() => navigation.navigate('Login')} />
                <Button title="👧 Child Setup (via Code)" onPress={() => navigation.navigate('LinkToYourParent')} />
                <Button title="🔐 Login as Child" onPress={() => navigation.navigate('Login')} />
                <Button title="❌ Clear Token" color="red" onPress={clearToken} />
            </View>
        </View>
    );
}