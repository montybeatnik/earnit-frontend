import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../services/api';

export default function AuthLoadingScreen() {
  const navigation = useNavigation<any>();

  // screens/auth/AuthLoadingScreen.tsx

  useEffect(() => {
    const bootstrapAsync = async () => {
      const token = await AsyncStorage.getItem('token');
      const role = await AsyncStorage.getItem('role');

      if (token && role) {
        navigation.reset({
          index: 0,
          routes: [{ name: role === 'parent' ? 'Parent' : 'Child' }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Onboarding' }],
        });
      }
    };

    bootstrapAsync();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}