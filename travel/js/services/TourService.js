import { TourRepository } from '../repositories/TourRepository.js';

export const TourService = {
  getFeaturedTours() {
    return TourRepository.getFeatured(8);
  },

  searchTours(params = {}) {
    return TourRepository.searchAndFilter(params);
  },

  getTourById(id) {
    if (!id) return null;
    const tour = TourRepository.findById(id);
    if (!tour) return null;
    tour.itinerary = TourRepository.getItineraryByTourId(id);
    return tour;
  },

  getPaginatedTours(page = 1, pageSize = 20) {
    const offset = (page - 1) * pageSize;
    const items = TourRepository.getPaginated(pageSize, offset);
    const totalCount = TourRepository.countAll();
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
      items,
      page,
      pageSize,
      totalCount,
      totalPages
    };
  },

  createTour(tourData, itineraries = []) {
    if (!tourData.name || !tourData.operator || !tourData.price) {
      throw new Error('Vui lòng nhập đầy đủ các thông tin bắt buộc của tour.');
    }
    if (!tourData.code) {
      tourData.code = 'TOUR' + Math.floor(100 + Math.random() * 900);
    }
    return TourRepository.create(tourData, itineraries);
  }
};
