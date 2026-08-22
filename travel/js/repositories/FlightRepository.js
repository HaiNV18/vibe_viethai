import { getSupabase } from '../database/database.js';

function formatFlight(f) {
  if (!f) return null;
  return {
    ...f,
    airline_name: f.airlines ? f.airlines.name : '',
    airline_code: f.airlines ? f.airlines.code : '',
    airline_logo: f.airlines ? f.airlines.logo : '',
    origin_code: f.origin ? f.origin.code : '',
    origin_name: f.origin ? f.origin.name : '',
    origin_city: f.origin ? f.origin.city : '',
    destination_code: f.destination ? f.destination.code : '',
    destination_name: f.destination ? f.destination.name : '',
    destination_city: f.destination ? f.destination.city : ''
  };
}

export const FlightRepository = {
  async findById(id) {
    if (!id) return null;
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('flights')
      .select('*, airlines!airline_id(name, code, logo), origin:airports!origin_airport_id(code, name, city), destination:airports!destination_airport_id(code, name, city)')
      .eq('id', id)
      .maybeSingle();

    if (error) console.error('FlightRepository.findById error:', error);
    return formatFlight(data);
  },

  async searchAndFilter(filters = {}) {
    const supabase = getSupabase();
    let query = supabase
      .from('flights')
      .select('*, airlines!airline_id(name, code, logo), origin:airports!origin_airport_id(code, name, city), destination:airports!destination_airport_id(code, name, city)')
      .eq('status', 'available');

    if (filters.departureDate) {
      query = query.eq('departure_date', filters.departureDate);
    }

    if (filters.tripType) {
      query = query.eq('trip_type', filters.tripType);
    }

    if (filters.stops !== undefined && filters.stops !== null && filters.stops !== '') {
      query = query.eq('stops', parseInt(filters.stops));
    }

    if (filters.airlineIds && filters.airlineIds.length > 0) {
      query = query.in('airline_id', filters.airlineIds);
    }

    if (filters.timeRange) {
      if (filters.timeRange === '0-6') {
        query = query.gte('departure_time', '00:00').lt('departure_time', '06:00');
      } else if (filters.timeRange === '6-12') {
        query = query.gte('departure_time', '06:00').lt('departure_time', '12:00');
      } else if (filters.timeRange === '12-18') {
        query = query.gte('departure_time', '12:00').lt('departure_time', '18:00');
      } else if (filters.timeRange === '18-24') {
        query = query.gte('departure_time', '18:00').lte('departure_time', '23:59');
      }
    }

    if (filters.sortBy === 'price-desc') {
      query = query.order('economy_price', { ascending: false });
    } else {
      query = query.order('economy_price', { ascending: true });
    }

    const { data, error } = await query;
    if (error) {
      console.error('FlightRepository.searchAndFilter error:', error);
      return [];
    }

    let results = (data || []).map(formatFlight);

    // Client-side filter for origin & destination code/city match
    if (filters.origin) {
      const origMatch = filters.origin.toUpperCase();
      results = results.filter(f => 
        (f.origin_code && f.origin_code.toUpperCase() === origMatch) || 
        (f.origin_city && f.origin_city.toUpperCase().includes(origMatch))
      );
    }

    if (filters.destination) {
      const destMatch = filters.destination.toUpperCase();
      results = results.filter(f => 
        (f.destination_code && f.destination_code.toUpperCase() === destMatch) || 
        (f.destination_city && f.destination_city.toUpperCase().includes(destMatch))
      );
    }

    return results;
  },

  async countAll() {
    const supabase = getSupabase();
    const { count, error } = await supabase
      .from('flights')
      .select('*', { count: 'exact', head: true });

    if (error) console.error('FlightRepository.countAll error:', error);
    return count || 0;
  },

  async getPaginated(limit = 20, offset = 0) {
    const supabase = getSupabase();
    const from = offset;
    const to = offset + limit - 1;

    const { data, error } = await supabase
      .from('flights')
      .select('*, airlines!airline_id(name, code, logo), origin:airports!origin_airport_id(code, name, city), destination:airports!destination_airport_id(code, name, city)')
      .order('id', { ascending: true })
      .range(from, to);

    if (error) console.error('FlightRepository.getPaginated error:', error);
    return (data || []).map(formatFlight);
  },

  async create(flightData) {
    const supabase = getSupabase();
    const { flight_number, airline_id, origin_airport_id, destination_airport_id, departure_date, departure_time, arrival_time, duration_minutes, trip_type, stops, aircraft, economy_price, business_price, services } = flightData;
    
    const { data, error } = await supabase
      .from('flights')
      .insert([{
        flight_number, airline_id, origin_airport_id, destination_airport_id,
        departure_date, departure_time, arrival_time, duration_minutes,
        trip_type, stops: stops || 0, aircraft: aircraft || 'Airbus A320',
        economy_price, business_price, services: services || null, status: 'available'
      }])
      .select()
      .single();

    if (error) {
      console.error('FlightRepository.create error:', error);
      throw error;
    }
    return data;
  }
};
