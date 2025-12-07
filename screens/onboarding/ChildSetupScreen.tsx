import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { themeStyles, typography, colors, spacing } from '../../styles/theme';
import { api } from '../../services/api';

interface Child {
    name: string;
    age: string;
}

export default function ChildSetupScreen() {
    const [children, setChildren] = useState<Child[]>([{ name: '', age: '' }]);
    const navigation = useNavigation();

    const handleInputChange = (index: number, field: keyof Child, value: string) => {
        const updated = [...children];
        updated[index][field] = value;
        setChildren(updated);
    };

    const addChild = () => {
        setChildren([...children, { name: '', age: '' }]);
    };

    const handleSubmit = async () => {
        try {
            await api.post(`/children`, { children });
            navigation.navigate('Parent' as never);
        } catch (err) {
            console.error('Failed to create children', err);
            Alert.alert('Error', 'Unable to create children. Please try again.');
        }
    };

    const Content = (
        <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'center',
                padding: spacing.lg,
            }}
        >
            <Text style={[typography.title, { marginBottom: spacing.lg }]}>Add Your Children</Text>

            {children.map((child, index) => (
                <View key={index} style={{ marginBottom: spacing.lg }}>
                    <Text style={typography.subtitle}>Child {index + 1}</Text>
                    <TextInput
                        placeholder="Name"
                        value={child.name}
                        onChangeText={(text) => handleInputChange(index, 'name', text)}
                        style={themeStyles.input}
                    />
                    <TextInput
                        placeholder="Age"
                        keyboardType="numeric"
                        value={child.age}
                        onChangeText={(text) => handleInputChange(index, 'age', text)}
                        style={themeStyles.input}
                    />
                </View>
            ))}

            <Pressable
                onPress={addChild}
                style={[
                    themeStyles.button,
                    {
                        backgroundColor: colors.secondary,
                        padding: spacing.md,
                        borderRadius: 12,
                    },
                ]}
            >
                <Text style={themeStyles.buttonText}>Add Another Child</Text>
            </Pressable>

            <Pressable
                onPress={handleSubmit}
                style={[
                    themeStyles.button,
                    {
                        backgroundColor: colors.primary,
                        marginTop: spacing.lg,
                        padding: spacing.md,
                        borderRadius: 12,
                    },
                ]}
            >
                <Text style={themeStyles.buttonText}>Continue</Text>
            </Pressable>
        </ScrollView>
    );

    if (Platform.OS === 'web') {
        return <View style={themeStyles.fullScreenContainer}>{Content}</View>;
    }

    return (
        <KeyboardAvoidingView
            style={themeStyles.fullScreenContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                {Content}
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
