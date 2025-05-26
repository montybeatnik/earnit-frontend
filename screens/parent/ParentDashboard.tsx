import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../services/api';

export default function ParentDashboard() {
  const navigation = useNavigation<any>();
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await api.get('/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      //   console.log(res.data.tasks) // here for debugging
      setTasks(res.data.tasks);
    } catch (err: any) {
      console.error(err);
      Alert.alert('Failed to load tasks');
    }
  };

  const handleApproveTask = async (taskId: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await api.put(`/tasks/${taskId}/complete`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Approved', 'Task has been approved!');
      fetchTasks(); // refresh list
    } catch (err) {
      console.error(err);
      Alert.alert('Error approving task');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    Alert.alert('Logged out');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👩‍👧 Parent Dashboard</Text>

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
            {item.status?.toLowerCase() === 'awaiting_approval' && (
              <Button
                title="Approve Task"
                onPress={() => handleApproveTask(item.id)}
                color="green"
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


      <Button title="Assign New Task" onPress={() => navigation.navigate('CreateTask')} />

      <View style={{ marginVertical: 20 }} />
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

});
