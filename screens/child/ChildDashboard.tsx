import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Pressable, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { API_BASE_URL } from '@env';
import { themeStyles } from '../../styles/theme';
import StatusBadge from '../../components/StatusBadge';
import useWebSocket from '../../hooks/useWebSocket';
import { ScrollView, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Modal from 'react-native-modal';
import ThemedButton from '../../components/ThemedButton';


export default function ChildDashboard() {
  const background = require('../../assets/dashboard-bg.png'); // or use a gradient
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState<'pending' | 'approved'>('pending');
  const navigation = useNavigation<any>();
  const lastMessage = useWebSocket();
  const [isModalVisible, setModalVisible] = useState(false);

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

      await axios.put(`${API_BASE_URL}/tasks/${taskId}/submit`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert('🎉 Submitted!', 'Your task is now waiting for approval.');
      fetchTasks();
    } catch (err) {
      console.error(err);
      Alert.alert('Oops!', 'Something went wrong submitting the task.');
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

  useEffect(() => {
    if (lastMessage) {
      Alert.alert('📬 Notification', lastMessage);
    }
  }, [lastMessage]);

  return (
    <ImageBackground source={background} style={{ flex: 1 }} resizeMode="cover">
      <LinearGradient colors={['#FDE68A', '#FCA5A5']} style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 32 }}>
          {/* Main Scrollable Content */}
          <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
            <View style={themeStyles.fullScreenContainer}>
              <Text style={themeStyles.screenHeader}>🎯 Your Dashboard</Text>

              {user && (
                <View style={styles.headerSection}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarEmoji}>🦸</Text>
                  </View>
                  <View style={styles.greeting}>
                    <Text style={styles.greetingText}>Hey {user.name || 'friend'}! 🎉</Text>
                    <Text style={styles.xpLabel}>XP Progress</Text>
                    <View style={styles.progressBarBackground}>
                      <View style={[styles.progressBarFill, { width: `${Math.min(user.points, 100)}%` }]} />
                    </View>
                    <Text style={styles.xpPoints}>
                      {user.points} / 100 XP
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.filterButtons}>
                <Pressable
                  style={[themeStyles.button, filter === 'pending' && styles.selectedButton]}
                  onPress={() => setFilter('pending')}
                >
                  <Text style={themeStyles.buttonText}>Current</Text>
                </Pressable>
                <Pressable
                  style={[themeStyles.button, filter === 'approved' && styles.selectedButton]}
                  onPress={() => setFilter('approved')}
                >
                  <Text style={themeStyles.buttonText}>History</Text>
                </Pressable>
              </View>

              {(!Array.isArray(tasks) || tasks.length === 0) ? (
                <Text style={themeStyles.bodyCenter}>📭 No tasks to show</Text>
              ) : (
                tasks.map((item) => (
                  <View key={item.id} style={styles.taskCard}>
                    <View style={styles.taskHeader}>
                      <Text style={styles.taskIcon}>📌</Text>
                      <Text style={styles.taskTitle}>{item.title}</Text>
                      <View style={styles.pointsBadge}>
                        <Text style={styles.pointsText}>+{item.points}</Text>
                      </View>
                    </View>

                    <Text style={styles.taskDescription}>{item.description}</Text>

                    <View style={styles.taskFooter}>
                      <StatusBadge status={item.status} />
                      <Text style={styles.taskTimestamp}>
                        {new Date(item.created_at).toLocaleDateString()} @ {new Date(item.created_at).toLocaleTimeString()}
                      </Text>
                    </View>

                    {/* {item.status === 'in_progress' && (
                      <ThemedButton
                        title="Submit Task"
                        onPress={() => navigation.navigate('CompleteTask', { taskId: item.id })}
                      />
                    )} */}


                    {/* navigation.navigate('CompleteTask', { taskId: item.id })} */}
                    {filter === 'pending' && item.status === 'pending' && (
                      <Pressable style={styles.completeButton} onPress={() => navigation.navigate('CompleteTask', { taskId: item.id })}>
                        <Text style={styles.completeButtonText}>Mark Complete ✅</Text>
                      </Pressable>
                    )}
                  </View>
                ))
              )}
            </View>
          </ScrollView>

          {/* FAB */}
          <Pressable
            onPress={() => setModalVisible(true)}
            style={{
              position: 'absolute',
              bottom: 30,
              right: 20,
              backgroundColor: '#3B82F6', // bright blue
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

          {/* Modal */}
          <Modal
            isVisible={isModalVisible}
            onBackdropPress={() => setModalVisible(false)}
            style={{ justifyContent: 'flex-end', margin: 0 }}
          >
            <View style={{
              backgroundColor: 'white',
              padding: 20,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            }}>
              <Text style={[themeStyles.subtitle, { marginBottom: 12, textAlign: 'center' }]}>Quick Actions</Text>

              <Pressable
                style={[themeStyles.button, { marginBottom: 12 }]}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('RewardShop');
                }}
              >
                <Text style={themeStyles.buttonText}>🎁 Reward Shop</Text>
              </Pressable>

              <Pressable
                style={[themeStyles.button, { backgroundColor: '#EF4444' }]}
                onPress={async () => {
                  await AsyncStorage.removeItem('token');
                  await AsyncStorage.removeItem('role');
                  Alert.alert('Logged out');
                  setModalVisible(false);
                  navigation.navigate('Login');
                }}
              >
                <Text style={themeStyles.buttonText}>🚪 Log Out</Text>
              </Pressable>
            </View>
          </Modal>

        </View>
      </LinearGradient >
    </ImageBackground >
  );
}

const styles = StyleSheet.create({
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: 16,
  },
  selectedButton: {
    backgroundColor: '#10B981',
  },
  buttonSpacing: {
    marginTop: 10,
  },
  pointsBox: {
    backgroundColor: '#FFF3CD',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
    borderColor: '#FFD700',
    borderWidth: 1,
  },
  pointsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B45309',
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
    backgroundColor: '#E0F2FE',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#93C5FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },

  avatarEmoji: {
    fontSize: 32,
  },

  greeting: {
    flex: 1,
  },

  greetingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 4,
  },

  xpLabel: {
    fontSize: 14,
    color: '#3B82F6',
  },

  progressBarBackground: {
    width: '100%',
    height: 12,
    backgroundColor: '#BFDBFE',
    borderRadius: 6,
    marginTop: 4,
  },

  progressBarFill: {
    height: 12,
    backgroundColor: '#3B82F6',
    borderRadius: 6,
  },

  xpPoints: {
    marginTop: 4,
    fontSize: 12,
    color: '#1E40AF',
  },
  taskCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    width: '100%',
  },

  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  taskIcon: {
    fontSize: 22,
    marginRight: 8,
  },

  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    color: '#1D4ED8',
  },

  pointsBadge: {
    backgroundColor: '#FCD34D',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },

  pointsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400E',
  },

  taskDescription: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
  },

  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  taskTimestamp: {
    fontSize: 12,
    color: '#6B7280',
  },

  completeButton: {
    backgroundColor: '#34D399',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 64,
  },

  scrollContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 140, // ⬅️ enough space for buttons
  },

  pillButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
    marginBottom: 24,
  },

  pillButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999, // pill shape
    minWidth: 130,
    alignItems: 'center',
  },

  pillButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});