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
      if (token) {
        try {
          const res = await api.get('/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const role = res.data.user.role;
          if (role === 'parent') {
            navigation.reset({ index: 0, routes: [{ name: 'ParentDashboard' }] });
          } else {
            navigation.reset({ index: 0, routes: [{ name: 'ChildDashboard' }] });
          }
        } catch {
          // Token invalid or expired
          navigation.reset({ index: 0, routes: [{ name: 'Landing' }] });
        }
      } else {
        // No token = new or logged-out user
        navigation.reset({ index: 0, routes: [{ name: 'Landing' }] });
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