import { Habit } from '@/types/habit';
import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface HabitHeatmapProps {
  habit: Habit;
  daysToShow?: number;
  onDayPress?: (date: Date) => void;
}

export function HabitHeatmap({ 
  habit, 
  daysToShow = 365, 
  onDayPress 
}: HabitHeatmapProps) {
  const heatmapData = useMemo(() => {
    const today = new Date();
    const data: Array<{ date: Date; completed: boolean; intensity: number }> = [];
    
    // Create array of dates going back from today
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const isCompleted = habit.completedDates.some(
        completedDate => completedDate.toDateString() === date.toDateString()
      );
      
      data.push({
        date,
        completed: isCompleted,
        intensity: isCompleted ? 1 : 0
      });
    }
    
    // Calculate intensity levels based on completion frequency in a rolling window
    const windowSize = 7; // 7-day rolling window
    const intensityData = data.map((day, index) => {
      if (!day.completed) return { ...day, intensity: 0 };
      
      // Count completions in the surrounding window
      const startIndex = Math.max(0, index - Math.floor(windowSize / 2));
      const endIndex = Math.min(data.length - 1, index + Math.floor(windowSize / 2));
      
      let completionsInWindow = 0;
      for (let i = startIndex; i <= endIndex; i++) {
        if (data[i].completed) {
          completionsInWindow++;
        }
      }
      
      // Map to intensity levels (1-4)
      let intensity = 1;
      if (completionsInWindow >= 4) intensity = 4;
      else if (completionsInWindow >= 3) intensity = 3;
      else if (completionsInWindow >= 2) intensity = 2;
      
      return { ...day, intensity };
    });
    
    return intensityData;
  }, [habit.completedDates, daysToShow]);

  const weeks = useMemo(() => {
    const weeks: Array<Array<{ date: Date; completed: boolean; intensity: number }>> = [];
    let currentWeek: Array<{ date: Date; completed: boolean; intensity: number }> = [];
    
    heatmapData.forEach((day, index) => {
      // Start a new week on Sundays (day 0) or at the beginning
      if (index === 0 || day.date.getDay() === 0) {
        if (currentWeek.length > 0) {
          weeks.push(currentWeek);
        }
        currentWeek = [];
      }
      currentWeek.push(day);
    });
    
    // Add the last week if it has data
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    return weeks;
  }, [heatmapData]);

  const getDayColor = (completed: boolean, intensity: number) => {
    if (!completed) return '#ebedf0'; // Light gray for no completion
    
    // GitHub-style intensity colors
    switch (intensity) {
      case 1: return '#9be9a8'; // Light green
      case 2: return '#40c463'; // Medium green
      case 3: return '#30a14e'; // Dark green
      case 4: return '#216e39'; // Darkest green
      default: return '#9be9a8';
    }
  };

  const handleDayPress = (day: { date: Date; completed: boolean; intensity: number }) => {
    if (onDayPress) {
      onDayPress(day.date);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const completionRate = Math.round((habit.completedDates.length / daysToShow) * 100);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="subtitle" style={styles.title}>
          {habit.name} Activity
        </ThemedText>
        <ThemedView style={styles.legend}>
          <ThemedText style={styles.legendText}>Less</ThemedText>
          <ThemedView style={styles.legendSquares}>
            <ThemedView style={[styles.legendSquare, { backgroundColor: '#ebedf0' }]} />
            <ThemedView style={[styles.legendSquare, { backgroundColor: '#9be9a8' }]} />
            <ThemedView style={[styles.legendSquare, { backgroundColor: '#40c463' }]} />
            <ThemedView style={[styles.legendSquare, { backgroundColor: '#30a14e' }]} />
            <ThemedView style={[styles.legendSquare, { backgroundColor: '#216e39' }]} />
          </ThemedView>
          <ThemedText style={styles.legendText}>More</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.heatmapContainer}>
        {weeks.map((week, weekIndex) => (
          <ThemedView key={weekIndex} style={styles.week}>
            {week.map((day, dayIndex) => (
              <TouchableOpacity
                key={dayIndex}
                style={[
                  styles.day,
                  { backgroundColor: getDayColor(day.completed, day.intensity) }
                ]}
                onPress={() => handleDayPress(day)}
                accessibilityLabel={`${formatDate(day.date)} - ${day.completed ? 'Completed' : 'Not completed'}`}
              />
            ))}
          </ThemedView>
        ))}
      </ThemedView>

      <ThemedView style={styles.stats}>
        <ThemedText style={styles.statText}>
          {habit.completedDates.length} days completed
        </ThemedText>
        <ThemedText style={styles.statText}>
          {completionRate}% completion rate
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 12,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  legendSquares: {
    flexDirection: 'row',
    gap: 2,
  },
  legendSquare: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  heatmapContainer: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 16,
  },
  week: {
    flexDirection: 'column',
    gap: 2,
  },
  day: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  statText: {
    fontSize: 14,
    color: '#666',
  },
}); 