import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Pressable,
    ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { themeStyles, typography, colors, spacing } from '../../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SelectableCard } from '../../components/SelectableCard';

interface TemplateItem {
    id: number;
    title: string;
    description: string;
}

export default function BoilerplateSelectionScreen() {
    const [tasks, setTasks] = useState<TemplateItem[]>([]);
    const [rewards, setRewards] = useState<TemplateItem[]>([]);
    const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([]);
    const [selectedRewardIds, setSelectedRewardIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const [taskRes, rewardRes] = await Promise.all([
                    axios.get('http://localhost:8080/boilerplate/tasks'),
                    axios.get('http://localhost:8080/boilerplate/rewards'),
                ]);
                setTasks(taskRes.data.tasks);
                setRewards(rewardRes.data.rewards);
            } catch (err) {
                console.error('Error fetching boilerplate data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTemplates();
    }, []);

    const toggleSelect = (id: number, isTask: boolean) => {
        if (isTask) {
            setSelectedTaskIds((prev) =>
                prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
            );
        } else {
            setSelectedRewardIds((prev) =>
                prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
            );
        }
    };

    const handleSubmit = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            await axios.post(
                'http://localhost:8080/boilerplate/assign-tasks',
                { task_ids: selectedTaskIds },
                { headers }
            );

            await axios.post(
                'http://localhost:8080/boilerplate/assign-rewards',
                { reward_ids: selectedRewardIds },
                { headers }
            );

            navigation.navigate('ChildSetup' as never);
        } catch (err) {
            console.error('Error assigning templates', err);
        }
    };

    if (loading) {
        return (
            <View style={themeStyles.container}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={[themeStyles.fullScreenContainer]}>
            <Text style={[typography.title, { marginBottom: spacing.lg }]}>Choose Tasks</Text>
            {tasks.map((task) => (
                <SelectableCard
                    key={task.id}
                    title={task.title}
                    description={task.description}
                    selected={selectedTaskIds.includes(task.id)}
                    onPress={() => toggleSelect(task.id, true)}
                    borderColor={colors.primary}
                />
            ))}

            <Text style={[typography.title, { marginTop: spacing.lg }]}>Choose Rewards</Text>
            {rewards.map((reward) => (
                <SelectableCard
                    key={reward.id}
                    title={reward.title}
                    description={reward.description}
                    selected={selectedRewardIds.includes(reward.id)}
                    onPress={() => toggleSelect(reward.id, false)}
                    borderColor={colors.secondary}
                />
            ))}

            <Pressable
                onPress={handleSubmit}
                style={{
                    backgroundColor: colors.primary,
                    padding: spacing.md,
                    marginTop: spacing.xl,
                    borderRadius: 10,
                    alignItems: 'center',
                }}
            >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Continue</Text>
            </Pressable>
        </ScrollView>
    );
}