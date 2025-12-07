import React, { useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet, Alert } from 'react-native';
import { colors, themeStyles } from '../styles/theme';
import ThemedButton from './ThemedButton';
import { useNavigation } from '@react-navigation/native';
import { clearSession } from '../services/session';

export default function FloatingActionButton() {
    const [isModalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation<any>();

    return (
        <>
            <Pressable
                onPress={() => setModalVisible(true)}
                style={styles.fab}
            >
                <Text style={styles.fabText}>＋</Text>
            </Pressable>

            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable
                    onPress={() => setModalVisible(false)}
                    style={styles.overlay}
                >
                    <View style={styles.modal}>
                        <Text style={[themeStyles.subtitle, { textAlign: 'center', marginBottom: 12 }]}>
                            Quick Actions
                        </Text>

                        <ThemedButton
                            title="Dashboard"
                            onPress={() => {
                                setModalVisible(false);
                                navigation.navigate('ParentDashboard');
                            }}
                        />

                        <ThemedButton
                            title="Create New Task"
                            onPress={() => {
                                setModalVisible(false);
                                navigation.navigate('CreateTaskTemplate');
                            }}
                        />

                        <ThemedButton
                            title="Manage Rewards"
                            onPress={() => {
                                setModalVisible(false);
                                navigation.navigate('Rewards');
                            }}
                        />

                        <ThemedButton
                            title="Create A Reward"
                            onPress={() => {
                                setModalVisible(false);
                                navigation.navigate('CreateReward');
                            }}
                        />

                        <ThemedButton
                            title="Log Out"
                            color={colors.danger}
                            onPress={async () => {
                                await clearSession();
                                setModalVisible(false);
                                navigation.navigate('Login');
                            }}
                        />
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        backgroundColor: colors.primary,
        borderRadius: 30,
        padding: 16,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    fabText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modal: {
        backgroundColor: colors.background,
        padding: 20,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
});
