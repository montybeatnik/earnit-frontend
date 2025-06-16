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
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    const background = require('../../assets/rewards-bg.png');

    const handleSubmit = async () => {
        if (!title || !cost) {
            Alert.alert('Missing fields', 'Title and cost are required');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('token');
            await api.post(
                '/rewards',
                { title, description, cost: parseInt(cost) },
                { headers: { Authorization: `Bearer ${token}` } }
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