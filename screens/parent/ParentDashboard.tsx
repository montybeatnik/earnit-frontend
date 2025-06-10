import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../services/api';
import { themeStyles, colors } from '../../styles/theme';
import StatusBadge from '../../components/StatusBadge';
import ThemedButton from '../../components/ThemedButton';

export default function ParentDashboardScreen() {
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
    <View style={themeStyles.fullScreenContainer}>
      <Text style={themeStyles.screenHeader}>👩‍👧 Parent Dashboard</Text>

      {parentCode && (
        <View style={themeStyles.codeBoxContainer}>
          <Text style={themeStyles.codeBoxTitle}>Your Parent Code</Text>
          <Text style={themeStyles.codeBoxValue}>{parentCode}</Text>
        </View>
      )}

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListHeaderComponent={
          <View>
            <View style={themeStyles.row}>
              <ThemedButton
                title="Current"
                onPress={() => setFilter('pending')}
                color={filter === 'pending' ? colors.primary : colors.gray}
              />
              <ThemedButton
                title="History"
                onPress={() => setFilter('approved')}
                color={filter === 'approved' ? colors.primary : colors.gray}
              />
            </View>

            <Text style={themeStyles.subtitle}>
              {filter === 'pending' ? 'Pending Tasks' : 'Completed Tasks'}
            </Text>
          </View>
        }
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
            <Text style={themeStyles.small}>Assigned to: {item.assigned_to_name}</Text>
            <Text style={themeStyles.small}>
              Created: {new Date(item.created_at).toLocaleDateString()} @{' '}
              {new Date(item.created_at).toLocaleTimeString()}
            </Text>
            {filter === 'pending' && item.status?.toLowerCase() === 'awaiting_approval' && (
              <View style={themeStyles.buttonGroup}>
                <ThemedButton
                  title="Approve Task"
                  onPress={() => handleApproveTask(item.id)}
                  color={colors.secondary}
                />
              </View>
            )}
          </View>
        )}
      />

      <View style={themeStyles.buttonGroup}>
        <ThemedButton title="Assign Task" onPress={() => navigation.navigate('AssignTask')} />
        <ThemedButton title="Create New Task" onPress={() => navigation.navigate('CreateTaskTemplate')} />
        <ThemedButton title="Manage Rewards" onPress={() => navigation.navigate('Rewards')} />
        <ThemedButton title="Log Out" onPress={handleLogout} color={colors.danger} />
      </View>
    </View>
  );
}