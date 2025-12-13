import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { api } from '../../services/api';
import { themeStyles, typography, spacing, colors } from '../../styles/theme';

type Transaction = {
  id: number;
  amount_cents: number;
  type: 'earn' | 'spend';
  description: string;
  created_at: string;
};

type MoneyResponse = {
  balance_cents: number;
  total_earned_cents: number;
  total_spent_cents: number;
  transactions: Transaction[];
};

const formatMoney = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export default function MoneyScreen() {
  const [data, setData] = useState<MoneyResponse | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const res = await api.get('/transactions/me');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.card}>
      <Text style={styles.desc}>{item.description}</Text>
      <Text style={[styles.amount, { color: item.amount_cents >= 0 ? colors.secondary : colors.danger }]}>
        {item.amount_cents >= 0 ? '+' : '-'}{formatMoney(Math.abs(item.amount_cents))}
      </Text>
      <Text style={styles.date}>{new Date(item.created_at).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={themeStyles.fullScreenContainer}>
      <Text style={themeStyles.screenHeader}>My Money</Text>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>Balance: {formatMoney(data?.balance_cents || 0)}</Text>
        <Text style={styles.small}>Earned: {formatMoney(data?.total_earned_cents || 0)} | Spent: {formatMoney(data?.total_spent_cents || 0)}</Text>
      </View>

      <FlatList
        data={data?.transactions || []}
        keyExtractor={(item, idx) => (item.id ?? idx).toString()}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchData} />}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={<Text style={themeStyles.bodyCenter}>No transactions yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  summary: {
    backgroundColor: colors.light,
    padding: spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray,
    marginBottom: spacing.md,
    width: '100%',
  },
  summaryText: {
    ...typography.subtitle,
  },
  small: {
    ...typography.small,
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.light,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  desc: {
    ...typography.body,
    marginBottom: spacing.xs,
  },
  amount: {
    ...typography.subtitle,
  },
  date: {
    ...typography.small,
    marginTop: spacing.xs,
  },
});
