// DashboardService — Aggregates analytics metrics and prepares datasets for Chart.js

import { VideoRepository } from '../repositories/video-repository.js';
import { FormatUtil } from '../utils/format.js';

export class DashboardService {
  static getSummary() {
    const summary = VideoRepository.getSummary();
    return {
      totalVideos: FormatUtil.formatViews(summary.totalVideos),
      totalViews: FormatUtil.formatViews(summary.totalViews),
      totalStorageFormatted: FormatUtil.formatBytes(summary.totalStorageBytes),
      rawStorageBytes: summary.totalStorageBytes
    };
  }

  static getTopVideosChartData(limit = 10) {
    const topVideos = VideoRepository.getTopByViews(limit);
    return {
      labels: topVideos.map(v => v.title.length > 25 ? v.title.substring(0, 25) + '...' : v.title),
      data: topVideos.map(v => v.views),
      fullTitles: topVideos.map(v => v.title)
    };
  }

  static getViewsOverTimeChartData(mode = 'day') {
    const rows = mode === 'month' ? VideoRepository.getViewsByMonth() : VideoRepository.getViewsByDay();
    return {
      labels: rows.map(r => mode === 'month' ? r.month : r.view_date),
      data: rows.map(r => r.views)
    };
  }
}
