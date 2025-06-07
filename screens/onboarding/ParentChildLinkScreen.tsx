import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '@env';

export default function ParentChildLinkScreen() {
    const [role, setRole] = useState('');
    const [parentCode, setParentCode] = useState('');
    const navigation = useNavigation<any>();

    useEffect(() => {
        // Retrieve role from storage
        AsyncStorage.getItem('role').then((value) => {
            if (value) setRole(value);
        });
    }, []);

    const handleContinue = async () => {
        if (role === 'child') {
            if (!parentCode) {
                Alert.alert('Missing', 'Please enter your parent’s code');
                return;
            }

            // Simulate parent code validation
            try {
                const token = await AsyncStorage.getItem('token');
                const res = await fetch(`${API_BASE_URL}/link-parent`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ parent_code: parentCode }),
                });

                if (!res.ok) {
                    throw new Error('Invalid code');
                }

                const data = await res.json();

                Alert.alert('Success', 'You’re now linked with your parent.');
                navigation.navigate('ChildPasswordSetup', { childId: data.child_id });
            } catch (err) {
                Alert.alert('Error', 'Could not link to parent');
            }
        }
    };

    return (
        <View style={styles.container}>
            {role === 'child' ? (
                <>
                    <Text style={styles.text}>Enter your parent's code to link your account:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Parent Code"
                        value={parentCode}
                        onChangeText={setParentCode}
                    />
                </>
            ) : (
                <Text style={styles.text}>You’ll receive a code to link your child later.</Text>
            )}

            <Button title="Continue" onPress={handleContinue} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'center' },
    text: { fontSize: 16, marginBottom: 12, textAlign: 'center' },
    input: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 6,
        marginBottom: 16,
    },
});