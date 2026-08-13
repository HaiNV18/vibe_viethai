/**
 * Main Application Logic
 * Dynamic Menu loading from CSV, Navigation, Responsive Drawer & Event Bindings
 */
document.addEventListener('DOMContentLoaded', function () {
  // Initialize Contact Modal
  if (window.ContactManager) {
    window.ContactManager.init();
  }

  // Load dynamic menu from data/menu.csv
  loadDynamicMenu();

  // Setup Mobile Drawer Navigation
  setupMobileDrawer();

  // Setup CTA Button Click Listeners
  setupCtaButtons();

  // Setup Smooth Scrolling for hash links
  setupSmoothScroll();
});

/**
 * Fetch data/menu.csv, parse, filter, sort, and render desktop & mobile menus
 */
async function loadDynamicMenu() {
  const desktopNav = document.getElementById('desktop-menu');
  const mobileNav = document.getElementById('mobile-menu');

  if (!desktopNav && !mobileNav) return;

  try {
    const response = await fetch('./data/menu.csv');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const csvText = await response.text();
    const rawItems = window.CSVUtils.parseCsv(csvText, true);

    // Process & Filter items
    const menuItems = rawItems
      .filter(item => {
        const vis = (item.visible || '').toLowerCase().trim();
        return vis === 'true' || vis === '1';
      })
      .map(item => ({
        label: (item.label || '').trim(),
        url: sanitizeUrl((item.url || '').trim()),
        target: (item.target || '_self').trim(),
        order: parseInt(item.order || '99', 10)
      }))
      .sort((a, b) => a.order - b.order);

    if (menuItems.length > 0) {
      renderMenu(desktopNav, menuItems, 'nav-link');
      renderMenu(mobileNav, menuItems, 'mobile-nav-link');
    } else {
      renderFallbackMenu(desktopNav, mobileNav);
    }
  } catch (err) {
    console.warn('Cannot fetch data/menu.csv, using fallback menu:', err.message);
    renderFallbackMenu(desktopNav, mobileNav);
  }
}

/**
 * Validate & sanitize URL from CSV to prevent malicious protocol injection
 */
function sanitizeUrl(url) {
  if (!url) return '#';
  // Allow anchors, relative html links, or http/https
  if (url.startsWith('#') || url.endsWith('.html') || url.startsWith('/') || url.startsWith('./') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return '#';
}

/**
 * Render Menu items safely using DOM methods (no unsafe innerHTML)
 */
function renderMenu(containerEl, items, linkClass) {
  if (!containerEl) return;
  containerEl.innerHTML = ''; // Clear skeleton or fallback

  const ul = document.createElement('ul');
  ul.className = containerEl.id === 'desktop-menu' ? 'nav-list' : 'mobile-nav-list';

  items.forEach(item => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = item.url;
    a.textContent = item.label;
    a.className = linkClass;
    if (item.target) a.target = item.target;

    // Check active page
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    if (item.url === currentPath || (currentPath === '' && item.url === 'index.html')) {
      a.classList.add('active');
    }

    li.appendChild(a);
    ul.appendChild(li);
  });

  containerEl.appendChild(ul);
}

/**
 * Render Fallback Menu if CSV fails to load
 */
function renderFallbackMenu(desktopNav, mobileNav) {
  const defaultItems = [
    { label: 'Trang chủ', url: 'index.html', target: '_self', order: 1 },
    { label: 'Giới thiệu', url: 'about.html', target: '_self', order: 2 },
    { label: 'Khóa học', url: '#courses', target: '_self', order: 3 },
    { label: 'Lợi ích', url: '#benefits', target: '_self', order: 4 },
    { label: 'Liên hệ', url: '#contact', target: '_self', order: 5 }
  ];

  renderMenu(desktopNav, defaultItems, 'nav-link');
  renderMenu(mobileNav, defaultItems, 'mobile-nav-link');
}

/**
 * Mobile Drawer Menu Setup
 */
function setupMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('drawer-overlay');

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('is-open');
    if (overlay) overlay.classList.add('is-active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', function () {
    const isOpen = drawer.classList.contains('is-open');
    if (isOpen) closeDrawer();
    else openDrawer();
  });

  if (overlay) {
    overlay.addEventListener('click', closeDrawer);
  }

  // Close drawer on clicking menu link
  drawer.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      closeDrawer();
    }
  });
}

/**
 * Bind CTA buttons across the page to open Contact Modal
 */
function setupCtaButtons() {
  document.body.addEventListener('click', function (e) {
    const trigger = e.target.closest('[data-open-modal]');
    if (trigger) {
      e.preventDefault();
      const courseName = trigger.getAttribute('data-course') || '';
      if (window.ContactManager) {
        window.ContactManager.openModal(courseName);
      }
    }
  });
}

/**
 * Smooth Scroll handling for local hash anchors (#courses, #benefits, etc.)
 */
function setupSmoothScroll() {
  document.body.addEventListener('click', function (e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const hash = link.getAttribute('href');
    if (hash === '#' || hash === '#contact') return; // '#contact' opens modal via data-open-modal

    const targetEl = document.querySelector(hash);
    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
}
