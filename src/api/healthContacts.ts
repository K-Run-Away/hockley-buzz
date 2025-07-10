import { supabase } from './supabase';

export interface HealthContact {
  id: string;
  name: string;
  number: string;
  description: string;
  category: string;
  created_at?: string;
}

export async function getHealthContacts() {
  const { data, error } = await supabase
    .from('health_contacts')
    .select('id, name, number, description, category, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function addHealthContact(contact: Omit<HealthContact, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('health_contacts')
    .insert([contact])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateHealthContact(id: string, contact: Partial<HealthContact>) {
  const { data, error } = await supabase
    .from('health_contacts')
    .update(contact)
    .eq('id', id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function deleteHealthContact(id: string) {
  const { error } = await supabase
    .from('health_contacts')
    .delete()
    .eq('id', id);
  if (error) throw error;
} 