// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Remove loader immediately
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
    }
    
    // Initialize all components
    initMobileMenu();
    initStickyHeader();
    initRoomGallery();
    initAccordion();
    initBookingForm();
    initAnimations();
    
    // Scroll to room section if hash in URL
    if (window.location.hash) {
        const targetSection = document.querySelector(window.location.hash);
        if (targetSection) {
            setTimeout(() => {
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }, 500);
        }
    }
});

// Mobile Menu Toggle
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenu.contains(event.target) && !menuToggle.contains(event.target) && mobileMenu.classList.contains('active')) {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
}

// Sticky Header
function initStickyHeader() {
    const header = document.querySelector('header');
    
    if (header) {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                header.classList.add('scrolled');
                
                // Hide header on scroll down, show on scroll up
                if (scrollTop > lastScrollTop && scrollTop > 200) {
                    header.classList.add('header-hidden');
                } else {
                    header.classList.remove('header-hidden');
                }
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop;
        });
    }
}

// Room Gallery Thumbnails
function initRoomGallery() {
    const roomDetailSections = document.querySelectorAll('.room-detail');
    
    roomDetailSections.forEach(section => {
        const mainImage = section.querySelector('.main-image img');
        const thumbs = section.querySelectorAll('.thumb');
        
        thumbs.forEach(thumb => {
            thumb.addEventListener('click', function() {
                // Update main image
                const thumbImg = this.querySelector('img');
                mainImage.src = thumbImg.src;
                mainImage.alt = thumbImg.alt;
                
                // Update active thumbnail
                thumbs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Add a subtle animation to the main image
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(mainImage, 
                        { opacity: 0.8, scale: 0.95 }, 
                        { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
                    );
                }
            });
        });
    });
}

// FAQ Accordion
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', function() {
            // Check if this item is already active
            const isActive = item.classList.contains('active');
            
            // Close all accordion items
            accordionItems.forEach(accItem => {
                accItem.classList.remove('active');
            });
            
            // If the clicked item wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Booking Form Validation and Enhancement
function initBookingForm() {
    const bookingForm = document.querySelector('.booking-form');
    
    if (bookingForm) {
        // Set minimum dates for check-in and check-out
        const checkInInput = bookingForm.querySelector('#check-in');
        const checkOutInput = bookingForm.querySelector('#check-out');
        
        if (checkInInput && checkOutInput) {
            // Set min date to today for check-in
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            const formatDate = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };
            
            checkInInput.min = formatDate(today);
            checkOutInput.min = formatDate(tomorrow);
            
            // Update check-out min date when check-in changes
            checkInInput.addEventListener('change', function() {
                if (this.value) {
                    const newMinDate = new Date(this.value);
                    newMinDate.setDate(newMinDate.getDate() + 1);
                    checkOutInput.min = formatDate(newMinDate);
                    
                    // If current check-out date is before new min date, update it
                    if (checkOutInput.value && new Date(checkOutInput.value) <= new Date(this.value)) {
                        checkOutInput.value = formatDate(newMinDate);
                    }
                }
            });
        }
        
        // Form submission
        bookingForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Basic validation
            let valid = true;
            const inputs = bookingForm.querySelectorAll('input, select');
            
            inputs.forEach(input => {
                if (input.required && !input.value.trim()) {
                    valid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
            
            // Additional validation for dates
            if (checkInInput && checkOutInput && checkInInput.value && checkOutInput.value) {
                const checkIn = new Date(checkInInput.value);
                const checkOut = new Date(checkOutInput.value);
                
                if (checkOut <= checkIn) {
                    valid = false;
                    checkOutInput.classList.add('error');
                    alert('Check-out date must be after check-in date');
                }
            }
            
            if (valid) {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success';
                successMessage.textContent = 'Checking availability... We will contact you shortly with available options.';
                
                // Replace form with success message
                bookingForm.innerHTML = '';
                bookingForm.appendChild(successMessage);
                
                // In a real application, you would send the form data to the server here
                console.log('Form submitted successfully');
            }
        });
        
        // Real-time validation feedback
        const inputs = bookingForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (input.required && !input.value.trim()) {
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
            
            // Remove error class when user starts typing/selecting
            input.addEventListener('input', function() {
                input.classList.remove('error');
            });
        });
    }
}

// GSAP Animations
function initAnimations() {
    // Check if GSAP is available
    if (typeof gsap !== 'undefined') {
        // Register ScrollTrigger if available
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }
        
        // Hero section animations
        gsap.from('.accommodations-hero h1', {
            duration: 1.2,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        });
        
        gsap.from('.accommodations-hero p', {
            duration: 1.2,
            y: 30,
            opacity: 0,
            ease: 'power3.out',
            delay: 0.3
        });
        
        // Features animations with stagger
        gsap.from('.feature', {
            scrollTrigger: {
                trigger: '.accommodations-features',
                start: 'top 80%'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'back.out(1.7)'
        });
        
        // Room detail sections
        const roomSections = document.querySelectorAll('.room-detail');
        roomSections.forEach(section => {
            const isAlt = section.classList.contains('alt-layout');
            
            gsap.from(section.querySelector('.room-detail-text'), {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 75%'
                },
                x: isAlt ? 50 : -50,
                opacity: 0,
                duration: 1,
                ease: 'power2.out'
            });
            
            gsap.from(section.querySelector('.room-detail-gallery'), {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 75%'
                },
                x: isAlt ? -50 : 50,
                opacity: 0,
                duration: 1,
                ease: 'power2.out',
                delay: 0.3
            });
        });
        
        // Amenities grid with stagger
        gsap.from('.amenity-item', {
            scrollTrigger: {
                trigger: '.amenities-grid',
                start: 'top 80%'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'back.out(1.7)'
        });
        
        // Booking info section
        gsap.from('.booking-info-text', {
            scrollTrigger: {
                trigger: '.booking-info-content',
                start: 'top 75%'
            },
            x: -50,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });
        
        gsap.from('.booking-form-container', {
            scrollTrigger: {
                trigger: '.booking-info-content',
                start: 'top 75%'
            },
            x: 50,
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
            delay: 0.3
        });
        
        // FAQ accordion items with stagger
        gsap.from('.accordion-item', {
            scrollTrigger: {
                trigger: '.accordion',
                start: 'top 80%'
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out'
        });
        
        // CTA section animation
        gsap.from('.cta-content', {
            scrollTrigger: {
                trigger: '.cta-section',
                start: 'top 80%'
            },
            y: 30,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });
    } else {
        // Fallback for when GSAP is not available
        document.querySelectorAll('.accommodations-hero h1, .accommodations-hero p, .feature, .room-detail-text, .room-detail-gallery, .amenity-item, .booking-info-text, .booking-form-container, .accordion-item, .cta-content').forEach(el => {
            el.style.opacity = 1;
        });
    }
}

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update URL without page jump
            history.pushState(null, null, targetId);
        }
    });
});
