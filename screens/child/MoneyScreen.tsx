import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, TextInput, Pressable } from 'react-native';
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
  buckets?: Bucket[];
};

const formatMoney = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export default function MoneyScreen() {
  const [data, setData] = useState<MoneyResponse | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [allocAmount, setAllocAmount] = useState('');
  const [bucketType, setBucketType] = useState<'spend' | 'save' | 'invest'>('save');
  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const [txRes, bucketsRes] = await Promise.all([
        api.get('/transactions/me'),
        api.get('/buckets'),
      ]);
      setData({ ...txRes.data, buckets: bucketsRes.data?.buckets || [] });
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

      <View style={styles.cardRow}>
        <Text style={styles.sectionTitle}>Buckets</Text>
        <View style={{ flexDirection: 'row', marginBottom: spacing.sm }}>
          {(['spend', 'save', 'invest'] as const).map((t) => (
            <Pressable
              key={t}
              onPress={() => setBucketType(t)}
              style={[
                styles.chip,
                { borderColor: bucketType === t ? colors.primary : colors.gray, backgroundColor: bucketType === t ? colors.light : 'transparent' },
              ]}
            >
              <Text style={{ color: colors.text }}>{t.toUpperCase()}</Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          style={themeStyles.input}
          placeholder="Allocate amount (e.g., 2.50)"
          value={allocAmount}
          onChangeText={setAllocAmount}
          keyboardType="decimal-pad"
        />
        <Pressable style={themeStyles.button} onPress={allocate}>
          <Text style={themeStyles.buttonText}>Allocate to {bucketType}</Text>
        </Pressable>

        <Text style={[styles.small, { marginTop: spacing.sm }]}>Set a goal for this bucket</Text>
        <TextInput
          style={themeStyles.input}
          placeholder="Goal name (e.g., Book)"
          value={goalName}
          onChangeText={setGoalName}
        />
        <TextInput
          style={themeStyles.input}
          placeholder="Goal amount (e.g., 15.00)"
          value={goalAmount}
          onChangeText={setGoalAmount}
          keyboardType="decimal-pad"
        />
        <Pressable style={[themeStyles.button, { backgroundColor: colors.secondary }]} onPress={setGoal}>
          <Text style={themeStyles.buttonText}>Save Goal</Text>
        </Pressable>
      </View>

      <FlatList
        data={data?.buckets || []}
        keyExtractor={(item, idx) => (item.id ?? idx).toString()}
        renderItem={renderBucket}
        ListEmptyComponent={<Text style={themeStyles.bodyCenter}>No buckets yet.</Text>}
        contentContainerStyle={{ paddingBottom: spacing.md }}
      />

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
  sectionTitle: {
    ...typography.subtitle,
    marginBottom: spacing.xs,
  },
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: spacing.xs,
  },
  bucketCard: {
    backgroundColor: colors.light,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  bucketTitle: {
    ...typography.subtitle,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.light,
    borderRadius: 4,
    marginTop: spacing.xs,
  },
  progressFill: {
    height: 8,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
});
  const allocate = async () => {
    const amountCents = allocAmount ? Math.round(parseFloat(allocAmount) * 100) : 0;
    if (!amountCents || amountCents <= 0) return;
    try {
      await api.post('/buckets/allocate', { type: bucketType, amount_cents: amountCents });
      setAllocAmount('');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const setGoal = async () => {
    const goalCents = goalAmount ? Math.round(parseFloat(goalAmount) * 100) : 0;
    try {
      await api.post('/buckets/goal', { type: bucketType, goal_cents: goalCents, goal_name: goalName });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const renderBucket = ({ item }: { item: Bucket }) => {
    const progress = item.goal_cents > 0 ? Math.min(1, item.amount_cents / item.goal_cents) : 0;
    const projected1Y = item.type === 'invest' ? item.amount_cents * 1.05 : item.amount_cents;
    return (
      <View style={styles.bucketCard}>
        <Text style={styles.bucketTitle}>{item.type === 'invest' ? 'Invest' : item.type === 'save' ? 'Save' : 'Spend'}</Text>
        <Text style={styles.small}>Balance: {formatMoney(item.amount_cents)}</Text>
        {item.goal_cents > 0 && (
          <>
            <Text style={styles.small}>
              Goal: {item.goal_name || 'Goal'} ({formatMoney(item.goal_cents)})
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>
            <Text style={styles.small}>{Math.round(progress * 100)}% to goal</Text>
          </>
        )}
        {item.type === 'invest' && (
          <Text style={styles.small}>
            1-yr projection @5%: {formatMoney(Math.round(projected1Y))}
          </Text>
        )}
      </View>
    );
  };
