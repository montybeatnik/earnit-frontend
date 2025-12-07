import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  Pressable,
  ImageBackground,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../services/api';
import { themeStyles, colors } from '../../styles/theme';
import StatusBadge from '../../components/StatusBadge';
import ThemedButton from '../../components/ThemedButton';
import Modal from 'react-native-modal';
import { LinearGradient } from 'expo-linear-gradient';
import useWebSocket from '../../hooks/useWebSocket';
import { API_BASE_URL } from '@env';
import { clearSession } from '../../services/session';

const background = require('../../assets/parent-bg.png'); // Add a background image here

export default function ParentDashboardScreen() {
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<any>();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState<'pending' | 'approved'>('pending');
  const [parentCode, setParentCode] = useState<string | null>(null);
  const lastMessage = useWebSocket();

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

  useEffect(() => {
    if (lastMessage) {
      Alert.alert('Notification', lastMessage);
    }
  }, [lastMessage]);

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks?status=${filter}`);
      setTasks(res.data.tasks);
    } catch (err) {
      console.error(err);
      Alert.alert('Failed to load tasks');
    }
  };

  const fetchParentCode = async () => {
    try {
      const res = await api.get(`/parent/code`);
      setParentCode(res.data.code ?? null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveTask = async (taskId: number) => {
    try {
      await api.put(`/tasks/${taskId}/approve`, null);
      Alert.alert('Approved', 'Task has been approved!');
      fetchTasks();
    } catch (err) {
      console.error(err);
      Alert.alert('Error approving task');
    }
  };

  return (
    <ImageBackground source={background} style={{ flex: 1 }} resizeMode="cover">
      <LinearGradient colors={['#ffffffcc', '#fff0']} style={{ flex: 1, padding: 16 }}>
        <Text style={themeStyles.screenHeader}>👩‍👧 Parent Dashboard</Text>

        {parentCode && (
          <View style={{
            backgroundColor: '#FEF9C3',
            borderRadius: 16,
            padding: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 3,
            marginVertical: 16,
            alignItems: 'center',
          }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#92400E' }}>
              👨‍👩‍👧 Parent Code
            </Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#92400E' }}>
              {parentCode}
            </Text>
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
              {item.photo_url && (
                <View style={{ marginVertical: 8, alignItems: 'center' }}>
                  <Text style={[themeStyles.small, { marginBottom: 4 }]}>📸 Submitted Photo:</Text>
                  <Image
                    source={{ uri: `${API_BASE_URL}/${item.photo_url.replace(/^\/+/, '')}` }}
                    style={{
                      width: 220,
                      height: 220,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: '#ccc',
                      resizeMode: 'cover',
                    }}
                  />
                </View>
              )}

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

        {/* FAB */}
        <Pressable
          onPress={() => setModalVisible(true)}
          style={{
            position: 'absolute',
            bottom: 30,
            right: 20,
            backgroundColor: '#3B82F6',
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
            <ThemedButton title="Reward Redemptions" onPress={() => {
              setModalVisible(false);
              navigation.navigate('Redemptions');
            }} />
            <ThemedButton title="Log Out" color={colors.danger} onPress={async () => {
              await clearSession();
              Alert.alert('Logged out');
              navigation.navigate('Login');
            }} />
          </View>
        </Modal>
      </LinearGradient>
    </ImageBackground>
  );
}
