// JavaScript logic for Landing Page TTTH - ĐH Khoa học Tự nhiên

document.addEventListener('DOMContentLoaded', function () {
  // 1. Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Close mobile navbar if open
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
          navbarToggler.click();
        }
      }
    });
  });

  // 2. Select course & scroll to form when clicking "Đăng Ký Ngay"
  const registerButtons = document.querySelectorAll('.btn-register-course');
  const courseSelect = document.getElementById('courseSelect');
  const regFormSection = document.getElementById('dang-ky');

  registerButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const courseValue = this.getAttribute('data-course');
      
      if (courseSelect && courseValue) {
        courseSelect.value = courseValue;
        
        // Highlight form control temporarily
        courseSelect.classList.add('is-valid');
        setTimeout(() => {
          courseSelect.classList.remove('is-valid');
        }, 2000);
      }

      if (regFormSection) {
        const headerOffset = 80;
        const elementPosition = regFormSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 3. Form Validation & Submission Handling
  const registrationForm = document.getElementById('registrationForm');
  const successModal = new bootstrap.Modal(document.getElementById('successModal'));

  if (registrationForm) {
    registrationForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!registrationForm.checkValidity()) {
        e.stopPropagation();
        registrationForm.classList.add('was-validated');
        return;
      }

      // Extract form values
      const fullName = document.getElementById('fullName').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const email = document.getElementById('email').value.trim();
      const selectedCourseText = courseSelect.options[courseSelect.selectedIndex].text;
      const locationSelect = document.getElementById('locationSelect');
      const selectedLocationText = locationSelect.options[locationSelect.selectedIndex].text;

      // Populate success modal content
      document.getElementById('modalStudentName').textContent = fullName;
      document.getElementById('modalStudentPhone').textContent = phone;
      document.getElementById('modalCourseName').textContent = selectedCourseText;
      document.getElementById('modalLocation').textContent = selectedLocationText;

      // Show success modal
      successModal.show();

      // Reset form state
      registrationForm.reset();
      registrationForm.classList.remove('was-validated');
    });
  }

  // 4. Update Active Nav Link on Scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const navItem = document.querySelector(`.navbar-nav a[href*=${sectionId}]`);

      if (navItem) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navItem.classList.add('active');
        } else {
          navItem.classList.remove('active');
        }
      }
    });
  });
});
