import { FlightRepository } from '../repositories/FlightRepository.js';

export const FlightService = {
  searchFlights(params = {}) {
    return FlightRepository.searchAndFilter(params);
  },

  getFlightById(id) {
    if (!id) return null;
    return FlightRepository.findById(id);
  },

  getPaginatedFlights(page = 1, pageSize = 20) {
    const offset = (page - 1) * pageSize;
    const items = FlightRepository.getPaginated(pageSize, offset);
    const totalCount = FlightRepository.countAll();
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
      items,
      page,
      pageSize,
      totalCount,
      totalPages
    };
  },

  createFlight(flightData) {
    if (!flightData.flight_number || !flightData.airline_id || !flightData.economy_price) {
      throw new Error('Vui lòng nhập đầy đủ thông tin bắt buộc của chuyến bay.');
    }
    return FlightRepository.create(flightData);
  }
};
