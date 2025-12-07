import React from 'react';
import { View, Text, Pressable, Modal, FlatList, StyleSheet } from 'react-native';
import { themeStyles, typography, spacing, colors } from '../styles/theme';

interface DropdownPickerProps {
    label: string;
    selectedValue: string | number | null;
    options: { label: string; value: string | number }[];
    onSelect: (value: string | number) => void;
    visible: boolean;
    setVisible: (val: boolean) => void;
}

export default function DropdownPicker({
    label,
    selectedValue,
    options,
    onSelect,
    visible,
    setVisible,
}: DropdownPickerProps) {
    return (
        <View style={{ marginBottom: spacing.md }}>
            <Text style={typography.body}>{label}</Text>
            <Pressable
                style={[themeStyles.input, { justifyContent: 'center' }]}
                onPress={() => setVisible(true)}
            >
                <Text>{options.find(opt => opt.value === selectedValue)?.label || 'Select...'}</Text>
            </Pressable>

            <Modal visible={visible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={options}
                            keyExtractor={(item, idx) =>
                                item.value != null ? item.value.toString() : `option-${idx}`
                            }
                            renderItem={({ item }) => (
                                <Pressable
                                    style={styles.optionItem}
                                    onPress={() => {
                                        if (item.value != null) {
                                            onSelect(item.value);
                                        }
                                        setVisible(false);
                                    }}
                                >
                                    <Text style={typography.body}>{item.label}</Text>
                                </Pressable>
                            )}
                        />
                        <Pressable onPress={() => setVisible(false)} style={styles.cancelButton}>
                            <Text style={themeStyles.buttonText}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingHorizontal: spacing.md,
    },
    modalContent: {
        backgroundColor: colors.background,
        borderRadius: 12,
        padding: spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    optionItem: {
        padding: spacing.md,
        borderBottomColor: colors.light,
        borderBottomWidth: 1,
    },
    cancelButton: {
        marginTop: spacing.md,
        padding: spacing.sm,
        backgroundColor: colors.danger,
        borderRadius: 8,
        alignItems: 'center',
    },
});
