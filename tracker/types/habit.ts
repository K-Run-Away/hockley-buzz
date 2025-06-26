export interface Habit {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  completedDates: Date[];
}

export interface HabitFormData {
  name: string;
  description?: string;
} 