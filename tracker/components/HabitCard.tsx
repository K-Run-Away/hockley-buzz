import { Habit } from '@/types/habit';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { HabitHeatmap } from './HabitHeatmap';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface HabitCardProps {
  habit: Habit;
  streak: number;
  isCompletedToday: boolean;
  onToggleCompletion: (id: string) => void;
  onDelete: (id: string) => void;
}

export function HabitCard({ 
  habit, 
  streak, 
  isCompletedToday, 
  onToggleCompletion, 
  onDelete 
}: HabitCardProps) {
  const [showHeatmap, setShowHeatmap] = useState(false);

  const handleDelete = () => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(habit.id) },
      ]
    );
  };

  const handleHeatmapDayPress = (date: Date) => {
    // Toggle completion for the selected date
    onToggleCompletion(habit.id);
  };

  return (
    <ThemedView style={styles.card}>
      <TouchableOpacity 
        style={styles.content}
        onPress={() => onToggleCompletion(habit.id)}
      >
        <ThemedView style={styles.habitInfo}>
          <ThemedText type="subtitle" style={styles.habitName}>
            {habit.name}
          </ThemedText>
          {habit.description && (
            <ThemedText style={styles.description}>
              {habit.description}
            </ThemedText>
          )}
          <ThemedText style={styles.streak}>
            🔥 {streak} day{streak !== 1 ? 's' : ''} streak
          </ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.actions}>
          <ThemedView style={[
            styles.checkbox, 
            isCompletedToday && styles.checkboxCompleted
          ]}>
            {isCompletedToday && (
              <Ionicons name="checkmark" size={20} color="white" />
            )}
          </ThemedView>
          
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
          </TouchableOpacity>
        </ThemedView>
      </TouchableOpacity>

      <ThemedView style={styles.heatmapSection}>
        <TouchableOpacity 
          style={styles.heatmapToggle}
          onPress={() => setShowHeatmap(!showHeatmap)}
        >
          <ThemedText style={styles.heatmapToggleText}>
            {showHeatmap ? 'Hide' : 'View'} Activity Heatmap
          </ThemedText>
          <Ionicons 
            name={showHeatmap ? "chevron-up" : "chevron-down"} 
            size={16} 
            color="#666" 
          />
        </TouchableOpacity>
        
        {showHeatmap && (
          <ThemedView style={styles.heatmapContainer}>
            <HabitHeatmap 
              habit={habit} 
              daysToShow={90} 
              onDayPress={handleHeatmapDayPress}
            />
          </ThemedView>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  streak: {
    fontSize: 12,
    color: '#ff6b6b',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  deleteButton: {
    padding: 8,
  },
  heatmapSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  heatmapToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  heatmapToggleText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  heatmapContainer: {
    marginTop: 12,
  },
}); 