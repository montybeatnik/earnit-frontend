import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { api } from '../../services/api';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const passedEmail = route.params?.email || '';
  const [email, setEmail] = useState(passedEmail);

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
    try {
      const payload = {
        ...form,
        parent_id: form.role === 'child' ? Number(form.parent_id) : undefined,
      };
      const res = await api.post('/register', payload);
      const token = res.data.token;
      await AsyncStorage.setItem('token', token);
      Alert.alert('Success', 'Account created!');

      const role = payload.role;
      if (role === 'parent') {
        navigation.navigate('Parent');
      } else {
        navigation.navigate('Child');
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Name"
        style={styles.input}
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
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        onChangeText={(text) => handleChange('password', text)}
      />
      <Picker
        selectedValue={form.role}
        style={styles.input}
        onValueChange={(value) => handleChange('role', value)}
      >
        <Picker.Item label="Parent" value="parent" />
        <Picker.Item label="Child" value="child" />
      </Picker>
      {form.role === 'child' && (
        <TextInput
          placeholder="Parent ID"
          style={styles.input}
          keyboardType="numeric"
          onChangeText={(text) => handleChange('parent_id', text)}
        />
      )}
      <Button title="Register" onPress={handleRegister} />
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