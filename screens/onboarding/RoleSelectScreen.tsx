import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, themeStyles, typography } from '../../styles/theme';
import axios from 'axios';
import { storeRole } from '../../services/session';

export default function RoleSelectionScreen() {
    const navigation = useNavigation<any>();
    const styles = themeStyles;

    const selectRole = async (role: 'parent' | 'child') => {
        console.log('Selected role:', role); // <-- Add this
        await storeRole(role);
        if (role === 'parent') {
            navigation.navigate('ParentRegister'); // <-- Must match navigator
        } else {
            navigation.navigate('ParentChildLink');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Who’s setting up this account?</Text>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPress={() => {
                    console.log('Parent button pressed');
                    selectRole('parent');
                }}
            >
                <Text style={styles.buttonText}>I’m a Parent</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.secondary }]}
                onPress={() => {
                    console.log('Child button pressed');
                    selectRole('child');
                }}
            >
                <Text style={styles.buttonText}>I’m a Child</Text>
            </TouchableOpacity>
        </View>
    );
}
