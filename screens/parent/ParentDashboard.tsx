import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../services/api';
import { themeStyles } from '../../styles/theme';
import StatusBadge from '../../components/StatusBadge';

export default function ParentDashboard() {
  const navigation = useNavigation<any>();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState<'pending' | 'approved'>('pending');
  const [parentCode, setParentCode] = useState<string | null>(null);

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

  const fetchParentCode = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await api.get(`/parent/code`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setParentCode(res.data.code ?? null);
    } catch (err) {
      console.error(err);
      setParentCode(null);
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
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTasks();
      fetchParentCode();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  return (
    <View style={themeStyles.container}>
      <Text style={themeStyles.title}>👩‍👧 Parent Dashboard</Text>

      {parentCode && (
        <View style={themeStyles.codeBoxContainer}>
          <Text style={themeStyles.codeBoxTitle}>Your Parent Code</Text>
          <Text style={themeStyles.codeBoxValue}>{parentCode}</Text>
        </View>
      )}

      <View style={themeStyles.row}>
        <Button
          title="Current"
          onPress={() => setFilter('pending')}
          color={filter === 'pending' ? '#3B82F6' : 'gray'}
        />
        <Button
          title="History"
          onPress={() => setFilter('approved')}
          color={filter === 'approved' ? '#3B82F6' : 'gray'}
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
            {filter === 'pending' && item.status?.toLowerCase() === 'awaiting_approval' && (
              <View style={themeStyles.buttonGroup}>
                <Button
                  title="Approve Task"
                  onPress={() => handleApproveTask(item.id)}
                  color="#10B981"
                />
              </View>
            )}
          </View>
        )}
      />

      <View style={themeStyles.buttonGroup}>
        <Button title="Assign New Task" onPress={() => navigation.navigate('CreateTask')} />
        <Button title="Manage Rewards" onPress={() => navigation.navigate('Rewards')} />
        <Button title="Log Out" onPress={handleLogout} color="#EF4444" />
      </View>
    </View>
  );
}