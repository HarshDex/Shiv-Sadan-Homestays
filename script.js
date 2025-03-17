document.addEventListener('DOMContentLoaded', function() {
    // Remove loader immediately
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
    }
    
    // Initialize all components
    initMobileMenu();
    initStickyHeader();
    initRoomSlider();
    initTestimonialSlider();
    initBookingWidget();
    initVirtualTour();
    initContactForm();
    initLazyLoading();
    initSmoothScrolling();
    initPageTransitions();
    
    // Initialize animations if GSAP is available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        initAnimations();
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

// Room Slider/Carousel
function initRoomSlider() {
    const roomsContainer = document.querySelector('.rooms-container');
    
    if (roomsContainer) {
        // If using GSAP for horizontal scrolling
        if (typeof gsap !== 'undefined') {
            gsap.to(roomsContainer, {
                x: () => -(roomsContainer.scrollWidth - window.innerWidth + 40),
                ease: 'none',
                scrollTrigger: {
                    trigger: roomsContainer,
                    start: 'top center',
                    end: () => `+=${roomsContainer.scrollWidth - window.innerWidth + 100}`,
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            });
        }
        
        // Alternative touch-friendly slider for mobile
        let isDown = false;
        let startX;
        let scrollLeft;
        
        roomsContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            roomsContainer.classList.add('active');
            startX = e.pageX - roomsContainer.offsetLeft;
            scrollLeft = roomsContainer.scrollLeft;
        });
        
        roomsContainer.addEventListener('mouseleave', () => {
            isDown = false;
            roomsContainer.classList.remove('active');
        });
        
        roomsContainer.addEventListener('mouseup', () => {
            isDown = false;
            roomsContainer.classList.remove('active');
        });
        
        roomsContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - roomsContainer.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed
            roomsContainer.scrollLeft = scrollLeft - walk;
        });
    }
}

// Testimonial Slider
function initTestimonialSlider() {
    const testimonialSlider = document.querySelector('.testimonial-slider');
    
    if (testimonialSlider) {
        const slides = testimonialSlider.querySelectorAll('.testimonial-slide');
        const prevBtn = testimonialSlider.querySelector('.prev-slide');
        const nextBtn = testimonialSlider.querySelector('.next-slide');
        const indicators = testimonialSlider.querySelectorAll('.indicator');
        
        let currentIndex = 0;
        
        // Function to update active slide
        function updateSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));
            
            slides[index].classList.add('active');
            indicators[index].classList.add('active');
            currentIndex = index;
        }
        
        // Event listeners for controls
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                let newIndex = currentIndex - 1;
                if (newIndex < 0) newIndex = slides.length - 1;
                updateSlide(newIndex);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                let newIndex = currentIndex + 1;
                if (newIndex >= slides.length) newIndex = 0;
                updateSlide(newIndex);
            });
        }
        
        // Click on indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                updateSlide(index);
            });
        });
        
        // Auto-rotate slides
        let slideInterval = setInterval(() => {
            let newIndex = currentIndex + 1;
            if (newIndex >= slides.length) newIndex = 0;
            updateSlide(newIndex);
        }, 5000);
        
        // Pause auto-rotation on hover
        testimonialSlider.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        testimonialSlider.addEventListener('mouseleave', () => {
            slideInterval = setInterval(() => {
                let newIndex = currentIndex + 1;
                if (newIndex >= slides.length) newIndex = 0;
                updateSlide(newIndex);
            }, 5000);
        });
    }
}

// Booking Widget Toggle
function initBookingWidget() {
    const widgetToggle = document.querySelector('.widget-toggle');
    const bookingWidget = document.querySelector('.booking-widget');
    
    if (widgetToggle && bookingWidget) {
        widgetToggle.addEventListener('click', function() {
            bookingWidget.classList.toggle('active');
        });
        
        // Close widget when clicking outside
        document.addEventListener('click', function(event) {
            if (!bookingWidget.contains(event.target) && !widgetToggle.contains(event.target) && bookingWidget.classList.contains('active')) {
                bookingWidget.classList.remove('active');
            }
        });
        
        // Prevent closing when clicking inside the widget
        bookingWidget.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    }
}

function initVirtualTour() {
    const tourPreview = document.querySelector('.tour-preview');
    
    if (tourPreview) {
        tourPreview.addEventListener('click', function() {
            const modal = document.createElement('div');
            modal.className = 'tour-modal';
            
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <div class="virtual-tour-container">
                        <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" frameborder="0" allowfullscreen></iframe>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            document.body.classList.add('modal-open');
            
            // Close modal functionality
            const closeBtn = modal.querySelector('.close-modal');
            closeBtn.addEventListener('click', function() {
                document.body.removeChild(modal);
                document.body.classList.remove('modal-open');
            });
            
            // Close when clicking outside content
            modal.addEventListener('click', function(event) {
                if (event.target === modal) {
                    document.body.removeChild(modal);
                    document.body.classList.remove('modal-open');
                }
            });
        });
    }
}

// Contact Form Validation
function initContactForm() {
    const contactForm = document.querySelector('form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Basic validation
            let valid = true;
            const inputs = contactForm.querySelectorAll('input, textarea');
            
            inputs.forEach(input => {
                if (input.required && !input.value.trim()) {
                    valid = false;
                    input.classList.add('error');
                } else if (input.type === 'email' && input.value.trim()) {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(input.value.trim())) {
                        valid = false;
                        input.classList.add('error');
                    } else {
                        input.classList.remove('error');
                    }
                } else {
                    input.classList.remove('error');
                }
            });
            
            if (valid) {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success';
                successMessage.textContent = 'Thank you! Your message has been sent successfully.';
                
                contactForm.reset();
                contactForm.appendChild(successMessage);
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    if (successMessage.parentNode === contactForm) {
                        contactForm.removeChild(successMessage);
                    }
                }, 5000);
            }
        });
        
        // Real-time validation feedback
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (input.required && !input.value.trim()) {
                    input.classList.add('error');
                } else if (input.type === 'email' && input.value.trim()) {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(input.value.trim())) {
                        input.classList.add('error');
                    } else {
                        input.classList.remove('error');
                    }
                } else {
                    input.classList.remove('error');
                }
            });
        });
    }
}

// Lazy Loading Images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imgOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px 200px 0px"
        };
        
        const imgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.classList.add('loaded');
                        imgObserver.unobserve(img);
                    }
                }
            });
        }, imgOptions);
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            imgObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.getAttribute('data-src');
        });
    }
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement && window.locomotiveScroll) {
                // Use Locomotive Scroll for smooth scrolling
                window.locomotiveScroll.scrollTo(targetElement);
            } else if (targetElement) {
                // Fallback to native smooth scrolling
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
            
            // Update URL without page jump
            history.pushState(null, null, targetId);
        });
    });
}

// Page Transitions
function initPageTransitions() {
    const internalLinks = document.querySelectorAll('a[href^="/"]:not([target]), a[href^="./"]:not([target]), a[href^="../"]:not([target])');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // Only for internal links to other pages
            if (this.pathname !== window.location.pathname) {
                event.preventDefault();
                
                // Create transition overlay
                const overlay = document.createElement('div');
                overlay.className = 'page-transition-overlay';
                document.body.appendChild(overlay);
                
                // Animate overlay
                gsap.to(overlay, {
                    opacity: 1,
                    duration: 0.5,
                    onComplete: () => {
                        window.location.href = this.href;
                    }
                });
            }
        });
    });
}

// Enhanced GSAP Animations
function initAnimations() {
    // Hero section animations
    gsap.from('.hero h1', {
        duration: 1.2,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
    });
    
    gsap.from('.hero p', {
        duration: 1.2,
        y: 30,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.3
    });
    
    gsap.from('.hero-buttons', {
        duration: 1.2,
        y: 30,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.6
    });
    
    // Enhanced animations for experience cards
    gsap.utils.toArray('.experience-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none',
                scroller: '[data-scroll-container]'
            },
            y: 80,
            opacity: 0,
            duration: 1,
            delay: index * 0.2,
            ease: 'power2.out'
        });
    });
    
    // Room cards with staggered animation
    gsap.from('.room-card', {
        scrollTrigger: {
            trigger: '.room-showcase',
            start: 'top 75%',
            toggleActions: 'play none none none',
            scroller: '[data-scroll-container]'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'back.out(1.7)'
    });
    
    // Testimonial content animation
    gsap.from('.testimonial-content', {
        scrollTrigger: {
            trigger: '.testimonials',
            start: 'top 75%',
            toggleActions: 'play none none none',
            scroller: '[data-scroll-container]'
        },
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power2.out'
    });
    
}