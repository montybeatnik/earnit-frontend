import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { themeStyles, typography, spacing } from '../../styles/theme';
import { api } from '../../services/api';

export default function RewardCelebrationScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const { reward, redemption } = route.params as any;
    const [reflection, setReflection] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const submitReflection = async () => {
        if (!redemption?.id) {
            navigation.navigate('ChildDashboard');
            return;
        }
        if (!reflection.trim()) {
            Alert.alert('Add a note', 'Share one thing you learned or tried.');
            return;
        }
        setSubmitting(true);
        try {
            await api.post(`/redemptions/${redemption.id}/reflection`, { reflection });
            Alert.alert('Saved', 'Your reflection was saved!');
            navigation.navigate('ChildDashboard');
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Could not save reflection');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={themeStyles.fullScreenContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={80}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: spacing.lg }}
                    keyboardShouldPersistTaps="handled"
                >
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
                        {reward.type === 'investment' && (
                            <Text style={[typography.small, { marginTop: spacing.sm, textAlign: 'center' }]}>
                                If you invested ${reward.meta?.amount || 0} at 5% yearly, in 1 year you could have $
                                {((reward.meta?.amount || 0) * 1.05).toFixed(2)}.
                            </Text>
                        )}
                        {reward.type === 'screen_time' && (
                            <Text style={[typography.small, { marginTop: spacing.sm, textAlign: 'center' }]}>
                                Remember to use your {reward.meta?.duration_minutes || 0} minutes wisely—quality time matters most!
                            </Text>
                        )}
                    </View>

                    {redemption?.status === 'pending_execution' && (
                        <Text style={[typography.small, { textAlign: 'center', marginBottom: spacing.sm }]}>
                            Waiting on your parent to complete this reward. Celebrate the effort and leave a reflection below!
                        </Text>
                    )}

                    <Text style={[typography.subtitle, { marginBottom: spacing.xs }]}>
                        Quick reflection (growth mindset)
                    </Text>
                    <TextInput
                        style={[themeStyles.input, { minHeight: 80, textAlignVertical: 'top' }]}
                        multiline
                        placeholder="What did you learn or try?"
                        value={reflection}
                        onChangeText={setReflection}
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                    />

                    <Pressable
                        style={themeStyles.button}
                        onPress={submitReflection}
                        disabled={submitting}
                    >
                        <Text style={themeStyles.buttonText}>{submitting ? 'Saving...' : 'Save Reflection'}</Text>
                    </Pressable>

                    <Pressable
                        style={[themeStyles.button, { marginTop: spacing.sm, backgroundColor: '#6B7280' }]}
                        onPress={() => navigation.navigate('ChildDashboard')}
                    >
                        <Text style={themeStyles.buttonText}>Back to Dashboard</Text>
                    </Pressable>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
