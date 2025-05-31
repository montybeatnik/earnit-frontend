import { StyleSheet } from 'react-native';

export const theme = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 6,
    },
    status: {
        marginTop: 8,
        fontWeight: '500',
    },
    points: {
        fontStyle: 'italic',
        color: 'green',
        marginTop: 4,
    },
    timestamp: {
        fontSize: 12,
        color: '#aaa',
        marginTop: 4,
    },
    buttonSpacing: {
        marginVertical: 8,
    },
});