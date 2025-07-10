import { supabase } from './supabase';

export interface SOP {
  id: string;
  title: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export async function saveSOP(sop: Omit<SOP, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('sops')
    .insert([
      {
        title: sop.title,
        description: sop.description,
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getSOPs() {
  const { data, error } = await supabase
    .from('sops')
    .select('id, title, description, created_at, updated_at')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getSOP(id: string) {
  const { data, error } = await supabase
    .from('sops')
    .select('id, title, description, created_at, updated_at')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateSOP(id: string, sop: Partial<SOP>) {
  console.log('updateSOP called with id:', id, 'sop:', sop);
  const { data, error } = await supabase
    .from('sops')
    .update({
      title: sop.title,
      description: sop.description,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .maybeSingle();
  console.log('updateSOP result:', { data, error });
  if (error || !data || !data.id) {
    alert(
      'Failed to update SOP.\n' +
      'id: ' + id + '\n' +
      'sop: ' + JSON.stringify(sop) + '\n' +
      'data: ' + JSON.stringify(data) + '\n' +
      'error: ' + (error ? error.message : 'none')
    );
    throw error || new Error('No data returned');
  }
  return data;
}

export async function deleteSOP(id: string) {
  const { error } = await supabase
    .from('sops')
    .delete()
    .eq('id', id);

  if (error) throw error;
} 