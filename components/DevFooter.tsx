import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function DevFooter() {
    const navigation = useNavigation();

    if (!__DEV__) return null;

    return (
        <View style={styles.floatingButton}>
            <Pressable onPress={() => navigation.navigate('DevSwitchUser')}>
                <Text style={styles.text}>🔁 Switch User</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    floatingButton: {
        position: 'absolute',
        bottom: 25,
        left: 20,
        backgroundColor: '#333',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        zIndex: 9999,
        opacity: 0.8,
    },
    text: {
        color: '#fff',
        fontSize: 14,
    },
});