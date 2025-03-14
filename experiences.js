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
    initCategoryTabs();
    initSeasonTabs();
    initTestimonialSlider();
    initExperienceModals();
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

// Category Tabs for Filtering Experiences
function initCategoryTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const experienceCards = document.querySelectorAll('.experience-card');
    
    if (tabButtons.length && experienceCards.length) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get selected category
                const selectedCategory = this.getAttribute('data-category');
                
                // Filter experience cards
                experienceCards.forEach(card => {
                    if (selectedCategory === 'all' || card.getAttribute('data-category') === selectedCategory) {
                        // Show card with animation
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = 1;
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        // Hide card with animation
                        card.style.opacity = 0;
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
}

// Season Tabs
function initSeasonTabs() {
    const seasonTabs = document.querySelectorAll('.season-tab');
    const seasonContents = document.querySelectorAll('.season-content');
    
    if (seasonTabs.length && seasonContents.length) {
        seasonTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs and contents
                seasonTabs.forEach(t => t.classList.remove('active'));
                seasonContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Show corresponding content
                const selectedSeason = this.getAttribute('data-season');
                const selectedContent = document.querySelector(`.season-content[data-season="${selectedSeason}"]`);
                
                if (selectedContent) {
                    selectedContent.classList.add('active');
                }
            });
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

// Experience Modals
function initExperienceModals() {
    const experienceButtons = document.querySelectorAll('.experience-btn');
    
    if (experienceButtons.length) {
        experienceButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get target modal ID
                const modalId = this.getAttribute('href');
                const modal = document.querySelector(modalId);
                
                if (modal) {
                    // Show modal
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent scrolling
                    
                    // Close modal when clicking on X
                    const closeBtn = modal.querySelector('.close-modal');
                    if (closeBtn) {
                        closeBtn.addEventListener('click', () => {
                            modal.classList.remove('active');
                            document.body.style.overflow = '';
                        });
                    }
                    
                    // Close modal when clicking outside content
                    modal.addEventListener('click', function(event) {
                        if (event.target === modal) {
                            modal.classList.remove('active');
                            document.body.style.overflow = '';
                        }
                    });
                    
                    // Close modal with Escape key
                    document.addEventListener('keydown', function(event) {
                        if (event.key === 'Escape' && modal.classList.contains('active')) {
                            modal.classList.remove('active');
                            document.body.style.overflow = '';
                        }
                    });
                }
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
        gsap.from('.experiences-hero h1', {
            duration: 1.2,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        });
        
        gsap.from('.experiences-hero p', {
            duration: 1.2,
            y: 30,
            opacity: 0,
            ease: 'power3.out',
            delay: 0.3
        });
        
        // Category tabs animation
        gsap.from('.tab-btn', {
            scrollTrigger: {
                trigger: '.category-tabs',
                start: 'top 80%'
            },
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out'
        });
        
        // Experience cards with staggered animation
        gsap.from('.experience-card', {
            scrollTrigger: {
                trigger: '.experience-cards',
                start: 'top 80%'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'back.out(1.7)'
        });
        
        // Season tabs animation
        gsap.from('.season-tab', {
            scrollTrigger: {
                trigger: '.seasons-tabs',
                start: 'top 80%'
            },
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out'
        });
        
        // Season content animation
        gsap.from('.season-image', {
            scrollTrigger: {
                trigger: '.season-content.active',
                start: 'top 80%'
            },
            x: -50,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });
        
        gsap.from('.season-info', {
            scrollTrigger: {
                trigger: '.season-content.active',
                start: 'top 80%'
            },
            x: 50,
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
            delay: 0.3
        });
        
        // Highlight items with staggered animation
        gsap.from('.highlight', {
            scrollTrigger: {
                trigger: '.season-highlights',
                start: 'top 80%'
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'back.out(1.7)'
        });
        
        // Custom experiences section
        gsap.from('.custom-text', {
            scrollTrigger: {
                trigger: '.custom-content',
                start: 'top 75%'
            },
            x: -50,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });
        
        gsap.from('.custom-image', {
            scrollTrigger: {
                trigger: '.custom-content',
                start: 'top 75%'
            },
            x: 50,
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
            delay: 0.3
        });
        
        // Testimonial section animation
        gsap.from('.testimonial-content', {
            scrollTrigger: {
                trigger: '.experience-testimonials',
                start: 'top 75%'
            },
            y: 30,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });
        
        // CTA section animation
        gsap.from('.cta-content', {
            scrollTrigger: {
                trigger: '.booking-cta',
                start: 'top 80%'
            },
            y: 30,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });
    } else {
        // Fallback for when GSAP is not available
        document.querySelectorAll('.experiences-hero h1, .experiences-hero p, .tab-btn, .experience-card, .season-tab, .season-image, .season-info, .highlight, .custom-text, .custom-image, .testimonial-content, .cta-content').forEach(el => {
            el.style.opacity = 1;
        });
    }
}

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        // Skip for experience modal links
        if (this.classList.contains('experience-btn')) return;
        
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
