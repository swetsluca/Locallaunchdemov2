/**
 * Sultan's Flame - Main JavaScript
 * Modern Mediterranean Street Food Website
 */

document.addEventListener('DOMContentLoaded', function() {
    // ========================================
    // DOM Elements
    // ========================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const openStatusElement = document.getElementById('openStatus');

    // ========================================
    // Navbar Scroll Effect
    // ========================================
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll);

    // ========================================
    // Mobile Navigation Toggle
    // ========================================
    function toggleMobileMenu() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileMenu() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    navToggle.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // Opening Hours Status
    // ========================================
    function checkOpeningStatus() {
        if (!openStatusElement) return;
        
        const now = new Date();
        const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const hour = now.getHours();
        const minute = now.getMinutes();
        const currentTime = hour * 60 + minute; // Convert to minutes
        
        // Opening hours in minutes from midnight
        // Monday-Thursday: 11:00 - 23:00
        // Friday-Saturday: 11:00 - 01:00 (next day)
        // Sunday: 12:00 - 22:00
        
        let isOpen = false;
        let openingTime, closingTime;
        
        switch(day) {
            case 0: // Sunday
                openingTime = 12 * 60; // 12:00
                closingTime = 22 * 60; // 22:00
                isOpen = currentTime >= openingTime && currentTime < closingTime;
                break;
            case 1: // Monday
            case 2: // Tuesday
            case 3: // Wednesday
            case 4: // Thursday
                openingTime = 11 * 60; // 11:00
                closingTime = 23 * 60; // 23:00
                isOpen = currentTime >= openingTime && currentTime < closingTime;
                break;
            case 5: // Friday
            case 6: // Saturday
                openingTime = 11 * 60; // 11:00
                closingTime = 25 * 60; // 01:00 (next day, so 25 hours)
                isOpen = currentTime >= openingTime || currentTime < 60; // Open until 1 AM
                break;
        }
        
        if (isOpen) {
            openStatusElement.textContent = 'Open Now';
            openStatusElement.style.color = '#22c55e';
        } else {
            openStatusElement.textContent = 'Closed Now';
            openStatusElement.style.color = '#ef4444';
        }
    }

    // Check status immediately and update every minute
    checkOpeningStatus();
    setInterval(checkOpeningStatus, 60000);

    // ========================================
    // Scroll Reveal Animation
    // ========================================
    const revealElements = document.querySelectorAll('.menu-card, .review-card, .feature, .location-card');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        revealObserver.observe(el);
    });

    // ========================================
    // Parallax Effect for Hero
    // ========================================
    const heroImage = document.querySelector('.hero-image img');
    
    if (heroImage && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            heroImage.style.transform = `translateY(${rate}px)`;
        });
    }

    // ========================================
    // Active Navigation Link on Scroll
    // ========================================
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNavLink() {
        const scrollPos = window.scrollY + navbar.offsetHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);

    // ========================================
    // Button Click Feedback
    // ========================================
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
            ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ========================================
    // Image Lazy Loading Enhancement
    // ========================================
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    lazyImages.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        imageObserver.observe(img);
    });

    // ========================================
    // Console Easter Egg
    // ========================================
    console.log('%c🔥 Sultan\'s Flame 🔥', 'font-size: 24px; font-weight: bold; color: #ff6b35;');
    console.log('%cWhere Fire Meets Flavor', 'font-size: 14px; color: #f7931e;');
    console.log('%cVisit us at West-Kruiskade 45A, Rotterdam', 'font-size: 12px; color: #666;');
});

// ========================================
// Service Worker Registration (Optional PWA support)
// ========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js');
    });
}
