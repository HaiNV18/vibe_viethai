import { getSupabase } from '../database/database.js';

export const BookingRepository = {
  async createBooking(booking, flights = [], tours = []) {
    const supabase = getSupabase();
    const { booking_code, user_id, customer_name, customer_email, customer_phone, country, address, total_amount } = booking;

    const { data: bData, error: bErr } = await supabase
      .from('bookings')
      .insert([{
        booking_code, user_id: user_id || null, customer_name, customer_email,
        customer_phone, country, address, total_amount, status: 'completed'
      }])
      .select()
      .single();

    if (bErr) {
      console.error('BookingRepository.createBooking error:', bErr);
      throw bErr;
    }

    const bookingId = bData.id;

    if (flights && flights.length > 0) {
      const bFlights = flights.map(f => ({
        booking_id: bookingId,
        flight_id: f.flight_id,
        fare_class: f.fare_class,
        quantity: f.quantity || 1,
        price: f.price
      }));
      await supabase.from('booking_flights').insert(bFlights);
    }

    if (tours && tours.length > 0) {
      const bTours = tours.map(t => ({
        booking_id: bookingId,
        tour_id: t.tour_id,
        quantity: t.quantity || 1,
        price: t.price
      }));
      await supabase.from('booking_tours').insert(bTours);
    }

    return { success: true, bookingId, bookingCode: booking_code };
  },

  async getMonthlyTourCount() {
    const supabase = getSupabase();
    const { count, error } = await supabase
      .from('booking_tours')
      .select('*', { count: 'exact', head: true });

    if (error) console.error('BookingRepository.getMonthlyTourCount error:', error);
    return count || 0;
  },

  async getFlightCount() {
    const supabase = getSupabase();
    const { count, error } = await supabase
      .from('flights')
      .select('*', { count: 'exact', head: true });

    if (error) console.error('BookingRepository.getFlightCount error:', error);
    return count || 0;
  },

  async getTourCustomerCount() {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('booking_tours')
      .select('booking_id');

    if (error) console.error('BookingRepository.getTourCustomerCount error:', error);
    const uniqueBookings = new Set((data || []).map(item => item.booking_id));
    return uniqueBookings.size;
  },

  async getFlightCustomerCount() {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('booking_flights')
      .select('booking_id');

    if (error) console.error('BookingRepository.getFlightCustomerCount error:', error);
    const uniqueBookings = new Set((data || []).map(item => item.booking_id));
    return uniqueBookings.size;
  },

  async getTopAirlines(limit = 10) {
    const supabase = getSupabase();
    // Query booking_flights joined with flights and airlines
    const { data, error } = await supabase
      .from('booking_flights')
      .select('flight_id, flights(airline_id, airlines(name))');

    if (error) console.error('BookingRepository.getTopAirlines error:', error);

    const counts = {};
    (data || []).forEach(bf => {
      const name = bf.flights?.airlines?.name || 'Unassigned';
      counts[name] = (counts[name] || 0) + 1;
    });

    const result = Object.keys(counts)
      .map(name => ({ airline_name: name, booking_count: counts[name] }))
      .sort((a, b) => b.booking_count - a.booking_count)
      .slice(0, limit);

    return result;
  },

  async getTopTourCountries(limit = 10) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('booking_tours')
      .select('tour_id, booking_id, bookings(country)');

    if (error) console.error('BookingRepository.getTopTourCountries error:', error);

    const stats = {};
    (data || []).forEach(bt => {
      const country = bt.bookings?.country;
      if (!country) return;

      if (!stats[country]) {
        stats[country] = { tours: new Set(), customers: new Set(), total_bookings: 0 };
      }
      stats[country].tours.add(bt.tour_id);
      stats[country].customers.add(bt.booking_id);
      stats[country].total_bookings += 1;
    });

    const result = Object.keys(stats)
      .map(country => ({
        country,
        tour_count: stats[country].tours.size,
        customer_count: stats[country].customers.size,
        total_bookings: stats[country].total_bookings
      }))
      .sort((a, b) => b.total_bookings - a.total_bookings)
      .slice(0, limit);

    return result;
  }
};
