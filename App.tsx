import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './navigation/AuthNavigator';
import DevFooter from './components/DevFooter';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from '@env';

declare const __DEV__: boolean;

export default function App() {
  console.log("Dev mode?", __DEV__);

  useEffect(() => {
    registerForPushNotifications();
  }, []);

  async function registerForPushNotifications() {
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
      const authToken = await AsyncStorage.getItem("token");
      await axios.post(`${API_BASE_URL}/push-token`, { token: pushToken }, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      console.log("✅ Push token sent to backend");
    } catch (error) {
      console.error("❌ Failed to send push token:", error.message);
    }
  }

  return (
    <NavigationContainer>
      <AuthNavigator />
      {__DEV__ && <DevFooter />}
    </NavigationContainer>
  );
}