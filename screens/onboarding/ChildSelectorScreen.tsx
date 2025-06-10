import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { themeStyles } from '../../styles/theme';
import { API_BASE_URL } from '@env';

export default function ChildSelectorScreen() {
    const [parentCode, setParentCode] = useState('');
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<any>();

    const handleFetchChildren = async () => {
        if (!parentCode.trim()) {
            Alert.alert('Missing code', 'Please enter a parent code');
            return;
        }

        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/children/by-parent-code/${parentCode}`);
            setChildren(res.data);
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Could not find children for that parent code');
        } finally {
            setLoading(false);
        }
    };

    const handleChildSelect = (child: any) => {
        // Navigate to password setup with the selected child ID
        navigation.navigate('ChildPasswordSetup', { childId: child.id });
    };

    return (
        <View style={themeStyles.container}>
            <Text style={themeStyles.title}>Enter Your Parent Code</Text>

            <TextInput
                placeholder="Parent Code"
                value={parentCode}
                onChangeText={setParentCode}
                style={themeStyles.input}
                autoCapitalize="none"
            />

            <Pressable onPress={handleFetchChildren} style={themeStyles.button} disabled={loading}>
                <Text style={themeStyles.buttonText}>Find My Account</Text>
            </Pressable>

            {children.length > 0 && (
                <>
                    <Text style={themeStyles.subtitle}>Which one is you?</Text>
                    <FlatList
                        data={children}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <Pressable
                                style={[themeStyles.card, { marginVertical: 8 }]}
                                onPress={() => handleChildSelect(item)}
                            >
                                <Text style={{ fontSize: 18 }}>{item.name}</Text>
                            </Pressable>
                        )}
                    />
                </>
            )}
        </View>
    );
}   