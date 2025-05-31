import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, Button, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';

export default function LandingScreen() {
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState('');


    const handleSubscribe = () => {
        // You can wire this to your backend or a newsletter service
        Alert.alert('🎉 Thank you!', 'You’re on the early access list.');
        setEmail('');
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <Text style={styles.header}>Teach Kids Responsibility — And Let Them Earn Their Screen Time</Text>
                <Text style={styles.subheader}>A playful app that helps families build better habits together.</Text>

                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Register', { email })}
                >
                    <Text style={styles.buttonText}>Join Early Access</Text>
                </TouchableOpacity>

                <View style={styles.features}>
                    <Text style={styles.featureTitle}>How It Works</Text>
                    <Text style={styles.featureItem}>• Create tasks for kids to complete</Text>
                    <Text style={styles.featureItem}>• Kids earn points for completing tasks</Text>
                    <Text style={styles.featureItem}>• Redeem points for screen time, money, or other rewards</Text>
                </View>

                <Text style={styles.footer}>Built for families. Backed by values.</Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: '#f9f9f9',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    subheader: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 12,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    features: {
        marginTop: 32,
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    featureItem: {
        fontSize: 16,
        marginBottom: 4,
    },
    footer: {
        marginTop: 40,
        fontSize: 14,
        textAlign: 'center',
        color: '#777',
    },

    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    }

});