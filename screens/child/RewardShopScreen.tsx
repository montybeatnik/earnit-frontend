import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Button,
    Alert,
    ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_BASE_URL } from '@env';
import { api } from '../../services/api';
import { themeStyles, colors, spacing, typography } from '../../styles/theme';

export default function RewardShopScreen() {
    const [rewards, setRewards] = useState([]);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation<any>();

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

    const fetchRewards = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const res = await api.get('/rewards', {
                headers: { Authorization: `Bearer ${token}` },
            });
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
            const token = await AsyncStorage.getItem('token');
            await api.post(`/rewards/${reward.id}/redeem`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (reward.type === 'screen_time') {
                navigation.navigate('ScreenTimeEarned', { reward });
            } else {
                Alert.alert('🎉 Redeemed!', 'Reward requested successfully!');
                fetchRewards();
            }

            navigation.navigate('RewardCelebration', { reward });
        } catch (err: any) {
            console.error(err);
            Alert.alert('Oops', err.response?.data?.error || 'Redemption failed');
        }
    };

    useEffect(() => {
        fetchRewards();
    }, []);

    useEffect(() => {
        fetchUser();
    }, []);

    if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

    return (
        <View style={themeStyles.container}>
            <Text style={themeStyles.title}>🎁 Reward Shop</Text>

            {user && (
                <View style={styles.pointsBanner}>
                    <Text style={styles.pointsText}>🌟 You have {user.points} points!</Text>
                </View>
            )}

            <FlatList
                data={rewards}
                keyExtractor={(item) => item.id.toString()}
                onRefresh={fetchRewards}
                refreshing={refreshing}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.rewardTitle}>{item.title}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                        <Text style={styles.cost}>Cost: {item.cost} pts</Text>
                        <Button title="Redeem" onPress={() => handleRedeem(item)} />
                    </View>
                )}
            />
        </View>
    );
}

const styles = {
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
};