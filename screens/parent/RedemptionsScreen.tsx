import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, Pressable, StyleSheet, TextInput } from 'react-native';
import { api } from '../../services/api';
import { themeStyles, colors, typography, spacing } from '../../styles/theme';

type Redemption = {
    id: number;
    status: string;
    executed_at?: string;
    execution_notes?: string;
    reflection?: string;
    reward?: {
        title: string;
        type?: string;
        meta?: any;
    };
    child?: {
        name: string;
    };
};

export default function RedemptionsScreen() {
    const [redemptions, setRedemptions] = useState<Redemption[]>([]);
    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState<Record<number, string>>({});

    const fetchRedemptions = async () => {
        setLoading(true);
        try {
            const res = await api.get('/redemptions');
            setRedemptions(res.data.redemptions || []);
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Could not load redemptions');
        } finally {
            setLoading(false);
        }
    };

    const confirmExecution = async (id: number) => {
        try {
            await api.post(`/redemptions/${id}/confirm-execution`, { execution_notes: notes[id] || '' });
            fetchRedemptions();
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Could not confirm execution');
        }
    };

    useEffect(() => {
        fetchRedemptions();
    }, []);

    const renderItem = ({ item }: { item: Redemption }) => {
        const isPending = item.status === 'pending_execution';
        return (
            <View style={styles.card}>
                <Text style={styles.title}>{item.reward?.title || 'Reward'}</Text>
                <Text style={styles.body}>Child: {item.child?.name || 'N/A'}</Text>
                <Text style={styles.body}>
                    Type: {item.reward?.type || 'tangible'}
                </Text>
                {item.reward?.type === 'investment' && (
                    <Text style={styles.small}>
                        Investment: {item.reward?.meta?.ticker || 'N/A'} • ${item.reward?.meta?.amount || 0}
                    </Text>
                )}
                {item.reward?.type === 'screen_time' && (
                    <Text style={styles.small}>
                        Screen Time: {item.reward?.meta?.duration_minutes || 0} mins
                    </Text>
                )}
                <Text style={styles.small}>Status: {item.status}</Text>
                {item.execution_notes ? (
                    <Text style={styles.small}>Notes: {item.execution_notes}</Text>
                ) : null}
                {item.reflection ? (
                    <Text style={styles.small}>Reflection: {item.reflection}</Text>
                ) : null}

                {isPending && (
                    <>
                        <TextInput
                            style={[themeStyles.input, { marginTop: spacing.sm }]}
                            placeholder="Execution notes (optional)"
                            value={notes[item.id] || ''}
                            onChangeText={(text) => setNotes((prev) => ({ ...prev, [item.id]: text }))}
                        />
                        <Pressable style={themeStyles.button} onPress={() => confirmExecution(item.id)}>
                            <Text style={themeStyles.buttonText}>Mark Executed</Text>
                        </Pressable>
                    </>
                )}
            </View>
        );
    };

    return (
        <View style={themeStyles.fullScreenContainer}>
            <Text style={themeStyles.screenHeader}>Reward Redemptions</Text>
            <FlatList
                data={redemptions}
                keyExtractor={(item, idx) => (item.id ?? (item as any).ID ?? idx).toString()}
                onRefresh={fetchRedemptions}
                refreshing={loading}
                contentContainerStyle={{ paddingBottom: 80 }}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={themeStyles.bodyCenter}>No redemptions yet.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.light,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.gray,
        padding: spacing.md,
        marginBottom: spacing.md,
    },
    title: {
        ...typography.subtitle,
        marginBottom: spacing.xs,
    },
    body: {
        ...typography.body,
    },
    small: {
        ...typography.small,
        marginTop: 4,
    },
});
