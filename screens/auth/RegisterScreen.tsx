import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, Pressable, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { api } from '../../services/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing, typography, themeStyles } from '../../styles/theme';
import { decodeJwtPayload, storeSession } from '../../services/session';

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const passedEmail = route.params?.email || '';
  const [email, setEmail] = useState(passedEmail);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: passedEmail,
    password: '',
    role: 'parent',
    parent_id: '',
  });

  useEffect(() => {
    if (passedEmail) {
      setForm((prev) => ({ ...prev, email: passedEmail }));
    }
  }, [passedEmail]);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleRegister = async () => {
    if (!form.name || !email || !form.password) {
      Alert.alert('Missing info', 'Please enter name, email, and password.');
      return;
    }
    setLoading(true);
    try {
      console.log('Register payload', { ...form, email });
      const payload = {
        ...form,
        email,
        parent_id: form.role === 'child' ? Number(form.parent_id) : undefined,
      };

      const res = await api.post('/register', payload);
      const token = res.data.token;
      const decoded = decodeJwtPayload(token);
      const role = decoded?.role || payload.role || 'parent';
      await storeSession(token, role);

      Alert.alert('Success', 'Account created!');

      // Navigate to onboarding flow (regardless of role for now)
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (err: any) {
      console.error('Register error', err?.message, err?.response?.data);
      const msg = err.response?.data?.error || err.message || 'Registration failed';
      if (err.response?.status === 409) {
        Alert.alert('Account exists', 'This email is already registered. Please log in instead.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={themeStyles.container}>
      <TextInput
        placeholder="Name"
        style={themeStyles.input}
        onChangeText={(text) => handleChange('name', text)}
      />
      <TextInput
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          handleChange('email', text);
        }}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={themeStyles.input}
      />
      <TextInput
        placeholder="Password"
        style={themeStyles.input}
        secureTextEntry
        onChangeText={(text) => handleChange('password', text)}
      />
      <Picker
        selectedValue={form.role}
        style={themeStyles.input}
        onValueChange={(value) => handleChange('role', value)}
      >
        <Picker.Item label="Parent" value="parent" />
        <Picker.Item label="Child" value="child" />
      </Picker>
      {form.role === 'child' && (
        <TextInput
          placeholder="Parent ID"
          style={themeStyles.input}
          keyboardType="numeric"
          onChangeText={(text) => handleChange('parent_id', text)}
        />
      )}
      <Pressable
        style={[themeStyles.button, { width: '100%', opacity: loading ? 0.7 : 1 }]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={themeStyles.buttonText}>Register</Text>
        )}
      </Pressable>

      <Pressable
        style={{ marginTop: spacing.sm }}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={{ color: colors.primary, textAlign: 'center' }}>
          Already have an account? Log in
        </Text>
      </Pressable>
    </View>
  );
}
