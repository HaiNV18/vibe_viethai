import { getSupabase } from '../database/database.js';

function formatTour(t) {
  if (!t) return null;
  return {
    ...t,
    airline_name: t.airlines ? t.airlines.name : '',
    airline_logo: t.airlines ? t.airlines.logo : ''
  };
}

export const TourRepository = {
  async getFeatured(limit = 8) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('tours')
      .select('*, airlines(name, logo)')
      .eq('featured', 1)
      .order('id', { ascending: true })
      .limit(limit);

    if (error) console.error('TourRepository.getFeatured error:', error);
    return (data || []).map(formatTour);
  },

  async findById(id) {
    if (!id) return null;
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('tours')
      .select('*, airlines(name, logo)')
      .eq('id', id)
      .maybeSingle();

    if (error) console.error('TourRepository.findById error:', error);
    return formatTour(data);
  },

  async getItineraryByTourId(tourId) {
    if (!tourId) return [];
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('tour_itineraries')
      .select('*')
      .eq('tour_id', tourId)
      .order('day_number', { ascending: true });

    if (error) console.error('TourRepository.getItineraryByTourId error:', error);
    return data || [];
  },

  async searchAndFilter(filters = {}) {
    const supabase = getSupabase();
    let query = supabase
      .from('tours')
      .select('*, airlines(name, logo)')
      .eq('status', 'available');

    if (filters.operator) {
      query = query.eq('operator', filters.operator);
    }

    if (filters.departureDate) {
      query = query.eq('departure_date', filters.departureDate);
    }

    if (filters.days) {
      query = query.eq('days', parseInt(filters.days));
    }

    if (filters.country) {
      query = query.ilike('country', filters.country);
    }

    if (filters.sortBy === 'price-desc') {
      query = query.order('price', { ascending: false });
    } else {
      query = query.order('price', { ascending: true });
    }

    const { data, error } = await query;
    if (error) {
      console.error('TourRepository.searchAndFilter error:', error);
      return [];
    }

    let results = (data || []).map(formatTour);

    if (filters.destination) {
      const destMatch = filters.destination.toUpperCase();
      results = results.filter(t => 
        (t.destination && t.destination.toUpperCase().includes(destMatch)) ||
        (t.name && t.name.toUpperCase().includes(destMatch))
      );
    }

    return results;
  },

  async countAll() {
    const supabase = getSupabase();
    const { count, error } = await supabase
      .from('tours')
      .select('*', { count: 'exact', head: true });

    if (error) console.error('TourRepository.countAll error:', error);
    return count || 0;
  },

  async getPaginated(limit = 20, offset = 0) {
    const supabase = getSupabase();
    const from = offset;
    const to = offset + limit - 1;

    const { data, error } = await supabase
      .from('tours')
      .select('*, airlines(name, logo)')
      .order('id', { ascending: true })
      .range(from, to);

    if (error) console.error('TourRepository.getPaginated error:', error);
    return (data || []).map(formatTour);
  },

  async create(tourData, itineraries = []) {
    const supabase = getSupabase();
    const { code, name, operator, origin, destination, country, departure_date, days, nights, airline_id, aircraft, price, thumbnail, description, included_services, excluded_services, featured } = tourData;
    
    const { data: tour, error } = await supabase
      .from('tours')
      .insert([{
        code, name, operator, origin, destination, country, departure_date,
        days, nights, airline_id: airline_id || null, aircraft: aircraft || null,
        price, thumbnail: thumbnail || null, description: description || null,
        included_services: included_services || null, excluded_services: excluded_services || null,
        featured: featured ? 1 : 0
      }])
      .select()
      .single();

    if (error) {
      console.error('TourRepository.create error:', error);
      throw error;
    }

    if (itineraries && itineraries.length > 0) {
      const itinItems = itineraries.map(it => ({
        tour_id: tour.id,
        day_number: it.day_number,
        title: it.title,
        description: it.description,
        meals: it.meals || null,
        accommodation: it.accommodation || null
      }));
      await supabase.from('tour_itineraries').insert(itinItems);
    }

    return tour;
  }
};
