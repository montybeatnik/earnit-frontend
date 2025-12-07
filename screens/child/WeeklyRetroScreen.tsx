import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ScrollView } from 'react-native';
import { api } from '../../services/api';
import { themeStyles, typography, spacing, colors } from '../../styles/theme';

type Retro = {
  id: number;
  wins: string;
  tries: string;
  week_start: string;
};

export default function WeeklyRetroScreen() {
  const [wins, setWins] = useState('');
  const [tries, setTries] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Retro[]>([]);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/retro/me');
      setHistory(res.data.retros || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const submit = async () => {
    if (!wins.trim() || !tries.trim()) {
      Alert.alert('Missing', 'Please add both wins and tries.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/retro', { wins, tries });
      Alert.alert('Saved', 'Reflection saved!');
      setWins('');
      setTries('');
      fetchHistory();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not save reflection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[themeStyles.fullScreenContainer, { paddingBottom: spacing.lg }]}>
      <Text style={themeStyles.screenHeader}>Weekly Wins & Tries</Text>
      <Text style={[typography.body, { marginBottom: spacing.sm }]}>
        Celebrate effort and plan your next move.
      </Text>
      <TextInput
        style={[themeStyles.input, { minHeight: 80, textAlignVertical: 'top' }]}
        multiline
        placeholder="What went well? (Wins)"
        value={wins}
        onChangeText={setWins}
      />
      <TextInput
        style={[themeStyles.input, { minHeight: 80, textAlignVertical: 'top' }]}
        multiline
        placeholder="What will you try next time? (Tries)"
        value={tries}
        onChangeText={setTries}
      />

      <Pressable style={themeStyles.button} onPress={submit} disabled={loading}>
        <Text style={themeStyles.buttonText}>{loading ? 'Saving...' : 'Save Reflection'}</Text>
      </Pressable>

      <Text style={[typography.subtitle, { marginTop: spacing.lg }]}>Recent reflections</Text>
      {history.map((retro, idx) => (
        <View key={retro.id ?? idx} style={{ marginTop: spacing.sm, padding: spacing.sm, borderWidth: 1, borderColor: colors.gray, borderRadius: 8 }}>
          <Text style={typography.small}>Week starting: {new Date(retro.week_start).toLocaleDateString()}</Text>
          <Text style={typography.body}>Wins: {retro.wins}</Text>
          <Text style={typography.body}>Tries: {retro.tries}</Text>
        </View>
      ))}
      {history.length === 0 && <Text style={themeStyles.bodyCenter}>No reflections yet.</Text>}
    </ScrollView>
  );
}
