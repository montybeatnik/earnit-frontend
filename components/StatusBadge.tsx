import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatusBadge({ status }: { status: string }) {
    let color = '#ccc';
    let label = status;

    switch (status.toLowerCase()) {
        case 'pending':
            color = '#facc15'; // yellow
            label = '🟡 Pending';
            break;
        case 'awaiting_approval':
            color = '#fb923c'; // orange
            label = '🟠 Awaiting Approval';
            break;
        case 'approved':
            color = '#4ade80'; // green
            label = '🟢 Approved';
            break;
    }

    return (
        <View style={[styles.badge, { backgroundColor: color }]}>
            <Text style={styles.text}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 8,
    },
    text: {
        color: '#000',
        fontWeight: '600',
        fontSize: 12,
    },
});