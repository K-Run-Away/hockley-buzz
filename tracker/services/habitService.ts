import { db } from '@/lib/firebase';
import { Habit, HabitFormData } from '@/types/habit';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    Timestamp,
    updateDoc
} from 'firebase/firestore';

const HABITS_COLLECTION = 'habits';

// Type for habit data without id (for creating new habits)
type HabitData = Omit<Habit, 'id'>;

// Convert Habit to Firestore document
const habitToFirestore = (habit: Habit | HabitData) => {
  const data: any = {
    name: habit.name,
    createdAt: Timestamp.fromDate(habit.createdAt),
    completedDates: habit.completedDates.map(date => Timestamp.fromDate(date)),
  };
  
  // Only add description if it's not undefined
  if (habit.description !== undefined) {
    data.description = habit.description;
  }
  
  return data;
};

// Convert Firestore document to Habit
const firestoreToHabit = (doc: any): Habit => ({
  id: doc.id,
  name: doc.data().name,
  description: doc.data().description,
  createdAt: doc.data().createdAt.toDate(),
  completedDates: doc.data().completedDates.map((timestamp: Timestamp) => timestamp.toDate()),
});

export const habitService = {
  // Get all habits
  async getHabits(): Promise<Habit[]> {
    try {
      console.log('Fetching habits from Firestore...');
      const q = query(collection(db, HABITS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      console.log(`Found ${querySnapshot.docs.length} habits in Firestore`);
      return querySnapshot.docs.map(firestoreToHabit);
    } catch (error: any) {
      console.error('Error getting habits from Firestore:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        stack: error?.stack
      });
      throw error;
    }
  },

  // Add a new habit
  async addHabit(habitData: HabitFormData): Promise<Habit> {
    try {
      console.log('Adding habit to Firestore:', habitData);
      const habitDataForFirestore: HabitData = {
        name: habitData.name,
        description: habitData.description,
        createdAt: new Date(),
        completedDates: [],
      };

      const docRef = await addDoc(collection(db, HABITS_COLLECTION), habitToFirestore(habitDataForFirestore));
      console.log('Habit added successfully with ID:', docRef.id);
      
      return {
        ...habitDataForFirestore,
        id: docRef.id,
      };
    } catch (error: any) {
      console.error('Error adding habit to Firestore:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        stack: error?.stack
      });
      throw error;
    }
  },

  // Update a habit
  async updateHabit(habit: Habit): Promise<void> {
    try {
      const habitRef = doc(db, HABITS_COLLECTION, habit.id);
      await updateDoc(habitRef, habitToFirestore(habit));
    } catch (error) {
      console.error('Error updating habit:', error);
      throw error;
    }
  },

  // Delete a habit
  async deleteHabit(id: string): Promise<void> {
    try {
      const habitRef = doc(db, HABITS_COLLECTION, id);
      await deleteDoc(habitRef);
    } catch (error) {
      console.error('Error deleting habit:', error);
      throw error;
    }
  },

  // Toggle habit completion for a specific date
  async toggleHabitCompletion(id: string, date: Date = new Date()): Promise<void> {
    try {
      const habitRef = doc(db, HABITS_COLLECTION, id);
      
      // First, get the current habit data
      const habitDoc = await getDocs(query(collection(db, HABITS_COLLECTION)));
      const habit = habitDoc.docs.find(doc => doc.id === id);
      
      if (!habit) {
        throw new Error('Habit not found');
      }

      const currentHabit = firestoreToHabit(habit);
      const dateString = date.toDateString();
      const isCompleted = currentHabit.completedDates.some(
        completedDate => completedDate.toDateString() === dateString
      );

      let updatedCompletedDates: Date[];
      if (isCompleted) {
        // Remove the date if already completed
        updatedCompletedDates = currentHabit.completedDates.filter(
          completedDate => completedDate.toDateString() !== dateString
        );
      } else {
        // Add the date if not completed
        updatedCompletedDates = [...currentHabit.completedDates, date];
      }

      const updatedHabit = {
        ...currentHabit,
        completedDates: updatedCompletedDates,
      };

      await updateDoc(habitRef, habitToFirestore(updatedHabit));
    } catch (error) {
      console.error('Error toggling habit completion:', error);
      throw error;
    }
  },
}; 