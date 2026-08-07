/**
 * THE BREW LAB - Main JS Application
 * Includes: CSV Parser, Menu Management, Membership Flow, Table Booking, and Reviews
 */

document.addEventListener('DOMContentLoaded', () => {
    // App Data State
    let categories = [];
    let products = [];
    let filteredProducts = [];
    
    // Menu Pagination & Filter State
    let currentPage = 1;
    const itemsPerPage = 8;
    let selectedCategoryId = 'all';
    let searchQuery = '';
    let sortOrder = 'featured'; // default, price-asc, price-desc, name-asc
    
    // Active User State
    let currentUser = JSON.parse(localStorage.getItem('brew_lab_member')) || null;
    
    // Star Rating State
    let currentRating = 0;

    // DOM Elements Cache
    const header = document.querySelector('.main-header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const userStatusContainer = document.getElementById('user-status-container');
    
    // Featured Carousel
    const featuredCarousel = document.getElementById('featured-carousel');
    const btnFeaturedPrev = document.getElementById('btn-featured-prev');
    const btnFeaturedNext = document.getElementById('btn-featured-next');
    
    // Menu controls
    const searchInput = document.getElementById('search-input');
    const searchClearBtn = document.getElementById('search-clear-btn');
    const categoryTabsContainer = document.getElementById('category-tabs-container');
    const sortSelect = document.getElementById('sort-select');
    const productsGrid = document.getElementById('products-grid');
    const menuEmpty = document.getElementById('menu-empty');
    const pagination = document.getElementById('pagination');
    
    // Booking Form & Gate
    const bookingGate = document.getElementById('booking-gate');
    const bookingFormCard = document.getElementById('booking-form-card');
    const memberGreetingText = document.getElementById('member-greeting-text');
    const btnMemberLogout = document.getElementById('btn-member-logout');
    const tableBookingForm = document.getElementById('table-booking-form');
    const btnGateRegister = document.getElementById('btn-gate-register');
    const btnGateLogin = document.getElementById('btn-gate-login');
    
    // Modals
    const modalMembership = document.getElementById('modal-membership');
    const modalBookingSuccess = document.getElementById('modal-booking-success');
    const modalProductDetail = document.getElementById('modal-product-detail');
    const closeButtons = document.querySelectorAll('.modal-close');
    
    // Membership Forms & Panels
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const panelLogin = document.getElementById('panel-login');
    const panelRegister = document.getElementById('panel-register');
    const formMemberLogin = document.getElementById('form-member-login');
    const formMemberRegister = document.getElementById('form-member-register');
    const linkSwitchToRegister = document.getElementById('link-switch-to-register');
    const linkSwitchToLogin = document.getElementById('link-switch-to-login');
    
    // Feedback form
    const feedbackForm = document.getElementById('feedback-form');
    const feedbackStars = document.getElementById('feedback-stars');
    const ratingLabel = document.getElementById('rating-label');
    const fbRatingInput = document.getElementById('fb-rating');
    const fbRatingFeedback = document.getElementById('fb-rating-feedback');
    const feedbackToast = document.getElementById('feedback-toast');
    const btnToastClose = document.getElementById('btn-toast-close');

    // ==========================================
    // 1. DYNAMIC CSV PARSER & FETCHING
    // ==========================================
    
    /**
     * Parses standard CSV formatted text into rows, handling double quotes and line breaks
     */
    function parseCSV(text) {
        const lines = [];
        let row = [""];
        let inQuotes = false;
        
        for (let i = 0; i < text.length; i++) {
            let c = text[i];
            let next = text[i + 1];
            
            if (c === '"') {
                if (inQuotes && next === '"') {
                    row[row.length - 1] += '"';
                    i++; // skip next double quote
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (c === ',' && !inQuotes) {
                row.push('');
            } else if ((c === '\r' || c === '\n') && !inQuotes) {
                if (c === '\r' && next === '\n') {
                    i++;
                }
                lines.push(row);
                row = [''];
            } else {
                row[row.length - 1] += c;
            }
        }
        if (row.length > 1 || (row.length === 1 && row[0] !== '')) {
            lines.push(row);
        }
        return lines;
    }

    /**
     * Converts CSV matrix data to an array of objects mapping headers as keys
     */
    function csvToObjects(csvText) {
        const lines = parseCSV(csvText);
        if (lines.length === 0) return [];
        const headers = lines[0].map(h => h.trim());
        const result = [];
        
        for (let i = 1; i < lines.length; i++) {
            const row = lines[i];
            if (row.length < headers.length) continue; // Skip incomplete lines
            const obj = {};
            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = row[j].trim();
            }
            result.push(obj);
        }
        return result;
    }

    /**
     * Fetches categories and products CSV data concurrently
     */
    async function loadData() {
        try {
            const [categoriesRes, productsRes] = await Promise.all([
                fetch('data/category.csv'),
                fetch('data/product.csv')
            ]);
            
            if (!categoriesRes.ok || !productsRes.ok) {
                throw new Error("Unable to fetch data files. Please ensure you are running on a local web server (HTTP).");
            }
            
            const categoriesText = await categoriesRes.text();
            const productsText = await productsRes.text();
            
            categories = csvToObjects(categoriesText);
            products = csvToObjects(productsText);
            
            initMenuUI();
        } catch (error) {
            console.error("Error loading CSV files:", error);
            productsGrid.innerHTML = `
                <div class="menu-loading" style="color: var(--danger)">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <p>Lỗi tải dữ liệu thực đơn</p>
                    <p style="font-size: 0.85rem; font-weight: normal; margin-top: 5px;">
                        Vui lòng chạy website thông qua máy chủ cục bộ (Web Server / Live Server) để tránh lỗi CORS.
                    </p>
                </div>
            `;
        }
    }

    // ==========================================
    // 2. NAV & UI EVENTS
    // ==========================================

    // Scroll header background toggle
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        highlightActiveNavLink();
    });

    // Mobile navigation toggle
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const icon = mobileToggle.querySelector('i');
        if (navMenu.classList.contains('open')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars-staggered';
        }
    });

    // Close menu when clicking link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            mobileToggle.querySelector('i').className = 'fa-solid fa-bars-staggered';
        });
    });

    // Highlight navigation items corresponding to viewport scroll position
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function highlightActiveNavLink() {
        let scrollPosition = window.scrollY + 120;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}` || (sectionId === 'home' && link.getAttribute('href') === '#')) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Carousel Slider scroll handler
    btnFeaturedNext.addEventListener('click', () => {
        featuredCarousel.scrollBy({ left: 300, behavior: 'smooth' });
    });
    btnFeaturedPrev.addEventListener('click', () => {
        featuredCarousel.scrollBy({ left: -300, behavior: 'smooth' });
    });

    // ==========================================
    // 3. MENU RENDERING & FILTERING
    // ==========================================
    
    function initMenuUI() {
        // Render Category Filter Tabs
        categoryTabsContainer.innerHTML = `<button class="tab-btn active" data-category-id="all">Tất cả</button>`;
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'tab-btn';
            btn.setAttribute('data-category-id', cat.id);
            btn.textContent = cat.name;
            categoryTabsContainer.appendChild(btn);
        });
        
        // Setup Filter Click Handlers
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedCategoryId = btn.getAttribute('data-category-id');
                currentPage = 1;
                filterAndRenderMenu();
            });
        });
        
        // Initial filter & render
        filterAndRenderMenu();
    }

    // Normalize Vietnamese strings for accurate accents-free search match
    function normalizeStr(str) {
        if (!str) return '';
        return str.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d");
    }

    function filterAndRenderMenu() {
        filteredProducts = products.filter(p => {
            // Category Match
            const matchesCategory = selectedCategoryId === 'all' || p.category_id === selectedCategoryId;
            
            // Search Input Match
            const searchNormalized = normalizeStr(searchQuery);
            const matchesSearch = searchNormalized === '' || 
                normalizeStr(p.name).includes(searchNormalized) || 
                normalizeStr(p.description).includes(searchNormalized);
                
            return matchesCategory && matchesSearch;
        });
        
        // Apply Sort Order
        if (sortOrder === 'price-asc') {
            filteredProducts.sort((a, b) => Number(a.price) - Number(b.price));
        } else if (sortOrder === 'price-desc') {
            filteredProducts.sort((a, b) => Number(b.price) - Number(a.price));
        } else if (sortOrder === 'name-asc') {
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
        } else {
            // default/featured order (by ID)
            filteredProducts.sort((a, b) => Number(a.id) - Number(b.id));
        }
        
        renderProducts();
    }

    function renderProducts() {
        productsGrid.innerHTML = '';
        
        if (filteredProducts.length === 0) {
            menuEmpty.style.display = 'block';
            pagination.style.display = 'none';
            return;
        }
        
        menuEmpty.style.display = 'none';
        
        // Paginate items
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = filteredProducts.slice(startIndex, endIndex);
        
        pageItems.forEach(p => {
            const catObj = categories.find(c => c.id === p.category_id);
            const categoryName = catObj ? catObj.name : 'Đồ uống';
            const priceFormatted = Number(p.price).toLocaleString('vi-VN') + 'đ';
            
            // Strip HTML elements for card summary text
            const rawDescText = p.description.replace(/<[^>]*>/g, '').trim();
            const descSummary = rawDescText || 'Đang cập nhật mô tả hương vị tinh tế...';
            
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-img-box">
                    <img src="${p.image}" alt="${p.name}" onerror="this.src='images/products/BANHCHUOI.jpg'">
                </div>
                <div class="product-info-box">
                    <span class="product-cat">${categoryName}</span>
                    <h3 class="product-title">${p.name}</h3>
                    <p class="product-desc">${descSummary}</p>
                    <div class="product-card-footer">
                        <span class="product-price">${priceFormatted}</span>
                        <div class="product-btn-view">
                            <i class="fa-solid fa-expand"></i>
                        </div>
                    </div>
                </div>
            `;
            
            // Card details modal click event
            card.addEventListener('click', () => {
                openProductDetailModal(p, categoryName);
            });
            
            productsGrid.appendChild(card);
        });
        
        renderPagination();
    }

    function renderPagination() {
        pagination.innerHTML = '';
        const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
        
        if (totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }
        
        pagination.style.display = 'flex';
        
        // Prev button
        const prevBtn = document.createElement('button');
        prevBtn.className = `pg-btn ${currentPage === 1 ? 'disabled' : ''}`;
        prevBtn.innerHTML = `<i class="fa-solid fa-angle-left"></i>`;
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderProducts();
                scrollToMenuHeader();
            }
        });
        pagination.appendChild(prevBtn);
        
        // Page index buttons
        for (let i = 1; i <= totalPages; i++) {
            const pgBtn = document.createElement('button');
            pgBtn.className = `pg-btn ${currentPage === i ? 'active' : ''}`;
            pgBtn.textContent = i;
            pgBtn.addEventListener('click', () => {
                currentPage = i;
                renderProducts();
                scrollToMenuHeader();
            });
            pagination.appendChild(pgBtn);
        }
        
        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = `pg-btn ${currentPage === totalPages ? 'disabled' : ''}`;
        nextBtn.innerHTML = `<i class="fa-solid fa-angle-right"></i>`;
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderProducts();
                scrollToMenuHeader();
            }
        });
        pagination.appendChild(nextBtn);
    }
    
    function scrollToMenuHeader() {
        document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
    }

    // Search events listeners
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        searchClearBtn.style.display = searchQuery ? 'block' : 'none';
        currentPage = 1;
        filterAndRenderMenu();
    });
    
    searchClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        searchClearBtn.style.display = 'none';
        currentPage = 1;
        filterAndRenderMenu();
        searchInput.focus();
    });
    
    // Sort Select listener
    sortSelect.addEventListener('change', (e) => {
        sortOrder = e.target.value;
        currentPage = 1;
        filterAndRenderMenu();
    });

    // ==========================================
    // 4. MEMBERSHIP FLOW
    // ==========================================

    /**
     * Synchronizes and renders header membership state and booking panels based on login session
     */
    function updateMemberState() {
        if (currentUser) {
            // Header state
            userStatusContainer.innerHTML = `
                <div class="user-widget">
                    <i class="fa-solid fa-circle-user user-avatar"></i>
                    <span>Chào, <strong>${currentUser.name}</strong></span>
                    <span class="logout-link" id="btn-header-logout" title="Thoát tài khoản">
                        <i class="fa-solid fa-right-from-bracket"></i>
                    </span>
                </div>
            `;
            
            // Re-bind click event to header logout button
            document.getElementById('btn-header-logout').addEventListener('click', handleLogout);
            
            // Booking Gate & Form Panels Toggle
            bookingGate.style.display = 'none';
            bookingFormCard.style.display = 'block';
            memberGreetingText.innerHTML = `Chào mừng thành viên, <strong>${currentUser.name}</strong>!`;
        } else {
            // Header state logged out
            userStatusContainer.innerHTML = `
                <button class="btn btn-outline btn-sm" id="btn-login-trigger">
                    <i class="fa-solid fa-user-tag"></i> Thành viên
                </button>
            `;
            
            // Re-bind login triggers
            document.getElementById('btn-login-trigger').addEventListener('click', () => openMembershipModal('login'));
            
            // Booking Gate & Form Panels Toggle
            bookingGate.style.display = 'block';
            bookingFormCard.style.display = 'none';
        }
    }

    function handleLogout() {
        localStorage.removeItem('brew_lab_member');
        currentUser = null;
        updateMemberState();
        tableBookingForm.reset();
    }

    // Modal tabs toggle
    function switchMembershipTab(tabId) {
        if (tabId === 'login') {
            tabLogin.classList.add('active');
            tabRegister.classList.remove('active');
            panelLogin.classList.add('active');
            panelRegister.classList.remove('active');
        } else {
            tabRegister.classList.add('active');
            tabLogin.classList.remove('active');
            panelRegister.classList.add('active');
            panelLogin.classList.remove('active');
        }
    }
    
    tabLogin.addEventListener('click', () => switchMembershipTab('login'));
    tabRegister.addEventListener('click', () => switchMembershipTab('register'));
    linkSwitchToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        switchMembershipTab('register');
    });
    linkSwitchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        switchMembershipTab('login');
    });
    
    // Gate Card triggers
    btnGateRegister.addEventListener('click', () => openMembershipModal('register'));
    btnGateLogin.addEventListener('click', () => openMembershipModal('login'));
    btnMemberLogout.addEventListener('click', handleLogout);

    // FORM: Member Register Submit
    formMemberRegister.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        
        const nameInput = document.getElementById('reg-name');
        const phoneInput = document.getElementById('reg-phone');
        const emailInput = document.getElementById('reg-email');
        
        // Reset validation errors
        [nameInput, phoneInput, emailInput].forEach(inp => inp.classList.remove('is-invalid'));
        
        // Validate name
        if (!nameInput.value.trim()) {
            nameInput.classList.add('is-invalid');
            isValid = false;
        }
        
        // Validate phone: must be numeric digits, length 9-11
        const phoneVal = phoneInput.value.trim();
        const phoneRegex = /^[0-9]{9,11}$/;
        if (!phoneRegex.test(phoneVal)) {
            phoneInput.classList.add('is-invalid');
            isValid = false;
        }
        
        // Validate email
        const emailVal = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailVal)) {
            emailInput.classList.add('is-invalid');
            isValid = false;
        }
        
        if (isValid) {
            // Save local registration
            const newUser = {
                name: nameInput.value.trim(),
                phone: phoneVal,
                email: emailVal
            };
            
            localStorage.setItem('brew_lab_member', JSON.stringify(newUser));
            currentUser = newUser;
            updateMemberState();
            
            // Clear and close
            formMemberRegister.reset();
            closeAllModals();
            
            // Auto scroll to booking form
            document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
        }
    });

    // FORM: Member Login Submit (Mock based on stored values or dummy credentials)
    formMemberLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const phoneInput = document.getElementById('login-phone');
        phoneInput.classList.remove('is-invalid');
        
        const phoneVal = phoneInput.value.trim();
        if (!phoneVal || phoneVal.length < 9) {
            phoneInput.classList.add('is-invalid');
            return;
        }
        
        // Check if there is stored registration phone
        const storedUser = JSON.parse(localStorage.getItem('brew_lab_member'));
        if (storedUser && storedUser.phone === phoneVal) {
            currentUser = storedUser;
        } else {
            // Create mock account for demo purposes
            currentUser = {
                name: 'Nam Tran',
                phone: phoneVal,
                email: 'nam.tran@example.com'
            };
            localStorage.setItem('brew_lab_member', JSON.stringify(currentUser));
        }
        
        updateMemberState();
        formMemberLogin.reset();
        closeAllModals();
        
        document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    });

    // ==========================================
    // 5. BOOKING LOGIC
    // ==========================================
    
    // Auto-fill minimum booking date restriction to today
    const bookingDateInput = document.getElementById('booking-date');
    const todayStr = new Date().toISOString().split('T')[0];
    bookingDateInput.min = todayStr;

    tableBookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        
        const bDate = document.getElementById('booking-date');
        const bTime = document.getElementById('booking-time');
        const bGuests = document.getElementById('booking-guests');
        const bArea = document.getElementById('booking-area');
        const bNotes = document.getElementById('booking-notes');
        const bAgree = document.getElementById('booking-agree');
        
        // Reset classes
        [bDate, bTime, bGuests, bAgree].forEach(elem => elem.classList.remove('is-invalid'));
        bAgree.parentElement.classList.remove('text-danger');
        
        // Validate date
        if (!bDate.value) {
            bDate.classList.add('is-invalid');
            isValid = false;
        }
        
        // Validate time
        if (!bTime.value) {
            bTime.classList.add('is-invalid');
            isValid = false;
        }
        
        // Validate guests
        if (!bGuests.value) {
            bGuests.classList.add('is-invalid');
            isValid = false;
        }
        
        // Validate checkbox
        if (!bAgree.checked) {
            bAgree.classList.add('is-invalid');
            bAgree.parentElement.classList.add('text-danger');
            isValid = false;
        }
        
        if (isValid && currentUser) {
            // Create dynamic booking details
            const bookingCode = 'TBL-' + Math.floor(10000 + Math.random() * 90000);
            
            // Format Date for display
            const rawDate = new Date(bDate.value);
            const dateStr = `${String(rawDate.getDate()).padStart(2, '0')}/${String(rawDate.getMonth() + 1).padStart(2, '0')}/${rawDate.getFullYear()}`;
            
            // Fill details into ticket modal
            document.getElementById('lbl-booking-code').textContent = bookingCode;
            document.getElementById('lbl-booking-name').textContent = currentUser.name;
            document.getElementById('lbl-booking-datetime').textContent = `${bTime.value}, ngày ${dateStr}`;
            document.getElementById('lbl-booking-guests').textContent = bGuests.value;
            document.getElementById('lbl-booking-area').textContent = bArea.value;
            
            // Open Booking Success modal
            openModal(modalBookingSuccess);
            
            // Reset form
            tableBookingForm.reset();
        }
    });

    document.getElementById('btn-booking-success-ok').addEventListener('click', closeAllModals);

    // ==========================================
    // 6. FEEDBACK FORM RATING
    // ==========================================
    
    const starBtns = feedbackStars.querySelectorAll('.star-btn');
    const ratingLabels = {
        1: 'Tệ - Cần cải thiện rất nhiều',
        2: 'Chưa tốt - Cần cải thiện chất lượng',
        3: 'Bình thường - Chấp nhận được',
        4: 'Rất tốt - Rất hài lòng',
        5: 'Tuyệt vời - Rất mong trở lại!'
    };
    
    starBtns.forEach(btn => {
        // Hover handler
        btn.addEventListener('mouseenter', () => {
            const val = parseInt(btn.getAttribute('data-value'));
            highlightStars(val, 'hovered');
            ratingLabel.textContent = ratingLabels[val] || 'Chọn mức độ hài lòng';
        });
        
        // Click handler
        btn.addEventListener('click', () => {
            currentRating = parseInt(btn.getAttribute('data-value'));
            fbRatingInput.value = currentRating;
            highlightStars(currentRating, 'selected');
            ratingLabel.textContent = ratingLabels[currentRating];
            fbRatingFeedback.style.display = 'none';
        });
    });
    
    // Mouse leave event resets ratings to selected lock state
    feedbackStars.addEventListener('mouseleave', () => {
        highlightStars(currentRating, 'selected');
        if (currentRating > 0) {
            ratingLabel.textContent = ratingLabels[currentRating];
        } else {
            ratingLabel.textContent = 'Chọn mức độ hài lòng';
        }
    });
    
    function highlightStars(val, className) {
        starBtns.forEach(btn => {
            const btnVal = parseInt(btn.getAttribute('data-value'));
            const icon = btn.querySelector('i');
            
            // Reset icons
            btn.className = 'star-btn';
            icon.className = 'fa-regular fa-star';
            
            if (btnVal <= val) {
                btn.classList.add(className);
                icon.className = 'fa-solid fa-star';
            }
        });
    }
    
    // FORM: Feedback Submission Handler
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        
        const fbName = document.getElementById('fb-name');
        const fbEmail = document.getElementById('fb-email');
        const fbMessage = document.getElementById('fb-message');
        
        [fbName, fbEmail, fbMessage].forEach(elem => elem.classList.remove('is-invalid'));
        fbRatingFeedback.style.display = 'none';
        
        // Validate name
        if (!fbName.value.trim()) {
            fbName.classList.add('is-invalid');
            isValid = false;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(fbEmail.value.trim())) {
            fbEmail.classList.add('is-invalid');
            isValid = false;
        }
        
        // Validate star rating
        if (!fbRatingInput.value) {
            fbRatingFeedback.style.display = 'block';
            isValid = false;
        }
        
        // Validate message
        if (!fbMessage.value.trim()) {
            fbMessage.classList.add('is-invalid');
            isValid = false;
        }
        
        if (isValid) {
            // Trigger feedback toast notification
            feedbackToast.classList.add('show');
            
            // Auto dismiss toast after 4 seconds
            setTimeout(() => {
                feedbackToast.classList.remove('show');
            }, 4000);
            
            // Reset Form and Star rating states
            feedbackForm.reset();
            currentRating = 0;
            fbRatingInput.value = '';
            highlightStars(0, 'selected');
            ratingLabel.textContent = 'Chọn mức độ hài lòng';
        }
    });
    
    btnToastClose.addEventListener('click', () => {
        feedbackToast.classList.remove('show');
    });

    // ==========================================
    // 7. MODALS CONTROLS & EVENTS
    // ==========================================
    
    function openModal(modalElem) {
        // Close other open modals
        closeAllModals();
        modalElem.classList.add('open');
        document.body.style.overflow = 'hidden'; // Stop page scrolling
    }
    
    function closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('open');
        });
        document.body.style.overflow = '';
    }
    
    function openMembershipModal(activeTab = 'login') {
        switchMembershipTab(activeTab);
        openModal(modalMembership);
    }
    
    function openProductDetailModal(product, categoryName) {
        const modalContent = document.getElementById('product-detail-content');
        const priceFormatted = Number(product.price).toLocaleString('vi-VN') + 'đ';
        
        // Update product modal views
        modalContent.innerHTML = `
            <div class="product-detail-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='images/products/BANHCHUOI.jpg'">
            </div>
            <div class="product-detail-info">
                <span class="detail-category">${categoryName}</span>
                <h2 class="detail-title">${product.name}</h2>
                <div class="detail-price">${priceFormatted}</div>
                <div class="detail-description">
                    ${product.description}
                </div>
                <div class="detail-meta">
                    <div class="meta-item"><i class="fa-solid fa-mug-hot"></i> Đồ uống / Đồ ăn chuẩn vị</div>
                    <div class="meta-item"><i class="fa-solid fa-clock"></i> Phục vụ tại chỗ hoặc đem đi</div>
                </div>
            </div>
        `;
        
        openModal(modalProductDetail);
    }
    
    // Bind modal overlays clicking to close modal
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', closeAllModals);
    });
    
    // Bind modal close buttons
    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Bind ESC key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });

    // ==========================================
    // 8. SCROLL REVEAL (IntersectionObserver)
    // ==========================================
    
    /**
     * Marks elements with reveal classes as "revealed" when they enter viewport
     */
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
        
        if (!revealElements.length) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Once revealed, stop watching
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });
        
        revealElements.forEach(el => observer.observe(el));
    }
    
    // Add reveal classes programmatically to section headers and cards
    function applyRevealClasses() {
        // Section headers
        document.querySelectorAll('.section-header').forEach(el => {
            el.classList.add('reveal');
        });
        
        // About section columns
        const aboutText = document.querySelector('.about-text-content');
        const aboutFeatures = document.querySelector('.about-features');
        if (aboutText) aboutText.classList.add('reveal-left');
        if (aboutFeatures) aboutFeatures.classList.add('reveal-right');
        
        // Feature cards in About - staggered
        document.querySelectorAll('.feature-card').forEach(el => {
            el.classList.add('reveal');
        });
        
        // Featured menu section
        const featuredArea = document.querySelector('.featured-menu-area');
        if (featuredArea) featuredArea.classList.add('reveal');
        
        // Booking Gate and form card
        const bookingWrapper = document.querySelector('.booking-wrapper');
        if (bookingWrapper) bookingWrapper.classList.add('reveal');
        
        // Contact columns
        document.querySelectorAll('.contact-info-col, .contact-map-col, .contact-feedback-col').forEach(el => {
            el.classList.add('reveal');
        });
        
        // Footer columns
        document.querySelectorAll('.footer-col').forEach((el, idx) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${idx * 0.1}s`;
        });
    }

    // ==========================================
    // 9. BACK TO TOP BUTTON
    // ==========================================
    
    const btnBackTop = document.getElementById('btn-back-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btnBackTop.classList.add('visible');
        } else {
            btnBackTop.classList.remove('visible');
        }
    });
    
    btnBackTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ==========================================
    // 10. FOOTER NEWSLETTER SUBSCRIPTION
    // ==========================================
    
    const footerEmailInput = document.querySelector('.footer-email-input');
    const footerSubscribeBtn = document.querySelector('.footer-subscribe-btn');
    
    if (footerSubscribeBtn && footerEmailInput) {
        footerSubscribeBtn.addEventListener('click', () => {
            const emailVal = footerEmailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!emailRegex.test(emailVal)) {
                footerEmailInput.style.borderColor = 'var(--danger)';
                footerEmailInput.focus();
                return;
            }
            
            // Success state
            footerEmailInput.style.borderColor = 'var(--gold)';
            footerSubscribeBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
            footerSubscribeBtn.style.backgroundColor = '#2E7D32';
            footerEmailInput.value = '';
            footerEmailInput.placeholder = 'Đăng ký thành công! Cảm ơn bạn.';
            
            // Reset after 3s
            setTimeout(() => {
                footerSubscribeBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
                footerSubscribeBtn.style.backgroundColor = '';
                footerEmailInput.placeholder = 'Email của bạn...';
                footerEmailInput.style.borderColor = '';
            }, 3000);
        });
        
        // Clear error state on typing
        footerEmailInput.addEventListener('input', () => {
            footerEmailInput.style.borderColor = '';
        });
    }

    // ==========================================
    // 11. APP INITIALIZATION RUN
    // ==========================================
    applyRevealClasses();
    updateMemberState();
    loadData();
    
    // Init scroll reveal after DOM is ready
    setTimeout(initScrollReveal, 100);
});

