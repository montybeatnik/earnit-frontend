import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../services/api';
import { theme } from '../../styles/theme';
import StatusBadge from '../../components/StatusBadge';

export default function ParentDashboard() {
  const navigation = useNavigation<any>();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState<'pending' | 'approved'>('pending');

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

  const handleApproveTask = async (taskId: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await api.put(`/tasks/${taskId}/complete`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Approved', 'Task has been approved!');
      fetchTasks();
    } catch (err) {
      console.error(err);
      Alert.alert('Error approving task');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    Alert.alert('Logged out');
    navigation.navigate('Login');
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchTasks);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  return (
    <View style={theme.container}>
      <Text style={styles.title}>👩‍👧 Parent Dashboard</Text>

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
            {filter === 'pending' && item.status?.toLowerCase() === 'awaiting_approval' && (
              <View style={theme.buttonSpacing}>
                <Button
                  title="Approve Task"
                  onPress={() => handleApproveTask(item.id)}
                  color="green"
                />
              </View>
            )}
          </View>
        )}
      />

      <View style={theme.buttonSpacing}>
        <Button title="Assign New Task" onPress={() => navigation.navigate('CreateTask')} />
      </View>

      <View style={theme.buttonSpacing}>
        <Button title="Manage Rewards" onPress={() => navigation.navigate('Rewards')} />
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
});