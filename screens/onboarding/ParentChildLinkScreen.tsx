import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getSession } from '../../services/session';
import { api } from '../../services/api';

export default function ParentChildLinkScreen() {
    const [role, setRole] = useState('');
    const [parentCode, setParentCode] = useState('');
    const navigation = useNavigation<any>();

    useEffect(() => {
        // Retrieve role from storage
        getSession().then(({ role }) => {
            if (role) setRole(role);
        });
    }, []);

    const handleContinue = async () => {
        if (role === 'child') {
            if (!parentCode.trim()) {
                Alert.alert('Missing', 'Please enter your parent’s code');
                return;
            }

            try {
                const { data: children } = await api.get(`/children/by-parent-code/${parentCode.trim()}`);

                if (children.length === 0) {
                    Alert.alert('No matches', 'No children found for that code.');
                    return;
                }

                navigation.navigate('ChildSelector', { children });
            } catch (err) {
                console.error(err);
                Alert.alert('Error', 'Could not look up children.');
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
