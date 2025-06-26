import { AddHabitModal } from '@/components/AddHabitModal';
import { HabitCard } from '@/components/HabitCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useHabits } from '@/hooks/useHabits';
import { testFirestoreConnection } from '@/lib/firebase';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const { 
    habits, 
    loading, 
    error, 
    addHabit, 
    deleteHabit, 
    toggleHabitCompletion, 
    getHabitStreak,
    refreshHabits 
  } = useHabits();
  const [showAddModal, setShowAddModal] = useState(false);

  // Test Firestore connection on app load
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  const isCompletedToday = (habit: any) => {
    const today = new Date().toDateString();
    return habit.completedDates.some((date: Date) => 
      new Date(date).toDateString() === today
    );
  };

  const handleAddHabit = async (habitData: any) => {
    try {
      await addHabit(habitData);
      setShowAddModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to add habit. Please try again.');
    }
  };

  const handleDeleteHabit = async (id: string) => {
    try {
      await deleteHabit(id);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete habit. Please try again.');
    }
  };

  const handleToggleCompletion = async (id: string) => {
    try {
      await toggleHabitCompletion(id);
    } catch (error) {
      Alert.alert('Error', 'Failed to update habit. Please try again.');
    }
  };

  const renderHabit = ({ item }: { item: any }) => (
    <HabitCard
      habit={item}
      streak={getHabitStreak(item)}
      isCompletedToday={isCompletedToday(item)}
      onToggleCompletion={handleToggleCompletion}
      onDelete={handleDeleteHabit}
    />
  );

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <ThemedText style={styles.loadingText}>Loading habits...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">My Habits</ThemedText>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </ThemedView>

      {error && (
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <TouchableOpacity onPress={refreshHabits} style={styles.retryButton}>
            <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}

      {habits.length === 0 && !error ? (
        <ThemedView style={styles.emptyState}>
          <Ionicons name="list-outline" size={64} color="#ccc" />
          <ThemedText type="subtitle" style={styles.emptyTitle}>
            No habits yet
          </ThemedText>
          <ThemedText style={styles.emptyDescription}>
            Tap the + button to add your first habit and start tracking!
          </ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={habits}
          renderItem={renderHabit}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={refreshHabits}
        />
      )}

      <AddHabitModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddHabit={handleAddHabit}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  list: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    margin: 20,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f44336',
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
