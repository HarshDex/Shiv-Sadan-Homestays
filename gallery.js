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
    initGalleryFilter();
    initLightbox();
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

// Gallery Filter
function initGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterButtons.length && galleryItems.length) {
        // Initialize Isotope if available
        let iso;
        if (typeof Isotope !== 'undefined') {
            const galleryContainer = document.querySelector('.gallery-container');
            iso = new Isotope(galleryContainer, {
                itemSelector: '.gallery-item',
                layoutMode: 'masonry',
                masonry: {
                    columnWidth: '.gallery-item'
                }
            });
        }
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get selected category
                const selectedCategory = this.getAttribute('data-filter');
                
                if (iso) {
                    // Filter with Isotope
                    if (selectedCategory === 'all') {
                        iso.arrange({ filter: '*' });
                    } else {
                        iso.arrange({ filter: `[data-category="${selectedCategory}"]` });
                    }
                } else {
                    // Fallback filter without Isotope
                    galleryItems.forEach(item => {
                        if (selectedCategory === 'all' || item.getAttribute('data-category') === selectedCategory) {
                            // Show item with animation
                            item.style.display = 'block';
                            setTimeout(() => {
                                item.style.opacity = 1;
                                item.style.transform = 'translateY(0)';
                            }, 10);
                        } else {
                            // Hide item with animation
                            item.style.opacity = 0;
                            item.style.transform = 'translateY(20px)';
                            setTimeout(() => {
                                item.style.display = 'none';
                            }, 300);
                        }
                    });
                }
            });
        });
    }
}

// Lightbox Functionality
function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const closeLightbox = document.querySelector('.close-lightbox');
    const prevButton = document.querySelector('.lightbox-prev');
    const nextButton = document.querySelector('.lightbox-next');
    
    if (galleryItems.length && lightbox && lightboxImage) {
        let currentIndex = 0;
        const galleryArray = Array.from(galleryItems);
        
        // Open lightbox when clicking on a gallery item
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                currentIndex = index;
                const imgSrc = this.querySelector('img').getAttribute('data-full') || this.querySelector('img').src;
                const imgAlt = this.querySelector('img').alt;
                const imgCaption = this.querySelector('.gallery-info h3') ? 
                                  this.querySelector('.gallery-info h3').textContent : '';
                
                lightboxImage.src = imgSrc;
                lightboxImage.alt = imgAlt;
                lightboxCaption.textContent = imgCaption;
                
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
                
                // Add animation
                lightboxImage.style.opacity = 0;
                lightboxImage.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    lightboxImage.style.opacity = 1;
                    lightboxImage.style.transform = 'scale(1)';
                }, 10);
            });
        });
        
        // Close lightbox
        if (closeLightbox) {
            closeLightbox.addEventListener('click', function() {
                lightbox.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            });
        }
        
        // Close lightbox when clicking outside the image
        lightbox.addEventListener('click', function(event) {
            if (event.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
        
        // Previous image
        if (prevButton) {
            prevButton.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent closing the lightbox
                
                currentIndex = (currentIndex - 1 + galleryArray.length) % galleryArray.length;
                updateLightboxContent(galleryArray[currentIndex]);
            });
        }
        
        // Next image
        if (nextButton) {
            nextButton.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent closing the lightbox
                
                currentIndex = (currentIndex + 1) % galleryArray.length;
                updateLightboxContent(galleryArray[currentIndex]);
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', function(event) {
            if (!lightbox.classList.contains('active')) return;
            
            if (event.key === 'Escape') {
                lightbox.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            } else if (event.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + galleryArray.length) % galleryArray.length;
                updateLightboxContent(galleryArray[currentIndex]);
            } else if (event.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % galleryArray.length;
                updateLightboxContent(galleryArray[currentIndex]);
            }
        });
        
        // Helper function to update lightbox content with animation
        function updateLightboxContent(item) {
            const imgSrc = item.querySelector('img').getAttribute('data-full') || item.querySelector('img').src;
            const imgAlt = item.querySelector('img').alt;
            const imgCaption = item.querySelector('.gallery-info h3') ? 
                              item.querySelector('.gallery-info h3').textContent : '';
            
            // Add animation
            lightboxImage.style.opacity = 0;
            lightboxImage.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                lightboxImage.src = imgSrc;
                lightboxImage.alt = imgAlt;
                lightboxCaption.textContent = imgCaption;
                
                lightboxImage.style.opacity = 1;
                lightboxImage.style.transform = 'scale(1)';
            }, 300);
        }
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
        gsap.from('.gallery-hero h1', {
            duration: 1.2,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        });
        
        gsap.from('.gallery-hero p', {
            duration: 1.2,
            y: 30,
            opacity: 0,
            ease: 'power3.out',
            delay: 0.3
        });
        
        // Filter buttons animation
        gsap.from('.filter-btn', {
            scrollTrigger: {
                trigger: '.gallery-filter',
                start: 'top 80%'
            },
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out'
        });
        
        // Gallery items with staggered animation
        gsap.from('.gallery-item', {
            scrollTrigger: {
                trigger: '.gallery-container',
                start: 'top 80%'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: 'back.out(1.7)'
        });
        
        // Instagram feed animation
        gsap.from('.instagram-item', {
            scrollTrigger: {
                trigger: '.instagram-grid',
                start: 'top 80%'
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.05,
            ease: 'power2.out'
        });
        
        // User photos animation
        gsap.from('.user-photo', {
            scrollTrigger: {
                trigger: '.user-photos-grid',
                start: 'top 80%'
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
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
        document.querySelectorAll('.gallery-hero h1, .gallery-hero p, .filter-btn, .gallery-item, .instagram-item, .user-photo, .cta-content').forEach(el => {
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
