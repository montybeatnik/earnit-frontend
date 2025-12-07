import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './navigation/AuthNavigator';
import DevFooter from './components/DevFooter';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { getSession } from './services/session';
import { api } from './services/api';

declare const __DEV__: boolean;

export default function App() {
  console.log("Dev mode?", __DEV__);

  useEffect(() => {
    registerForPushNotifications();
  }, []);

  async function registerForPushNotifications() {
    const { token: authToken } = await getSession();
    if (!authToken) {
      console.log("ℹ️ Skipping push registration: no active session");
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log("❌ Push notification permission not granted");
      return;
    }

    const pushToken = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("📱 Expo Push Token:", pushToken);

    try {
      await api.post('/push-token', { token: pushToken });
      console.log("✅ Push token sent to backend");
    } catch (error) {
      console.error("❌ Failed to send push token:", (error as any)?.message);
    }
  }

  return (
    <NavigationContainer>
      <AuthNavigator />
      {__DEV__ && <DevFooter />}
    </NavigationContainer>
  );
}
