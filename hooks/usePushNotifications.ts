// usePushNotifications.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { api } from '../services/api';
import { getSession } from '../services/session';

export default function usePushNotifications() {
    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

    useEffect(() => {
        const register = async () => {
            const { token: authToken } = await getSession();
            if (!authToken) {
                return;
            }

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

            await api.post(`/push/register`, { token });
        };

        register();
    }, []);

    return expoPushToken;
}
