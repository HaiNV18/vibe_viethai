// Video Edit Page Controller

import { App } from '../app.js';
import { VideoService } from '../services/video-service.js';
import { CategoryService } from '../services/category-service.js';
import { FormatUtil } from '../utils/format.js';
import { ToastUtil } from '../utils/toast.js';

let currentVideoId = null;

document.addEventListener('DOMContentLoaded', async () => {
  await App.init({ requireAuth: true });

  loadCategories();
  checkQueryParams();
  setupThumbnailPreview();
  setupFormSubmit();
});

function loadCategories() {
  const select = document.getElementById('category_id');
  if (!select) return;

  const categories = CategoryService.getCategories();
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = FormatUtil.escapeHtml(cat.name);
    select.appendChild(opt);
  });
}

function checkQueryParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get('id');

  const headingTitle = document.getElementById('form-heading-title');

  if (idParam && idParam !== 'new') {
    currentVideoId = parseInt(idParam, 10);
    if (headingTitle) headingTitle.textContent = `Chỉnh sửa Video #${currentVideoId}`;
    loadVideoDetails(currentVideoId);
  } else {
    currentVideoId = null;
    if (headingTitle) headingTitle.textContent = 'Thêm Video mới';
  }
}

function loadVideoDetails(id) {
  const video = VideoService.getVideoById(id);
  if (!video) {
    ToastUtil.error('Không tìm thấy video cần chỉnh sửa.');
    setTimeout(() => window.location.href = 'videos.html', 1500);
    return;
  }

  document.getElementById('title').value = video.title || '';
  document.getElementById('description').value = video.description || '';
  document.getElementById('category_id').value = video.category_id || '';
  document.getElementById('status').value = video.status || 'published';
  document.getElementById('views').value = video.views || 0;
  document.getElementById('duration_seconds').value = video.duration_seconds || 0;
  document.getElementById('file_size_bytes').value = video.file_size_bytes || 0;
  document.getElementById('thumbnail_url').value = video.thumbnail_url || '';
  document.getElementById('video_url').value = video.video_url || '';

  updateThumbnailPreview(video.thumbnail_url);
}

function setupThumbnailPreview() {
  const input = document.getElementById('thumbnail_url');
  if (!input) return;

  input.addEventListener('input', () => {
    updateThumbnailPreview(input.value.trim());
  });
}

function updateThumbnailPreview(url) {
  const img = document.getElementById('thumbnail-preview-img');
  const placeholder = document.getElementById('thumbnail-preview-placeholder');

  if (url) {
    img.src = url;
    img.style.display = 'block';
    if (placeholder) placeholder.style.display = 'none';

    img.onerror = () => {
      img.style.display = 'none';
      if (placeholder) {
        placeholder.style.display = 'block';
        placeholder.textContent = '❌ Không thể tải ảnh từ URL này';
      }
    };
  } else {
    img.style.display = 'none';
    if (placeholder) {
      placeholder.style.display = 'block';
      placeholder.textContent = 'Xem trước ảnh Thumbnail';
    }
  }
}

function setupFormSubmit() {
  const form = document.getElementById('video-form');
  const saveBtn = document.getElementById('save-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
      title: document.getElementById('title').value,
      description: document.getElementById('description').value,
      categoryId: document.getElementById('category_id').value,
      status: document.getElementById('status').value,
      views: document.getElementById('views').value,
      durationSeconds: document.getElementById('duration_seconds').value,
      fileSizeBytes: document.getElementById('file_size_bytes').value,
      thumbnailUrl: document.getElementById('thumbnail_url').value,
      videoUrl: document.getElementById('video_url').value
    };

    saveBtn.disabled = true;
    saveBtn.innerHTML = `<span>Đang lưu...</span>`;

    try {
      if (currentVideoId) {
        VideoService.updateVideo(currentVideoId, data);
        ToastUtil.success('Đã cập nhật video thành công!');
      } else {
        VideoService.createVideo(data);
        ToastUtil.success('Đã tạo video mới thành công!');
      }

      setTimeout(() => {
        window.location.href = 'videos.html';
      }, 1000);
    } catch (err) {
      ToastUtil.error(err.message || 'Lưu thất bại.');
      saveBtn.disabled = false;
      saveBtn.innerHTML = `<span>Lưu Video</span>`;
    }
  });
}
