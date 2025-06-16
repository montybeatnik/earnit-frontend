import React from 'react';
import {
    View,
    Text,
    ImageBackground,
    Pressable,
    StyleSheet,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { themeStyles, spacing, typography, colors } from '../styles/theme';

const background = require('../../assets/landing-bg.png');

export default function LandingScreen() {
    const navigation = useNavigation<any>();

    return (
        <ImageBackground source={background} style={StyleSheet.absoluteFill} resizeMode="cover">
            <View style={[themeStyles.fullScreenOverlay, styles.container]}>
                <Text style={[typography.title, styles.header]}>Welcome to EarnIt!</Text>
                <Text style={[typography.subtitle, styles.subtitle]}>Gamified chores, joyful rewards.</Text>

                <Pressable style={themeStyles.button} onPress={() => navigation.navigate('RoleSelection')}>
                    <Text style={themeStyles.buttonText}>Create Account</Text>
                </Pressable>

                <Pressable style={themeStyles.button} onPress={() => navigation.navigate('Login')}>
                    <Text style={themeStyles.buttonText}>Log In</Text>
                </Pressable>

                {/* Dev access button for easier testing */}
                {__DEV__ && (
                    <Pressable
                        style={[themeStyles.button, { backgroundColor: colors.secondary }]}
                        onPress={() => navigation.navigate('Landing')}
                    >
                        <Text style={themeStyles.buttonText}>🔧 Go to Landing Page (DEV)</Text>
                    </Pressable>
                )}
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
    },
    header: {
        marginBottom: spacing.lg,
        color: colors.primary,
        textAlign: 'center',
    },
    subtitle: {
        marginBottom: spacing.xl,
        color: colors.grayDark,
        textAlign: 'center',
    },
});