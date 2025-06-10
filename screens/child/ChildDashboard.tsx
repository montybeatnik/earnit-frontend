import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { API_BASE_URL } from '@env';
import { themeStyles } from '../../styles/theme';
import StatusBadge from '../../components/StatusBadge';

export default function ChildDashboard() {
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState<'pending' | 'approved'>('pending');
  const navigation = useNavigation<any>();

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTasks = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/tasks?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data.tasks);
    } catch (err) {
      console.error(err);
      Alert.alert('Failed to load tasks');
    }
  };

  const handleComplete = async (taskId: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/tasks/${taskId}/complete`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Submitted!', 'Task marked as complete. Awaiting approval.');
      fetchTasks();
    } catch (err) {
      console.error(err);
      Alert.alert('Error submitting task');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('role');
    navigation.navigate('Login');
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  return (
    <View style={themeStyles.container}>
      <Text style={themeStyles.title}>🧒 Child Dashboard</Text>
      {user && <Text style={styles.pointsBanner}>🌟 Points: {user.points}</Text>}

      <View style={styles.filterButtons}>
        <Button
          title="Current"
          onPress={() => setFilter('pending')}
          color={filter === 'pending' ? 'blue' : 'gray'}
        />
        <View style={{ width: 10 }} />
        <Button
          title="History"
          onPress={() => setFilter('approved')}
          color={filter === 'approved' ? 'blue' : 'gray'}
        />
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={themeStyles.bodyCenter}>
            {filter === 'approved' ? 'No completed tasks yet' : 'No current tasks'}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={themeStyles.card}>
            <Text style={themeStyles.title}>{item.title}</Text>
            <Text style={themeStyles.subtitle}>{item.description}</Text>
            <Text style={themeStyles.body}>🏆 {item.points} points</Text>
            <StatusBadge status={item.status} />
            <Text style={themeStyles.small}>
              Created: {new Date(item.created_at).toLocaleDateString()} @{' '}
              {new Date(item.created_at).toLocaleTimeString()}
            </Text>
            {filter === 'pending' && item.status === 'pending' && (
              <View style={styles.buttonSpacing}>
                <Button
                  title="Mark Complete"
                  onPress={() => handleComplete(item.id)}
                  color="green"
                />
              </View>
            )}
          </View>
        )}
      />

      <View style={styles.buttonSpacing}>
        <Button title="Reward Shop" onPress={() => navigation.navigate('RewardShop')} />
      </View>

      <View style={styles.buttonSpacing}>
        <Button title="Log Out" onPress={handleLogout} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pointsBanner: {
    fontSize: 18,
    fontWeight: '600',
    color: 'green',
    textAlign: 'center',
    marginBottom: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonSpacing: {
    marginTop: 10,
  },
});