// usePushNotifications.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function usePushNotifications() {
    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

    useEffect(() => {
        const register = async () => {
            if (!Device.isDevice) {
                Alert.alert('Push notifications only work on physical devices.');
                return;
            }

            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                Alert.alert('Permission for push notifications was not granted');
                return;
            }

            const token = (await Notifications.getExpoPushTokenAsync()).data;
            setExpoPushToken(token);

            const authToken = await AsyncStorage.getItem('token');
            if (authToken) {
                await axios.post(`${API_BASE_URL}/push/register`, { token }, {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
            }
        };

        register();
    }, []);

    return expoPushToken;
}