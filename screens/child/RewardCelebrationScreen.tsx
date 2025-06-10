import React from 'react';
import { View, Text, Pressable } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { themeStyles, typography, spacing } from '../../styles/theme';

export default function RewardCelebrationScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const { reward } = route.params;

    return (
        <View style={themeStyles.fullScreenContainer}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <LottieView
                    source={require('../../assets/rewardCelebration.json')}
                    autoPlay
                    loop={false}
                    style={{ width: 300, height: 300 }}
                />
                <Text style={[typography.title, { marginTop: spacing.md }]}>
                    You redeemed:
                </Text>
                <Text style={[typography.subtitle, { marginTop: spacing.sm }]}>
                    {reward.title}
                </Text>
                <Text style={typography.body}>{reward.description}</Text>
            </View>

            <Pressable
                style={themeStyles.button}
                onPress={() => navigation.navigate('ChildDashboard')}
            >
                <Text style={themeStyles.buttonText}>Back to Dashboard</Text>
            </Pressable>
        </View>
    );
}