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
    initTestimonialSlider();
    initLazyLoading();
    initAnimations();
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
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

// Animations
function initAnimations() {
    // Check if GSAP is available
    if (typeof gsap !== 'undefined') {
        // Register ScrollTrigger if available
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }
        
        // Hero section animations
        gsap.from('.about-hero h1', {
            duration: 1.2,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        });
        
        gsap.from('.about-hero p', {
            duration: 1.2,
            y: 30,
            opacity: 0,
            ease: 'power3.out',
            delay: 0.3
        });
        
        // About intro animations
        gsap.from('.about-intro-text', {
            scrollTrigger: {
                trigger: '.about-intro',
                start: 'top 75%'
            },
            x: -50,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });
        
        gsap.from('.about-intro-image', {
            scrollTrigger: {
                trigger: '.about-intro',
                start: 'top 75%'
            },
            x: 50,
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
            delay: 0.3
        });
        
        // Philosophy cards animation
        gsap.from('.philosophy-card', {
            scrollTrigger: {
                trigger: '.philosophy-grid',
                start: 'top 80%'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'back.out(1.7)'
        });
        
        // Experience section animation
        gsap.from('.experience-image', {
            scrollTrigger: {
                trigger: '.experience-wrapper',
                start: 'top 75%'
            },
            x: -50,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });
        
        gsap.from('.experience-content', {
            scrollTrigger: {
                trigger: '.experience-wrapper',
                start: 'top 75%'
            },
            x: 50,
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
            delay: 0.3
        });
        
        // Team cards animation
        gsap.from('.team-card', {
            scrollTrigger: {
                trigger: '.team-grid',
                start: 'top 80%'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'back.out(1.7)'
        });
        
        // Commitment section animation
        gsap.from('.commitment-text', {
            scrollTrigger: {
                trigger: '.commitment-content',
                start: 'top 75%'
            },
            x: -50,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });
        
        gsap.from('.commitment-image', {
            scrollTrigger: {
                trigger: '.commitment-content',
                start: 'top 75%'
            },
            x: 50,
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
            delay: 0.3
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
        document.querySelectorAll('.about-hero h1, .about-hero p, .about-intro-text, .about-intro-image, .philosophy-card, .experience-image, .experience-content, .team-card, .commitment-text, .commitment-image, .cta-content').forEach(el => {
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
        }
    });
});
