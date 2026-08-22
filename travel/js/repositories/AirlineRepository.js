import { getSupabase } from '../database/database.js';

export const AirlineRepository = {
  async getAllActive() {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('airlines')
      .select('*')
      .eq('active', 1)
      .order('name', { ascending: true });

    if (error) console.error('AirlineRepository.getAllActive error:', error);
    return data || [];
  },

  async findById(id) {
    if (!id) return null;
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('airlines')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) console.error('AirlineRepository.findById error:', error);
    return data;
  },

  async findByCode(code) {
    if (!code) return null;
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('airlines')
      .select('*')
      .ilike('code', code)
      .maybeSingle();

    if (error) console.error('AirlineRepository.findByCode error:', error);
    return data;
  }
};
