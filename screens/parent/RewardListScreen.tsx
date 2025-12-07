import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Alert,
    FlatList,
    ImageBackground,
    Animated,
    Easing,
    StyleSheet,
} from 'react-native';
import { api } from '../../services/api';
import { themeStyles } from '../../styles/theme';
import FloatingActionButton from '../../components/FloatingActionButton';

export default function RewardsScreen({ navigation }) {
    const [rewards, setRewards] = useState([]);
    const scaleAnim = useState(new Animated.Value(1))[0];
    const background = require('../../assets/rewards-bg.png');

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchRewards();
        });
        return unsubscribe;
    }, [navigation]);

    const fetchRewards = async () => {
        try {
            const res = await api.get('/rewards');
            setRewards(res.data.rewards);
        } catch (err) {
            console.error('Failed to fetch rewards:', err);
            Alert.alert('Error', 'Could not load rewards');
        }
    };

    const animateSuccess = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.1,
                duration: 150,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 150,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start();
    };

    return (
        <ImageBackground source={background} style={StyleSheet.absoluteFill} resizeMode="cover">
            <View style={[themeStyles.fullScreenOverlay, { flex: 1 }]}>
                <Text style={themeStyles.screenHeader}>🎁 Rewards</Text>

                <FlatList
                    data={rewards}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingBottom: 120 }}
                    ListEmptyComponent={
                        <Text style={themeStyles.bodyCenter}>No rewards available.</Text>
                    }
                    renderItem={({ item }) => (
                        <Animated.View
                            style={[
                                themeStyles.card,
                                {
                                    transform: [{ scale: scaleAnim }],
                                    marginBottom: 12,
                                },
                            ]}
                        >
                            <Text style={themeStyles.title}>{item.title}</Text>
                            <Text style={themeStyles.subtitle}>{item.description}</Text>
                            <Text style={themeStyles.body}>🎯 {item.cost} points</Text>
                        </Animated.View>
                    )}
                />
            </View>

            <View style={styles.fabContainer}>
                <FloatingActionButton onPress={() => navigation.navigate('CreateReward')} />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    fabContainer: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        zIndex: 999,
    },
});
