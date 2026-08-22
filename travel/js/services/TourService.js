import { TourRepository } from '../repositories/TourRepository.js';

export const TourService = {
  async getFeaturedTours() {
    return await TourRepository.getFeatured(8);
  },

  async searchTours(params = {}) {
    return await TourRepository.searchAndFilter(params);
  },

  async getTourById(id) {
    if (!id) return null;
    const tour = await TourRepository.findById(id);
    if (!tour) return null;
    tour.itinerary = await TourRepository.getItineraryByTourId(id);
    return tour;
  },

  async getPaginatedTours(page = 1, pageSize = 20) {
    const offset = (page - 1) * pageSize;
    const items = await TourRepository.getPaginated(pageSize, offset);
    const totalCount = await TourRepository.countAll();
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
      items,
      page,
      pageSize,
      totalCount,
      totalPages
    };
  },

  async createTour(tourData, itineraries = []) {
    if (!tourData.name || !tourData.operator || !tourData.price) {
      throw new Error('Vui lòng nhập đầy đủ các thông tin bắt buộc của tour.');
    }
    if (!tourData.code) {
      tourData.code = 'TOUR' + Math.floor(100 + Math.random() * 900);
    }
    return await TourRepository.create(tourData, itineraries);
  }
};
