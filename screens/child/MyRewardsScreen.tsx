import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { api } from '../../services/api';
import { themeStyles, typography, spacing, colors } from '../../styles/theme';

type Redemption = {
  id: number;
  status: string;
  execution_notes?: string;
  reflection?: string;
  reward?: {
    title: string;
    type?: string;
    meta?: any;
  };
};

export default function MyRewardsScreen() {
  const [data, setData] = useState<Redemption[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const res = await api.get('/redemptions/me');
      setData(res.data.redemptions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderItem = ({ item }: { item: Redemption }) => (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.title}>{item.reward?.title || 'Reward'}</Text>
        <Text style={styles.badge}>
          {item.reward?.type === 'investment' ? 'Investment' : item.reward?.type === 'screen_time' ? 'Screen Time' : 'Tangible'}
        </Text>
      </View>
      <Text style={styles.small}>Status: {item.status}</Text>
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
      {item.execution_notes ? <Text style={styles.small}>Parent notes: {item.execution_notes}</Text> : null}
      {item.reflection ? <Text style={styles.small}>Your reflection: {item.reflection}</Text> : null}
    </View>
  );

  return (
    <View style={themeStyles.fullScreenContainer}>
      <Text style={themeStyles.screenHeader}>My Rewards</Text>
      <FlatList
        data={data}
        keyExtractor={(item, idx) => (item.id ?? (item as any).ID ?? idx).toString()}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchData} />}
        contentContainerStyle={{ paddingBottom: 80 }}
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
  badge: {
    ...typography.small,
    backgroundColor: colors.light,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  small: {
    ...typography.small,
    marginTop: 4,
  },
});
