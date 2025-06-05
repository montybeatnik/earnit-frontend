import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

type Item = {
    id: number;
    title: string;
    description: string;
    points?: number;
};

type Props = {
    items: Item[];
    selectedIds: number[];
    toggleSelection: (id: number) => void;
};

export default function MultiSelectList({ items, selectedIds, toggleSelection }: Props) {
    return (
        <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                    <TouchableOpacity
                        style={[styles.card, isSelected && styles.selected]}
                        onPress={() => toggleSelection(item.id)}
                    >
                        <Text style={styles.title}>{item.title}</Text>
                        {item.description && <Text>{item.description}</Text>}
                        {item.points != null && <Text style={styles.points}>Points: {item.points}</Text>}
                    </TouchableOpacity>
                );
            }}
        />
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 12,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },
    selected: {
        borderColor: '#007bff',
        backgroundColor: '#e6f0ff',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    points: {
        marginTop: 4,
        color: 'green',
    },
});