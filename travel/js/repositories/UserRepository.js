import { getSupabase } from '../database/database.js';

export const UserRepository = {
  async findByEmail(email) {
    if (!email) return null;
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('email', email)
      .maybeSingle();
    
    if (error) console.error('UserRepository.findByEmail error:', error);
    return data;
  },

  async findByUsername(username) {
    if (!username) return null;
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('username', username)
      .maybeSingle();
    
    if (error) console.error('UserRepository.findByUsername error:', error);
    return data;
  },

  async findById(id) {
    if (!id) return null;
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) console.error('UserRepository.findById error:', error);
    return data;
  },

  async create(user) {
    const supabase = getSupabase();
    const { username, email, password_hash, role = 'user', full_name = '', phone = '', country = 'Vietnam', address = '' } = user;
    
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, email, password_hash, role, full_name, phone, country, address }])
      .select()
      .single();

    if (error) {
      console.error('UserRepository.create error:', error);
      throw error;
    }
    return data;
  },

  async update(id, data) {
    const supabase = getSupabase();
    const { full_name, phone, country, address, avatar } = data;
    const updatedAt = new Date().toISOString();

    const { data: updated, error } = await supabase
      .from('users')
      .update({ full_name, phone, country, address, avatar, updated_at: updatedAt })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('UserRepository.update error:', error);
      throw error;
    }
    return updated;
  }
};
