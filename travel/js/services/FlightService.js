import { FlightRepository } from '../repositories/FlightRepository.js';

export const FlightService = {
  async searchFlights(params = {}) {
    return await FlightRepository.searchAndFilter(params);
  },

  async getFlightById(id) {
    if (!id) return null;
    return await FlightRepository.findById(id);
  },

  async getPaginatedFlights(page = 1, pageSize = 20) {
    const offset = (page - 1) * pageSize;
    const items = await FlightRepository.getPaginated(pageSize, offset);
    const totalCount = await FlightRepository.countAll();
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
      items,
      page,
      pageSize,
      totalCount,
      totalPages
    };
  },

  async createFlight(flightData) {
    if (!flightData.flight_number || !flightData.airline_id || !flightData.economy_price) {
      throw new Error('Vui lòng nhập đầy đủ thông tin bắt buộc của chuyến bay.');
    }
    return await FlightRepository.create(flightData);
  }
};
