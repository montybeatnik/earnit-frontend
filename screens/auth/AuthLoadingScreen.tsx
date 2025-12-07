import React, { useEffect } from 'react';
import { View, Button, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getSession } from '../../services/session';

export default function AuthLoadingScreen() {
  const navigation = useNavigation<any>();

  // screens/auth/AuthLoadingScreen.tsx

  useEffect(() => {
    const bootstrapAsync = async () => {
      const { token, role } = await getSession();

      if (token && role) {
        navigation.reset({
          index: 0,
          routes: [{ name: role === 'parent' ? 'Parent' : 'Child' }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Onboarding' }],
        });
      }
    };

    bootstrapAsync();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Button title="Dev Switch" onPress={() => navigation.navigate('DevSwitchUser')} />
    </View>
  );
}
