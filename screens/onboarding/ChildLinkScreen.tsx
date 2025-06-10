import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themeStyles, typography, spacing } from '../../styles/theme';

export default function ChildLinkScreen() {
    const [parentCode, setParentCode] = useState('');
    const navigation = useNavigation<any>();

    const handleLink = async () => {
        if (!parentCode) {
            Alert.alert('Missing Info', 'Please enter your parent’s code.');
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/link-parent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ parent_code: parentCode }),
            });

            if (!res.ok) throw new Error('Invalid code');

            const data = await res.json();
            const children = data.children;

            if (!children || children.length === 0) {
                Alert.alert('Error', 'No children found for this parent code.');
                return;
            }

            if (children.length === 1) {
                // Only one child — go straight to setup
                navigation.navigate('ChildPasswordSetup', {
                    childId: children[0].id,
                });
            } else {
                // Multiple children — ask which one
                navigation.navigate('SelectChild', { children });
            }

        } catch (err) {
            console.error('Link error:', err);
            Alert.alert('Failed', 'Could not link to parent. Try again.');
        }
    };
    return (
        <View style={themeStyles.fullScreenContainer}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={[typography.title, { textAlign: 'center', marginBottom: spacing.md }]}>
                    Link to Your Parent
                </Text>

                <Text style={typography.bodyCenter}>
                    Please enter the code your parent gave you to connect your account.
                </Text>

                <TextInput
                    autoFocus
                    style={themeStyles.input}
                    placeholder="Enter Parent Code"
                    value={parentCode}
                    onChangeText={setParentCode}
                />
            </View>

            <Pressable onPress={handleLink} style={themeStyles.button}>
                <Text style={themeStyles.buttonText}>Continue</Text>
            </Pressable>
        </View>
    );
}