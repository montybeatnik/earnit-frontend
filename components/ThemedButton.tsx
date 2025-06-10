// components/ThemedButton.tsx
import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { themeStyles } from '../styles/theme';

interface ThemedButtonProps {
    title: string;
    onPress: () => void;
    color?: string; // optional override
}

export default function ThemedButton({ title, onPress, color }: ThemedButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            style={[
                themeStyles.button,
                color ? { backgroundColor: color } : null
            ]}
        >
            <Text style={themeStyles.buttonText}>{title}</Text>
        </Pressable>
    );
}