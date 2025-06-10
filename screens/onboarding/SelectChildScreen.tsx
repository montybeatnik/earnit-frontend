import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { themeStyles, typography } from '../../styles/theme';

export default function SelectChildScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const { children } = route.params as { children: { id: number; name: string }[] };

    const handleSelect = (childId: number) => {
        navigation.navigate('ChildPasswordSetup', { childId });
    };

    useEffect(() => {
        console.log('NAVIGATION STATE:', navigation.getState());
    }, []);

    return (
        <View style={themeStyles.fullScreenContainer}>
            <Text style={[typography.title, { textAlign: 'center', marginBottom: 24 }]}>
                Who Are You?
            </Text>

            <FlatList
                data={children}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => handleSelect(item.id)}
                        style={[themeStyles.card, { alignItems: 'center' }]}
                    >
                        <Text style={typography.body}>{item.name}</Text>
                    </Pressable>
                )}
                ListEmptyComponent={
                    <Text style={typography.bodyCenter}>No children found for this parent code.</Text>
                }
            />
        </View>
    );
}