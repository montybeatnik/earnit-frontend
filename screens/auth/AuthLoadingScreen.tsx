import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function AuthLoadingScreen() {
  const navigation = useNavigation<any>();

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        try {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          const role = decoded.role;
          navigation.reset({
            index: 0,
            routes: [{ name: role === 'parent' ? 'Parent' : 'ChildDashboard' }],
          });
        } catch (e) {
          await AsyncStorage.removeItem('token');
          navigation.replace('Login');
        }
      } else {
        navigation.replace('Login');
      }
    };

    checkToken();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
