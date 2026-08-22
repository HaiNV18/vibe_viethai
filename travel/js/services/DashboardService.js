import { BookingRepository } from '../repositories/BookingRepository.js';

export const DashboardService = {
  getDashboardData() {
    const monthlyTourCount = BookingRepository.getMonthlyTourCount();
    const flightCount = BookingRepository.getFlightCount();
    const tourCustomerCount = BookingRepository.getTourCustomerCount();
    const flightCustomerCount = BookingRepository.getFlightCustomerCount();

    const topAirlines = BookingRepository.getTopAirlines(10);
    const topCountries = BookingRepository.getTopTourCountries(10);

    return {
      kpis: {
        monthlyTourCount,
        flightCount,
        tourCustomerCount,
        flightCustomerCount
      },
      topAirlines,
      topCountries
    };
  }
};
