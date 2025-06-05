import React from 'react';
import { Pressable, Text, View, Platform } from 'react-native';
import { colors, spacing, typography } from '../styles/theme';

interface Props {
    title: string;
    description: string;
    selected: boolean;
    onPress: () => void;
    borderColor: string;
}

export const SelectableCard = ({ title, description, selected, onPress, borderColor }: Props) => (
    <Pressable
        onPress={onPress}
        style={({ hovered }) => [
            {
                backgroundColor: selected ? colors.light : 'white',
                borderWidth: 2,
                borderColor: selected ? borderColor : colors.gray,
                padding: spacing.md,
                marginBottom: spacing.sm,
                borderRadius: 10,
                shadowColor: Platform.OS === 'web' || hovered ? '#000' : undefined,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
                transition: 'all 0.2s',
                ...(hovered && Platform.OS === 'web' && { backgroundColor: '#f9f9f9' }),
            },
        ]}
    >
        <Text style={[typography.subtitle, { marginBottom: 4 }]}>{title}</Text>
        <Text style={typography.small}>{description}</Text>
    </Pressable>
);