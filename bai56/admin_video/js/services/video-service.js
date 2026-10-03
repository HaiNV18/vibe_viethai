// VideoService — Video business logic, validation, and repository calls

import { VideoRepository } from '../repositories/video-repository.js';
import { ValidationUtil } from '../utils/validation.js';

export class VideoService {
  static getVideos({ search = '', categoryId = '', status = '', page = 1, limit = 5 } = {}) {
    const offset = (page - 1) * limit;
    const items = VideoRepository.findAll({ search, categoryId, status, limit, offset });
    const totalItems = VideoRepository.countAll({ search, categoryId, status });
    const totalPages = Math.ceil(totalItems / limit) || 1;

    return {
      items,
      totalItems,
      totalPages,
      currentPage: page,
      limit
    };
  }

  static getVideoById(id) {
    if (!id) return null;
    return VideoRepository.findById(id);
  }

  static createVideo(data) {
    this.validateVideoInput(data);
    return VideoRepository.create({
      title: data.title.trim(),
      description: data.description ? data.description.trim() : '',
      thumbnailUrl: data.thumbnailUrl ? data.thumbnailUrl.trim() : '',
      videoUrl: data.videoUrl ? data.videoUrl.trim() : '',
      fileSizeBytes: parseInt(data.fileSizeBytes, 10) || 0,
      durationSeconds: parseInt(data.durationSeconds, 10) || 0,
      views: parseInt(data.views, 10) || 0,
      status: data.status || 'published',
      categoryId: data.categoryId ? parseInt(data.categoryId, 10) : null
    });
  }

  static updateVideo(id, data) {
    if (!id) throw new Error('Mã video không hợp lệ.');
    this.validateVideoInput(data);
    return VideoRepository.update(id, {
      title: data.title.trim(),
      description: data.description ? data.description.trim() : '',
      thumbnailUrl: data.thumbnailUrl ? data.thumbnailUrl.trim() : '',
      videoUrl: data.videoUrl ? data.videoUrl.trim() : '',
      fileSizeBytes: parseInt(data.fileSizeBytes, 10) || 0,
      durationSeconds: parseInt(data.durationSeconds, 10) || 0,
      views: parseInt(data.views, 10) || 0,
      status: data.status || 'published',
      categoryId: data.categoryId ? parseInt(data.categoryId, 10) : null
    });
  }

  static deleteVideo(id) {
    if (!id) throw new Error('Mã video không hợp lệ.');
    VideoRepository.delete(id);
    return true;
  }

  static validateVideoInput(data) {
    if (!ValidationUtil.isNotEmpty(data.title)) {
      throw new Error('Tiêu đề video không được để trống.');
    }
    if (data.thumbnailUrl && !ValidationUtil.isValidUrl(data.thumbnailUrl)) {
      throw new Error('Đường dẫn ảnh Thumbnail không hợp lệ.');
    }
    if (data.videoUrl && !ValidationUtil.isValidUrl(data.videoUrl)) {
      throw new Error('Đường dẫn Video không hợp lệ.');
    }
  }
}
