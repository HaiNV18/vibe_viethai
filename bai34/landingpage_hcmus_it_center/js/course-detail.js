/**
 * Course Detail Page Renderer
 * Fetches data/courses.csv, parses with CSVUtils, renders full course syllabus and details
 */
document.addEventListener('DOMContentLoaded', function () {
  loadCourseDetail();
});

async function loadCourseDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = (urlParams.get('id') || '').trim();

  const container = document.getElementById('course-detail-container');
  const errorContainer = document.getElementById('course-error-container');

  try {
    const response = await fetch('./data/courses.csv');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();
    const courses = window.CSVUtils.parseCsv(csvText, true);

    if (!courses || courses.length === 0) {
      showCourseError('Dữ liệu khóa học không khả dụng.');
      return;
    }

    // Find requested course or default to first if missing
    let currentCourse = courses.find(c => (c.id || '').trim().toLowerCase() === courseId.toLowerCase());

    if (!currentCourse) {
      showCourseError(`Không tìm thấy thông tin cho khóa học với mã "${courseId}".`);
      renderRelatedCourses(courses, '');
      return;
    }

    // Hide error, show container
    if (errorContainer) errorContainer.style.display = 'none';
    if (container) container.style.display = 'block';

    // Render course data
    renderCourseInfo(currentCourse);

    // Render related courses
    renderRelatedCourses(courses, currentCourse.id);

  } catch (err) {
    console.error('Error loading course details:', err);
    showCourseError('Không thể tải thông tin khóa học. Vui lòng thử lại sau.');
  }
}

function formatVnd(amount) {
  const num = parseInt(amount, 10);
  if (isNaN(num)) return amount + ' VNĐ';
  return new Intl.NumberFormat('vi-VN').format(num) + ' VNĐ';
}

function renderCourseInfo(course) {
  // Title & Document head title
  document.title = `${course.title} — TechEdu Center`;

  setElementText('course-title', course.title);
  setElementText('breadcrumb-course-title', course.title);
  setElementText('course-category', course.category || 'Khóa Học');
  setElementText('course-badge', course.badge || 'Nổi bật');
  setElementText('course-short-desc', course.short_desc);
  setElementText('course-overview', course.overview);

  // Meta & Price
  const formattedPrice = formatVnd(course.price_vnd);
  setElementText('course-price-main', formattedPrice);
  setElementText('course-price-sidebar', formattedPrice);
  
  const durationText = `${course.duration_hours || '24'} giờ (${course.total_sessions || '8'} buổi)`;
  setElementText('course-duration', durationText);
  setElementText('course-duration-sidebar', durationText);
  setElementText('course-sessions', `${course.total_sessions || '8'} buổi học`);

  // Target audience & Prerequisites
  setElementText('course-target', course.target_audience);
  setElementText('course-prerequisites', course.prerequisites);

  // Outcomes list
  const outcomesContainer = document.getElementById('course-outcomes');
  if (outcomesContainer && course.outcomes) {
    outcomesContainer.innerHTML = '';
    const items = course.outcomes.split(';');
    items.forEach(item => {
      if (item.trim()) {
        const li = document.createElement('li');
        li.className = 'outcome-item';
        
        const icon = document.createElement('span');
        icon.className = 'outcome-icon';
        icon.textContent = '✓';
        
        const text = document.createElement('span');
        text.textContent = item.trim();

        li.appendChild(icon);
        li.appendChild(text);
        outcomesContainer.appendChild(li);
      }
    });
  }

  // Syllabus timeline
  const syllabusContainer = document.getElementById('course-syllabus');
  if (syllabusContainer && course.syllabus) {
    syllabusContainer.innerHTML = '';
    const sessions = course.syllabus.split('|');
    sessions.forEach((sessionStr, idx) => {
      if (sessionStr.trim()) {
        const card = document.createElement('div');
        card.className = 'syllabus-card';

        const numberTag = document.createElement('div');
        numberTag.className = 'syllabus-session-tag';
        numberTag.textContent = `Bài ${idx + 1}`;

        const content = document.createElement('div');
        content.className = 'syllabus-content';
        content.textContent = sessionStr.trim();

        card.appendChild(numberTag);
        card.appendChild(content);
        syllabusContainer.appendChild(card);
      }
    });
  }

  // Bind CTA buttons to open modal with course title
  const ctaBtns = document.querySelectorAll('[data-course-cta]');
  ctaBtns.forEach(btn => {
    btn.setAttribute('data-course', course.title);
  });
}

function setElementText(id, text) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = text || '';
  }
}

function showCourseError(message) {
  const container = document.getElementById('course-detail-container');
  const errorContainer = document.getElementById('course-error-container');
  const errorMsg = document.getElementById('course-error-message');

  if (container) container.style.display = 'none';
  if (errorContainer) {
    errorContainer.style.display = 'block';
    if (errorMsg) errorMsg.textContent = message;
  }
}

function renderRelatedCourses(courses, currentId) {
  const container = document.getElementById('related-courses-grid');
  if (!container) return;
  container.innerHTML = '';

  const related = courses.filter(c => c.id !== currentId).slice(0, 3);
  related.forEach(course => {
    const card = document.createElement('article');
    card.className = 'course-card';

    const tag = document.createElement('span');
    tag.className = 'course-tag';
    tag.textContent = course.category || 'Khóa học';

    const title = document.createElement('h3');
    title.className = 'course-title';
    title.textContent = course.title;

    const desc = document.createElement('p');
    desc.className = 'course-desc';
    desc.textContent = course.short_desc;

    const meta = document.createElement('div');
    meta.className = 'course-meta';
    
    const timeSpan = document.createElement('span');
    timeSpan.textContent = `⏱ ${course.duration_hours} giờ (${course.total_sessions} buổi)`;
    
    const priceSpan = document.createElement('span');
    priceSpan.style.fontWeight = '700';
    priceSpan.style.color = 'var(--color-brand)';
    priceSpan.textContent = formatVnd(course.price_vnd);

    meta.appendChild(timeSpan);
    meta.appendChild(priceSpan);

    const btnGroup = document.createElement('div');
    btnGroup.style.display = 'flex';
    btnGroup.style.gap = '0.5rem';

    const detailBtn = document.createElement('a');
    detailBtn.href = `course-detail.html?id=${course.id}`;
    detailBtn.className = 'btn btn-primary btn-sm';
    detailBtn.style.flex = '1';
    detailBtn.textContent = 'Xem chi tiết';

    const ctaBtn = document.createElement('button');
    ctaBtn.type = 'button';
    ctaBtn.className = 'btn btn-outline btn-sm';
    ctaBtn.setAttribute('data-open-modal', '');
    ctaBtn.setAttribute('data-course', course.title);
    ctaBtn.textContent = 'Đăng ký';

    btnGroup.appendChild(detailBtn);
    btnGroup.appendChild(ctaBtn);

    card.appendChild(tag);
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(meta);
    card.appendChild(btnGroup);

    container.appendChild(card);
  });
}
