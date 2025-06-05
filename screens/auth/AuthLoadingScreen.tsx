import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../services/api';

export default function AuthLoadingScreen() {
  const navigation = useNavigation<any>();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      const onboardingComplete = await AsyncStorage.getItem('onboardingComplete');
      const role = await AsyncStorage.getItem('role');

      if (!token) {
        navigation.navigate('Landing');
      } else if (onboardingComplete !== 'true') {
        navigation.navigate('Welcome');
      } else {
        navigation.navigate(role === 'parent' ? 'Parent' : 'Child');
      }
    };

    checkAuth();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}