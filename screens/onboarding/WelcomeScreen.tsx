import React from 'react';
import { View, Text, Button, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme, themeStyles, typography, colors } from '../../styles/theme';

export default function WelcomeScreen() {
    const navigation = useNavigation<any>();

    const selectRole = (role: 'parent' | 'child') => {
        if (role === 'parent') {
            // navigation.navigate('BoilerplateSelection', { role });
            navigation.navigate('ParentRegister');
        } else {
            navigation.navigate('ChildLink');
        }
    };
    return (
        <View style={theme.container}>
            <Image source={require('../../assets/onboarding-welcome-2.png')} style={theme.image} resizeMode="contain" />

            <Text style={theme.title}>Welcome to EarnIt</Text>
            <Text style={theme.subtitle}>Helping kids learn responsibility and earn rewards.</Text>

            <View style={theme.buttonGroup}>
                <Button title="I'm a Parent" onPress={() => selectRole('parent')} />
                <Button title="I'm a Child" onPress={() => selectRole('child')} />
            </View>
        </View>
    );
}