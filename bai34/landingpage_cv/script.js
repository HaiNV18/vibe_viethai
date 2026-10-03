document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. TYPEWRITER EFFECT
  // ==========================================
  const typewriterElement = document.getElementById('typewriter');
  const roles = [
    'Senior Java Developer',
    'Senior PHP Developer',
    'Golang & Microservices Architect',
    'Fullstack Engineer (ReactJS / Java / PHP)'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
  }

  if (typewriterElement) {
    type();
  }

  // ==========================================
  // 2. COPY TO CLIPBOARD & TOAST NOTIFICATION
  // ==========================================
  const copyableItems = document.querySelectorAll('.copyable');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');

  function showToast(message) {
    if (!toast) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  copyableItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // Don't trigger copy if clicking on actual mailto or tel links directly
      if (e.target.tagName === 'A') return;
      
      const textToCopy = item.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Đã sao chép: "${textToCopy}"`);
        }).catch(err => {
          console.error('Lỗi khi sao chép:', err);
        });
      }
    });
  });

  // ==========================================
  // 3. EXPERIENCE FILTER TABS
  // ==========================================
  const filterTabs = document.querySelectorAll('#expFilterTabs .filter-tab');
  const timelineItems = document.querySelectorAll('#experienceTimeline .timeline-item');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterVal = tab.getAttribute('data-filter');

      timelineItems.forEach(item => {
        const itemCompany = item.getAttribute('data-company');
        if (filterVal === 'all' || itemCompany === filterVal) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // ==========================================
  // 4. GLOBAL REAL-TIME SEARCH
  // ==========================================
  const globalSearchInput = document.getElementById('globalSearch');
  const clearSearchBtn = document.getElementById('clearSearchBtn');

  if (globalSearchInput) {
    globalSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      if (query.length > 0) {
        clearSearchBtn.hidden = false;
      } else {
        clearSearchBtn.hidden = true;
      }

      // Filter timeline cards
      timelineItems.forEach(item => {
        const keywords = (item.getAttribute('data-keywords') || '') + ' ' + item.textContent;
        if (keywords.toLowerCase().includes(query)) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });

      // Filter skill cards & pills
      const skillCards = document.querySelectorAll('.skill-category-card');
      skillCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (query === '' || text.includes(query)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        globalSearchInput.value = '';
        clearSearchBtn.hidden = true;
        globalSearchInput.dispatchEvent(new Event('input'));
      });
    }
  }

  // ==========================================
  // 5. THEME SWITCHER (DARK / LIGHT MODE)
  // ==========================================
  const themeToggleBtn = document.getElementById('themeToggle');
  const htmlDoc = document.documentElement;

  // Check saved theme
  const savedTheme = localStorage.getItem('cv_theme') || 'dark';
  htmlDoc.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlDoc.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlDoc.setAttribute('data-theme', newTheme);
      localStorage.setItem('cv_theme', newTheme);
    });
  }

  // ==========================================
  // 6. MOBILE NAVIGATION MENU TOGGLE
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });

    // Close mobile menu on nav link click
    document.querySelectorAll('.nav-item').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show');
      });
    });
  }

  // ==========================================
  // 7. ACTIVE NAVIGATION ON SCROLL
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${currentSectionId}`) {
        item.classList.add('active');
      }
    });
  });
});
