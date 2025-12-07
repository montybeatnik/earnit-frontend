import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { api } from '../../services/api';
import { useNavigation } from '@react-navigation/native';
import { decodeJwtPayload, storeSession } from '../../services/session';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<any>();

  const handleLogin = async () => {
    try {
      console.log('Attempting login with:', email, password);

      const res = await api.post('/login', { email, password });
      const token = res.data.token;
      const payload = decodeJwtPayload(token);
      const role = payload?.role || 'child';
      await storeSession(token, role);

      if (role === 'parent') {
        navigation.navigate('Parent');
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Child' }],
        });
      }
    } catch (err: any) {
      console.error('Login error:', err);
      Alert.alert('Login Failed', err.response?.data?.error || 'Invalid email or password');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: {
    marginVertical: 8,
    padding: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
  },
});
