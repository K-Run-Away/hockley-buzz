import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useHabits } from '@/hooks/useHabits';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export default function StatsScreen() {
  const { habits, getHabitStreak } = useHabits();

  const totalHabits = habits.length;
  const completedToday = habits.filter(habit => {
    const today = new Date().toDateString();
    return habit.completedDates.some(date => 
      new Date(date).toDateString() === today
    );
  }).length;

  const totalCompletions = habits.reduce((total, habit) => 
    total + habit.completedDates.length, 0
  );

  const averageStreak = habits.length > 0 
    ? habits.reduce((total, habit) => total + getHabitStreak(habit), 0) / habits.length
    : 0;

  const StatCard = ({ title, value, icon, color }: any) => (
    <ThemedView style={styles.statCard}>
      <ThemedView style={[styles.iconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="white" />
      </ThemedView>
      <ThemedView style={styles.statContent}>
        <ThemedText type="title" style={styles.statValue}>
          {value}
        </ThemedText>
        <ThemedText style={styles.statTitle}>{title}</ThemedText>
      </ThemedView>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Statistics</ThemedText>
      </ThemedView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.statsGrid}>
          <StatCard
            title="Total Habits"
            value={totalHabits}
            icon="list"
            color="#4CAF50"
          />
          <StatCard
            title="Completed Today"
            value={completedToday}
            icon="checkmark-circle"
            color="#2196F3"
          />
          <StatCard
            title="Total Completions"
            value={totalCompletions}
            icon="trophy"
            color="#FF9800"
          />
          <StatCard
            title="Avg. Streak"
            value={averageStreak.toFixed(1)}
            icon="flame"
            color="#F44336"
          />
        </ThemedView>

        {habits.length > 0 && (
          <ThemedView style={styles.habitStats}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Habit Details
            </ThemedText>
            {habits.map(habit => (
              <ThemedView key={habit.id} style={styles.habitStat}>
                <ThemedText type="subtitle" style={styles.habitName}>
                  {habit.name}
                </ThemedText>
                <ThemedView style={styles.habitMetrics}>
                  <ThemedText style={styles.metric}>
                    🔥 {getHabitStreak(habit)} day streak
                  </ThemedText>
                  <ThemedText style={styles.metric}>
                    ✅ {habit.completedDates.length} total completions
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            ))}
          </ThemedView>
        )}

        {habits.length === 0 && (
          <ThemedView style={styles.emptyState}>
            <Ionicons name="stats-chart-outline" size={64} color="#ccc" />
            <ThemedText type="subtitle" style={styles.emptyTitle}>
              No data yet
            </ThemedText>
            <ThemedText style={styles.emptyDescription}>
              Add some habits to see your statistics here!
            </ThemedText>
          </ThemedView>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
  },
  habitStats: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  habitStat: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  habitName: {
    marginBottom: 8,
  },
  habitMetrics: {
    gap: 4,
  },
  metric: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    color: '#666',
  },
  emptyDescription: {
    textAlign: 'center',
    color: '#999',
    lineHeight: 20,
  },
});
