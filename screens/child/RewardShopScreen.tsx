import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Button,
    Alert,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../services/api';

export default function RewardShopScreen() {
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation<any>();

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
            const res = await api.post(`/rewards/${reward.id}/redeem`, null, {
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

    if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🎁 Reward Shop</Text>

            <FlatList
                data={rewards}
                keyExtractor={(item) => item.id.toString()}
                onRefresh={fetchRewards}
                refreshing={refreshing}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.rewardTitle}>{item.title}</Text>
                        <Text>{item.description}</Text>
                        <Text style={styles.cost}>Cost: {item.cost} pts</Text>
                        <Button title="Redeem" onPress={() => handleRedeem(item)} />
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    card: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        marginBottom: 10,
    },
    rewardTitle: { fontWeight: 'bold', fontSize: 16 },
    cost: { fontStyle: 'italic', color: 'green', marginBottom: 6 },
});