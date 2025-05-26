import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../services/api';

export default function RewardListScreen() {
    const navigation = useNavigation<any>();
    const [rewards, setRewards] = useState([]);

    const fetchRewards = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const res = await api.get('/rewards', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRewards(res.data.rewards);
        } catch (err) {
            console.error(err);
            Alert.alert('Failed to load rewards');
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', fetchRewards);
        return unsubscribe;
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>🎁 Rewards</Text>

            <FlatList
                data={rewards}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text>{item.description}</Text>
                        <Text style={styles.cost}>{item.cost} pts</Text>
                    </View>
                )}
            />

            <Button
                title="Create New Reward"
                onPress={() => navigation.navigate('CreateReward')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    card: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        marginBottom: 10,
    },
    title: { fontWeight: 'bold', fontSize: 16 },
    cost: { fontStyle: 'italic', color: 'green' },
});