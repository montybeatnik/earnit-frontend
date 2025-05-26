import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../services/api';
import { useNavigation } from '@react-navigation/native';

export default function ChildDashboard() {
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState([]);
  const navigation = useNavigation<any>();

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
      const res = await api.get('/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data.tasks);
    } catch (err) {
      console.error(err);
      Alert.alert('Failed to load tasks');
    }
  };

  const handleSubmitTask = async (taskId: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await api.put(`/tasks/${taskId}/submit`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Success', 'Task submitted for approval');
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
    fetchTasks();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧒 Child Dashboard</Text>

      {user && (
        <Text style={styles.pointsBanner}>🌟 Points: {user.points}</Text>
      )}


      <FlatList
        data={tasks.filter(
          (t) => t.status?.toLowerCase() === 'pending' || t.status?.toLowerCase() === 'awaiting_approval'
        )}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text style={styles.points}>{item.points} pts</Text>
            <Text>Status: {item.status}</Text>

            {item.status?.toLowerCase() === 'pending' && (
              <Button
                title="Submit for Approval"
                onPress={() => handleSubmitTask(item.id)}
                color="blue"
              />
            )}

          </View>
        )}
      />

      <Text style={styles.subheader}>✅ Completed Tasks</Text>

      <FlatList
        data={tasks.filter((t) => t.status?.toLowerCase() === 'approved')}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text style={styles.points}>{item.points} pts</Text>
            <Text style={{ color: 'green' }}>Status: {item.status}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center' }}>No completed tasks yet</Text>}
      />

      <Button title="Reward Shop" onPress={() => navigation.navigate('RewardShop')} />

      <Button title="Log Out" onPress={handleLogout} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  taskCard: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 10,
  },
  taskTitle: { fontWeight: 'bold', fontSize: 16 },
  points: { fontStyle: 'italic', color: 'green' },

  subheader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },

  pointsBanner: {
    fontSize: 18,
    fontWeight: '600',
    color: 'green',
    textAlign: 'center',
    marginBottom: 12,
  },

});

