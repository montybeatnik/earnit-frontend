import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Keyboard,
    TouchableWithoutFeedback,
    ImageBackground,
    StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../services/api';
import { themeStyles, colors } from '../../styles/theme';
import ThemedButton from '../../components/ThemedButton';
import FloatingActionButton from '../../components/FloatingActionButton';

export default function CreateRewardScreen() {
    const navigation = useNavigation<any>();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [cost, setCost] = useState('');
    const [type, setType] = useState<'tangible' | 'investment' | 'screen_time'>('tangible');
    const [ticker, setTicker] = useState('');
    const [amount, setAmount] = useState('');
    const [durationMinutes, setDurationMinutes] = useState('');
    const background = require('../../assets/rewards-bg.png');

    const handleSubmit = async () => {
        if (!title || !cost) {
            Alert.alert('Missing fields', 'Title and cost are required');
            return;
        }

        try {
            await api.post(
                '/rewards',
                {
                    title,
                    description,
                    cost: parseInt(cost),
                    type,
                    meta:
                        type === 'investment'
                            ? { ticker, amount: Number(amount) || 0 }
                            : type === 'screen_time'
                                ? { duration_minutes: Number(durationMinutes) || 0 }
                                : {},
                }
            );
            Alert.alert('Success', 'Reward created!');
            navigation.goBack();
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Could not create reward');
        }
    };

    return (
        <ImageBackground source={background} style={StyleSheet.absoluteFill} resizeMode="cover">
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        contentContainerStyle={[themeStyles.fullScreenOverlay, { padding: 20 }]}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Text style={themeStyles.screenHeader}>Create Reward</Text>

                        <TextInput
                            placeholder="Reward Title"
                            value={title}
                            onChangeText={setTitle}
                            style={themeStyles.input}
                        />
                        <Text style={themeStyles.subtitle}>Reward Type</Text>
                        <View style={{ flexDirection: 'row', marginBottom: spacing.md }}>
                            {(['tangible', 'investment', 'screen_time'] as const).map((val) => (
                                <Pressable
                                    key={val}
                                    onPress={() => setType(val)}
                                    style={{
                                        padding: spacing.sm,
                                        borderRadius: 8,
                                        borderWidth: 1,
                                        borderColor: type === val ? colors.primary : colors.gray,
                                        marginRight: spacing.sm,
                                        backgroundColor: type === val ? colors.light : 'transparent',
                                    }}
                                >
                                    <Text style={{ color: colors.text }}>
                                        {val === 'tangible' ? 'Tangible' : val === 'investment' ? 'Investment' : 'Screen Time'}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        {type === 'investment' && (
                            <>
                                <TextInput
                                    placeholder="Ticker or Investment Name"
                                    value={ticker}
                                    onChangeText={setTicker}
                                    style={themeStyles.input}
                                />
                                <TextInput
                                    placeholder="Amount (e.g., 5)"
                                    value={amount}
                                    onChangeText={setAmount}
                                    keyboardType="numeric"
                                    style={themeStyles.input}
                                />
                            </>
                        )}

                        {type === 'screen_time' && (
                            <TextInput
                                placeholder="Duration in minutes (e.g., 30)"
                                value={durationMinutes}
                                onChangeText={setDurationMinutes}
                                keyboardType="numeric"
                                style={themeStyles.input}
                            />
                        )}
                        <TextInput
                            placeholder="Description (optional)"
                            value={description}
                            onChangeText={setDescription}
                            style={themeStyles.input}
                        />
                        <TextInput
                            placeholder="Cost in points"
                            value={cost}
                            onChangeText={setCost}
                            keyboardType="numeric"
                            style={themeStyles.input}
                        />

                        <ThemedButton onPress={handleSubmit} label="Create Reward" />
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

            <View style={styles.fabWrapper}>
                <FloatingActionButton onPress={() => navigation.goBack()} />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    fabWrapper: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        zIndex: 999,
    },
});
