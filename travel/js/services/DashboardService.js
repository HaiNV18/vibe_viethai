import { BookingRepository } from '../repositories/BookingRepository.js';

export const DashboardService = {
  async getDashboardData() {
    const monthlyTourCount = await BookingRepository.getMonthlyTourCount();
    const flightCount = await BookingRepository.getFlightCount();
    const tourCustomerCount = await BookingRepository.getTourCustomerCount();
    const flightCustomerCount = await BookingRepository.getFlightCustomerCount();

    const topAirlines = await BookingRepository.getTopAirlines(10);
    const topCountries = await BookingRepository.getTopTourCountries(10);

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
