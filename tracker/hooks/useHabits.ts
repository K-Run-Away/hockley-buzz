import { habitService } from '@/services/habitService';
import { Habit, HabitFormData } from '@/types/habit';
import { useCallback, useEffect, useState } from 'react';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load habits from Firebase on mount
  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const habitsData = await habitService.getHabits();
      setHabits(habitsData);
    } catch (err) {
      console.error('Error loading habits:', err);
      setError('Failed to load habits');
    } finally {
      setLoading(false);
    }
  }, []);

  const addHabit = useCallback(async (habitData: HabitFormData) => {
    try {
      setError(null);
      const newHabit = await habitService.addHabit(habitData);
      setHabits(prev => [newHabit, ...prev]);
    } catch (err) {
      console.error('Error adding habit:', err);
      setError('Failed to add habit');
      throw err;
    }
  }, []);

  const deleteHabit = useCallback(async (id: string) => {
    try {
      setError(null);
      await habitService.deleteHabit(id);
      setHabits(prev => prev.filter(habit => habit.id !== id));
    } catch (err) {
      console.error('Error deleting habit:', err);
      setError('Failed to delete habit');
      throw err;
    }
  }, []);

  const toggleHabitCompletion = useCallback(async (id: string, date: Date = new Date()) => {
    try {
      setError(null);
      await habitService.toggleHabitCompletion(id, date);
      
      // Update local state
      setHabits(prev => prev.map(habit => {
        if (habit.id === id) {
          const dateString = date.toDateString();
          const isCompleted = habit.completedDates.some(
            completedDate => completedDate.toDateString() === dateString
          );
          
          if (isCompleted) {
            return {
              ...habit,
              completedDates: habit.completedDates.filter(
                completedDate => completedDate.toDateString() !== dateString
              ),
            };
          } else {
            return {
              ...habit,
              completedDates: [...habit.completedDates, date],
            };
          }
        }
        return habit;
      }));
    } catch (err) {
      console.error('Error toggling habit completion:', err);
      setError('Failed to update habit');
      throw err;
    }
  }, []);

  const getHabitStreak = useCallback((habit: Habit): number => {
    if (habit.completedDates.length === 0) return 0;
    
    const sortedDates = habit.completedDates
      .map(date => new Date(date))
      .sort((a, b) => b.getTime() - a.getTime());
    
    let streak = 0;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if completed today
    const completedToday = sortedDates.some(
      date => date.toDateString() === today.toDateString()
    );
    
    if (completedToday) {
      streak = 1;
      let currentDate = yesterday;
      
      for (let i = 1; i < sortedDates.length; i++) {
        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - i);
        
        const hasCompletedOnDate = sortedDates.some(
          date => date.toDateString() === expectedDate.toDateString()
        );
        
        if (hasCompletedOnDate) {
          streak++;
        } else {
          break;
        }
      }
    }
    
    return streak;
  }, []);

  return {
    habits,
    loading,
    error,
    addHabit,
    deleteHabit,
    toggleHabitCompletion,
    getHabitStreak,
    refreshHabits: loadHabits,
  };
} 