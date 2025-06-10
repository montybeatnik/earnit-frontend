import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../services/api';
import { themeStyles, colors } from '../../styles/theme';
import StatusBadge from '../../components/StatusBadge';
import ThemedButton from '../../components/ThemedButton';
import Modal from 'react-native-modal';
import { Pressable } from 'react-native';

export default function ParentDashboardScreen() {
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<any>();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState<'pending' | 'approved'>('pending');
  const [parentCode, setParentCode] = useState<string | null>(null);

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

  return (
    <View style={themeStyles.fullScreenContainer}>
      <Text style={themeStyles.screenHeader}>👩‍👧 Parent Dashboard</Text>

      {parentCode && (
        <View style={themeStyles.codeBoxContainer}>
          <Text style={themeStyles.codeBoxTitle}>Your Parent Code</Text>
          <Text style={themeStyles.codeBoxValue}>{parentCode}</Text>
        </View>
      )}

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

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={
          <Text style={themeStyles.bodyCenter}>
            {filter === 'approved' ? 'No completed tasks yet' : 'No current tasks'}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={themeStyles.card}>
            <Text style={themeStyles.title}>{item.title}</Text>
            <Text style={themeStyles.small}>Assigned to: {item.assigned_to_name}</Text>
            <Text style={themeStyles.subtitle}>{item.description}</Text>

            <View style={{ marginTop: 8 }}>
              <Text style={themeStyles.body}>🏆 {item.points} points</Text>
              <StatusBadge status={item.status} />
              <Text style={themeStyles.small}>
                Created: {new Date(item.created_at).toLocaleDateString()} @{' '}
                {new Date(item.created_at).toLocaleTimeString()}
              </Text>
            </View>

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
      <Pressable
        onPress={() => setModalVisible(true)}
        style={{
          position: 'absolute',
          bottom: 30,
          right: 20,
          backgroundColor: colors.primary,
          borderRadius: 30,
          padding: 16,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        }}
      >
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>＋</Text>
      </Pressable>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={{ justifyContent: 'flex-end', margin: 0 }}
      >
        <View style={{
          backgroundColor: colors.background,
          padding: 20,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}>
          <Text style={[themeStyles.subtitle, { marginBottom: 12, textAlign: 'center' }]}>Quick Actions</Text>
          <ThemedButton title="Assign Task" onPress={() => {
            setModalVisible(false);
            navigation.navigate('AssignTask');
          }} />
          <ThemedButton title="Create New Task" onPress={() => {
            setModalVisible(false);
            navigation.navigate('CreateTaskTemplate');
          }} />
          <ThemedButton title="Manage Rewards" onPress={() => {
            setModalVisible(false);
            navigation.navigate('Rewards');
          }} />
          <ThemedButton title="Log Out" color={colors.danger} onPress={async () => {
            await AsyncStorage.removeItem('token');
            Alert.alert('Logged out');
            navigation.navigate('Login');
          }} />
        </View>
      </Modal>
    </View>

  );
}