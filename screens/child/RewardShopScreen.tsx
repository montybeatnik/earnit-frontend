import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Button,
    Alert,
    ActivityIndicator,
    ImageBackground,
    StyleSheet,
    Pressable,
} from 'react-native';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../services/api';
import { themeStyles, colors, spacing, typography } from '../../styles/theme';
import { clearSession } from '../../services/session';

export default function RewardShopScreen() {
    const [rewards, setRewards] = useState([]);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation<any>();
    const background = require('../../assets/rewards-bg.png');
    const [isModalVisible, setModalVisible] = useState(false);


    const fetchUser = async () => {
        try {
            const res = await api.get(`/me`);
            setUser(res.data.user);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchRewards = async () => {
        try {
            const res = await api.get('/rewards');
            setRewards(res.data.rewards);
        } catch (err) {
            console.error(err);
            Alert.alert('Error fetching rewards');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRedeem = async (reward: any) => {
        try {
            const rewardId = reward.id ?? reward.ID;
            if (rewardId == null) {
                Alert.alert('Oops', 'Reward is missing an ID.');
                return;
            }

            const res = await api.post(`/rewards/${rewardId}/redeem`, null);
            const redemption = res.data?.redemption;

            if (reward.type === 'screen_time') {
                navigation.navigate('ScreenTimeEarned', { reward });
            } else {
                Alert.alert('🎉 Redeemed!', 'Reward requested successfully!');
                fetchRewards();
            }

            navigation.navigate('RewardCelebration', { reward, redemption });
        } catch (err: any) {
            console.error(err);
            Alert.alert('Oops', err.response?.data?.error || 'Redemption failed');
        }
    };

    useEffect(() => {
        fetchRewards();
        fetchUser();
    }, []);

    if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

    return (
        <ImageBackground source={background} style={styles.bg} resizeMode="cover">
            <View style={styles.container}>
                <Text style={themeStyles.screenHeader}>🎁 Reward Shop</Text>

                {user && (
                    <View style={styles.pointsBanner}>
                        <Text style={styles.pointsText}>🌟 You have {user.points} points!</Text>
                    </View>
                )}

                <FlatList
                    data={rewards}
                    keyExtractor={(item, idx) => (item.id ?? item.ID ?? idx).toString()}
                    onRefresh={fetchRewards}
                    refreshing={refreshing}
                    contentContainerStyle={{ paddingBottom: 120 }}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={styles.rewardTitle}>{item.title}</Text>
                                <Text style={styles.typeBadge}>
                                    {item.type === 'investment' ? 'Investment' : item.type === 'screen_time' ? 'Screen Time' : 'Tangible'}
                                </Text>
                            </View>
                            <Text style={styles.description}>{item.description}</Text>
                            <Text style={styles.cost}>Cost: {item.cost} pts</Text>
                            {item.cash_cost_cents ? (
                                <Text style={styles.small}>
                                    Cash cost: ${(item.cash_cost_cents / 100).toFixed(2)}
                                </Text>
                            ) : null}
                            {item.type === 'investment' && (
                                <Text style={styles.small}>
                                    Investment: {item.meta?.ticker || 'N/A'} • ${item.meta?.amount || 0}
                                </Text>
                            )}
                            {item.type === 'screen_time' && (
                                <Text style={styles.small}>
                                    Screen Time: {item.meta?.duration_minutes || 0} mins
                                </Text>
                            )}
                            <Pressable
                                style={[themeStyles.button, { marginTop: 12 }]}
                                onPress={() => handleRedeem(item)}
                            >
                                <Text style={themeStyles.buttonText}>🎉 Redeem</Text>
                            </Pressable>
                        </View>
                    )}
                />

                <Pressable
                    onPress={() => setModalVisible(true)}
                    style={{
                        position: 'absolute',
                        bottom: 30,
                        right: 20,
                        backgroundColor: '#F59E0B', // Warm golden
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
                        backgroundColor: '#fff',
                        padding: 20,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                    }}>
                        <Text style={[themeStyles.subtitle, { marginBottom: 12, textAlign: 'center' }]}>Quick Actions</Text>

                        <Pressable
                            style={[themeStyles.button, { marginBottom: 12 }]}
                            onPress={() => {
                                setModalVisible(false);
                                navigation.navigate('MyRewards');
                            }}
                        >
                            <Text style={themeStyles.buttonText}>📜 My Rewards</Text>
                        </Pressable>

                        <Pressable
                            style={[themeStyles.button, { marginBottom: 12 }]}
                            onPress={() => {
                                setModalVisible(false);
                                navigation.navigate('WeeklyRetro');
                            }}
                        >
                            <Text style={themeStyles.buttonText}>🧠 Weekly Reflection</Text>
                        </Pressable>

                        <Pressable
                            style={[themeStyles.button, { marginBottom: 12 }]}
                            onPress={() => {
                                setModalVisible(false);
                                fetchRewards();
                            }}
                        >
                            <Text style={themeStyles.buttonText}>🔄 Refresh</Text>
                        </Pressable>

                        <Pressable
                            style={[themeStyles.button, { backgroundColor: '#EF4444' }]}
                            onPress={async () => {
                                await clearSession();
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
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bg: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: spacing.md,
        paddingTop: spacing.lg,
    },
    pointsBanner: {
        backgroundColor: colors.light,
        borderColor: colors.primary,
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.lg,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    pointsText: {
        ...typography.subtitle,
        color: colors.primary,
    },
    card: {
        backgroundColor: colors.light,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.gray,
        padding: spacing.md,
        marginBottom: spacing.md,
    },
    rewardTitle: {
        ...typography.subtitle,
        marginBottom: spacing.xs,
    },
    description: {
        ...typography.body,
        marginBottom: spacing.xs,
    },
    cost: {
        ...typography.small,
        color: colors.secondary,
        marginBottom: spacing.sm,
    },
    small: {
        ...typography.small,
    },
    typeBadge: {
        ...typography.small,
        backgroundColor: colors.light,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.gray,
    },
});
