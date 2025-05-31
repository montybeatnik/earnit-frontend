import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../services/api';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../styles/theme';
import StatusBadge from '../../components/StatusBadge';

export default function ChildDashboard() {
  const [user, setUser] = useState<any>(null);
  const navigation = useNavigation<any>();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState<'pending' | 'approved'>('pending');

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await api.get('/me', {
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
      const res = await api.get(`/tasks?status=${filter}`, {
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
      await api.put(`/tasks/${taskId}/complete`, null, {
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
    navigation.navigate('Login');
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchTasks);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={theme.container}>
      <Text style={styles.title}>🧒 Child Dashboard</Text>
      {user && <Text style={styles.pointsBanner}>🌟 Points: {user.points}</Text>}

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
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
          <Text style={{ textAlign: 'center' }}>
            {filter === 'approved' ? 'No completed tasks yet' : 'No current tasks'}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={theme.card}>
            <Text style={theme.title}>{item.title}</Text>
            <Text style={theme.subtitle}>{item.description}</Text>
            <Text style={theme.points}>🏆 {item.points} points</Text>
            <StatusBadge status={item.status} />
            <Text style={theme.timestamp}>
              Created: {new Date(item.created_at).toLocaleDateString()} @ {new Date(item.created_at).toLocaleTimeString()}
            </Text>
            {filter === 'pending' && item.status === 'pending' && (
              <View style={theme.buttonSpacing}>
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

      <View style={theme.buttonSpacing}>
        <Button title="Reward Shop" onPress={() => navigation.navigate('RewardShop')} />
      </View>

      <View style={theme.buttonSpacing}>
        <Button title="Log Out" onPress={handleLogout} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  pointsBanner: {
    fontSize: 18,
    fontWeight: '600',
    color: 'green',
    textAlign: 'center',
    marginBottom: 12,
  },
});