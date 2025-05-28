// APWB Website JavaScript
// Complete functionality for the Association of Professional Women Bankers website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeCarousel();
    initializeScrollAnimations();
    initializeNavigation();
    initializeStatsAnimation();
    initializeParallax();
    initializeMobileMenu();
    initializeFormHandlers();
    initializeSearchFunctionality();
});

// ==========================================
// CAROUSEL FUNCTIONALITY
// ==========================================
let currentSlideIndex = 0;
let carouselInterval;
const CAROUSEL_DELAY = 5000;

function initializeCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    
    if (slides.length === 0) return;
    
    const totalSlides = slides.length;
    
    // Show initial slide
    showSlide(0);
    
    // Start auto-advance
    startCarouselAutoAdvance();
    
    // Pause on hover
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopCarouselAutoAdvance);
        carouselContainer.addEventListener('mouseleave', startCarouselAutoAdvance);
    }
}

function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    
    if (slides.length === 0) return;
    
    // Hide all slides and deactivate dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Show current slide and activate corresponding dot
    if (slides[index]) {
        slides[index].classList.add('active');
    }
    if (dots[index]) {
        dots[index].classList.add('active');
    }
}

function nextSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;
    currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
    showSlide(currentSlideIndex);
}

function previousSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;
    currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
    showSlide(currentSlideIndex);
}

function currentSlide(slideNumber) {
    currentSlideIndex = slideNumber - 1;
    showSlide(currentSlideIndex);
}

function startCarouselAutoAdvance() {
    stopCarouselAutoAdvance();
    carouselInterval = setInterval(nextSlide, CAROUSEL_DELAY);
}

function stopCarouselAutoAdvance() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
        carouselInterval = null;
    }
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeInObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation for cards
                if (entry.target.classList.contains('initiative-card') || 
                    entry.target.classList.contains('executive-card')) {
                    addStaggeredAnimation(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        fadeInObserver.observe(el);
    });
}

function addStaggeredAnimation(element) {
    const siblings = Array.from(element.parentElement.children);
    const index = siblings.indexOf(element);
    const delay = index * 100; // 100ms delay between each card
    
    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, delay);
}

// ==========================================
// NAVIGATION FUNCTIONALITY
// ==========================================
function initializeNavigation() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });

    // Navbar background on scroll
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 30px rgba(0,0,0,0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        }
        
        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
        
        // Update active navigation item
        updateActiveNavItem();
    });
}

function updateActiveNavItem() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPosition = window.scrollY + 200;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

// ==========================================
// MOBILE MENU FUNCTIONALITY
// ==========================================
function initializeMobileMenu() {
    // Create mobile menu toggle button
    const navContainer = document.querySelector('.nav-container');
    const mobileToggle = document.createElement('button');
    mobileToggle.classList.add('mobile-menu-toggle');
    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    mobileToggle.style.display = 'none';
    
    navContainer.appendChild(mobileToggle);
    
    // Toggle mobile menu
    mobileToggle.addEventListener('click', toggleMobileMenu);
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        const navMenu = document.querySelector('.nav-menu');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
            document.querySelector('.mobile-menu-toggle').style.display = 'none';
        } else {
            document.querySelector('.mobile-menu-toggle').style.display = 'block';
        }
    });
    
    // Initial check
    if (window.innerWidth <= 768) {
        document.querySelector('.mobile-menu-toggle').style.display = 'block';
    }
}

function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    navMenu.classList.toggle('mobile-open');
    mobileToggle.classList.toggle('active');
    
    // Toggle icon
    const icon = mobileToggle.querySelector('i');
    if (navMenu.classList.contains('mobile-open')) {
        icon.className = 'fas fa-times';
    } else {
        icon.className = 'fas fa-bars';
    }
}

function closeMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    if (navMenu) {
        navMenu.classList.remove('mobile-open');
    }
    
    if (mobileToggle) {
        mobileToggle.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-bars';
        }
    }
}

// ==========================================
// STATISTICS ANIMATION
// ==========================================
function initializeStatsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    function animateStats() {
        if (animated) return;
        
        statNumbers.forEach((stat, index) => {
            const finalText = stat.textContent;
            const finalValue = parseInt(finalText.replace(/\D/g, ''));
            const hasPlus = finalText.includes('+');
            let currentValue = 0;
            const increment = finalValue / 60; // Slower animation
            const duration = 2000; // 2 seconds
            const stepTime = duration / 60;
            
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= finalValue) {
                    stat.textContent = finalValue + (hasPlus ? '+' : '');
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(currentValue) + (hasPlus ? '+' : '');
                }
            }, stepTime);
        });
        
        animated = true;
    }

    // Trigger stats animation when stats section is visible
    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(animateStats, 500); // Delay for better effect
                }
            });
        }, { threshold: 0.3 });
        
        statsObserver.observe(statsSection);
    }
}

// ==========================================
// PARALLAX EFFECTS
// ==========================================
function initializeParallax() {
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        // Hero parallax
        const hero = document.querySelector('.hero');
        if (hero) {
            const rate = scrolled * -0.3;
            hero.style.transform = `translateY(${rate}px)`;
        }
        
        // Background parallax for sections
        const parallaxSections = document.querySelectorAll('.initiatives-section, .mentor-section');
        parallaxSections.forEach((section, index) => {
            const rate = scrolled * (0.1 + index * 0.05);
            section.style.backgroundPositionY = `${rate}px`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// ==========================================
// FORM HANDLERS
// ==========================================
function initializeFormHandlers() {
    // Newsletter subscription (if form exists)
    const newsletterForm = document.querySelector('#newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmission);
    }
    
    // Contact form (if exists)
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmission);
    }
    
    // Mentor application form (if exists)
    const mentorForm = document.querySelector('#mentor-form');
    if (mentorForm) {
        mentorForm.addEventListener('submit', handleMentorApplicationSubmission);
    }
}

function handleNewsletterSubmission(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    if (validateEmail(email)) {
        showNotification('Thank you for subscribing to our newsletter!', 'success');
        e.target.reset();
    } else {
        showNotification('Please enter a valid email address.', 'error');
    }
}

function handleContactFormSubmission(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Basic validation
    const requiredFields = ['name', 'email', 'message'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const value = formData.get(field);
        if (!value || value.trim() === '') {
            isValid = false;
            showFieldError(field, 'This field is required');
        }
    });
    
    if (isValid && validateEmail(formData.get('email'))) {
        showNotification('Thank you for your message. We will get back to you soon!', 'success');
        e.target.reset();
    } else if (!validateEmail(formData.get('email'))) {
        showNotification('Please enter a valid email address.', 'error');
    }
}

function handleMentorApplicationSubmission(e) {
    e.preventDefault();
    showNotification('Your mentor application has been submitted successfully!', 'success');
    e.target.reset();
}

// ==========================================
// SEARCH FUNCTIONALITY
// ==========================================
function initializeSearchFunctionality() {
    const searchLinks = document.querySelectorAll('a[href="#search"]');
    
    searchLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            toggleSearchModal();
        });
    });
    
    // Create search modal if it doesn't exist
    if (!document.querySelector('.search-modal')) {
        createSearchModal();
    }
}

function createSearchModal() {
    const modal = document.createElement('div');
    modal.className = 'search-modal';
    modal.innerHTML = `
        <div class="search-modal-content">
            <div class="search-modal-header">
                <h3>Search APWB</h3>
                <button class="search-close">&times;</button>
            </div>
            <div class="search-modal-body">
                <input type="text" class="search-input" placeholder="Search for content, members, initiatives...">
                <div class="search-results"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.search-close').addEventListener('click', toggleSearchModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            toggleSearchModal();
        }
    });
    
    const searchInput = modal.querySelector('.search-input');
    searchInput.addEventListener('input', handleSearch);
    
    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            toggleSearchModal();
        }
    });
}

function toggleSearchModal() {
    const modal = document.querySelector('.search-modal');
    modal.classList.toggle('active');
    
    if (modal.classList.contains('active')) {
        const input = modal.querySelector('.search-input');
        setTimeout(() => input.focus(), 100);
    }
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const resultsContainer = document.querySelector('.search-results');
    
    if (query.length < 2) {
        resultsContainer.innerHTML = '';
        return;
    }
    
    // Mock search results (replace with actual search logic)
    const searchableContent = [
        { title: 'Mentoring Program', type: 'Initiative', url: '#mentoring' },
        { title: 'Executive Members', type: 'Leadership', url: '#executives' },
        { title: 'APWB Publications', type: 'Resources', url: '#publications' },
        { title: 'Thought Leadership', type: 'Initiative', url: '#thought-leadership' },
        { title: 'Webinars', type: 'Events', url: '#webinars' },
        { title: 'CSR Activities', type: 'Community', url: '#csr' }
    ];
    
    const results = searchableContent.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.type.toLowerCase().includes(query)
    );
    
    displaySearchResults(results);
}

function displaySearchResults(results) {
    const resultsContainer = document.querySelector('.search-results');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p class="no-results">No results found</p>';
        return;
    }
    
    const resultHTML = results.map(result => `
        <div class="search-result-item">
            <h4><a href="${result.url}">${result.title}</a></h4>
            <span class="result-type">${result.type}</span>
        </div>
    `).join('');
    
    resultsContainer.innerHTML = resultHTML;
    
    // Add click handlers to close modal when result is clicked
    resultsContainer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', toggleSearchModal);
    });
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function showFieldError(fieldName, message) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (field) {
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentElement.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        field.parentElement.appendChild(errorElement);
        
        // Remove error on focus
        field.addEventListener('focus', function() {
            field.classList.remove('error');
            const errorMsg = field.parentElement.querySelector('.field-error');
            if (errorMsg) {
                errorMsg.remove();
            }
        }, { once: true });
    }
}

// ==========================================
// PERFORMANCE OPTIMIZATION
// ==========================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==========================================
// ACCESSIBILITY ENHANCEMENTS
// ==========================================
function enhanceAccessibility() {
    // Add keyboard navigation for carousel
    document.addEventListener('keydown', function(e) {
        if (e.target.closest('.carousel-container')) {
            if (e.key === 'ArrowLeft') {
                previousSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        }
    });
    
    // Add ARIA labels for better screen reader support
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    carouselSlides.forEach((slide, index) => {
        slide.setAttribute('aria-label', `Slide ${index + 1} of ${carouselSlides.length}`);
    });
    
    
}

// Initialize accessibility enhancements
document.addEventListener('DOMContentLoaded', enhanceAccessibility);

// ==========================================
// EXPORT FUNCTIONS FOR GLOBAL ACCESS
// ==========================================
window.APWB = {
    nextSlide,
    previousSlide,
    currentSlide,
    toggleSearchModal,
    showNotification
};
