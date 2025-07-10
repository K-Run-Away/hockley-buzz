import { supabase } from './supabase';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  created_at?: string;
}

export async function getAnnouncements() {
  const { data, error } = await supabase
    .from('announcements')
    .select('id, title, content, date, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function addAnnouncement(announcement: Omit<Announcement, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('announcements')
    .insert([announcement])
    .select()
    .single();
  if (error) throw error;
  return data;
} 