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
    initContactForm();
    initAccordion();
    initNewsletterForm();
    initAnimations();
    
    // Scroll to specific section if URL has hash
    if (window.location.hash) {
        setTimeout(() => {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }, 500);
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

// Contact Form Validation and Submission
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Basic validation
            let valid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    valid = false;
                    field.classList.add('error');
                    
                    // Add error message if it doesn't exist
                    let errorMessage = field.parentNode.querySelector('.error-message');
                    if (!errorMessage) {
                        errorMessage = document.createElement('div');
                        errorMessage.className = 'error-message';
                        errorMessage.textContent = 'This field is required';
                        field.parentNode.appendChild(errorMessage);
                    }
                } else {
                    field.classList.remove('error');
                    
                    // Remove error message if it exists
                    const errorMessage = field.parentNode.querySelector('.error-message');
                    if (errorMessage) {
                        field.parentNode.removeChild(errorMessage);
                    }
                    
                    // Additional validation for email
                    if (field.type === 'email') {
                        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailPattern.test(field.value.trim())) {
                            valid = false;
                            field.classList.add('error');
                            
                            // Add error message for email
                            let emailError = field.parentNode.querySelector('.error-message');
                            if (!emailError) {
                                emailError = document.createElement('div');
                                emailError.className = 'error-message';
                                emailError.textContent = 'Please enter a valid email address';
                                field.parentNode.appendChild(emailError);
                            } else {
                                emailError.textContent = 'Please enter a valid email address';
                            }
                        }
                    }
                }
            });
            
            if (valid) {
                // Show success message
                const formContent = contactForm.innerHTML;
                contactForm.innerHTML = `
                    
                        
                            
                        
                        Thank You!
                        Your message has been sent successfully. We'll get back to you as soon as possible.
                    
                `;
                
                // In a real application, you would send the form data to the server here
                console.log('Form submitted successfully');
                
                // Reset form after 5 seconds (for demo purposes)
                setTimeout(() => {
                    contactForm.innerHTML = formContent;
                    contactForm.reset();
                    initContactForm(); // Re-initialize the form
                }, 5000);
            }
        });
        
        // Real-time validation feedback
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.classList.add('error');
                    
                    // Add error message if it doesn't exist
                    let errorMessage = this.parentNode.querySelector('.error-message');
                    if (!errorMessage) {
                        errorMessage = document.createElement('div');
                        errorMessage.className = 'error-message';
                        errorMessage.textContent = 'This field is required';
                        this.parentNode.appendChild(errorMessage);
                    }
                } else {
                    this.classList.remove('error');
                    
                    // Remove error message if it exists
                    const errorMessage = this.parentNode.querySelector('.error-message');
                    if (errorMessage) {
                        this.parentNode.removeChild(errorMessage);
                    }
                    
                    // Additional validation for email
                    if (this.type === 'email' && this.value.trim()) {
                        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailPattern.test(this.value.trim())) {
                            this.classList.add('error');
                            
                            // Add error message for email
                            let emailError = this.parentNode.querySelector('.error-message');
                            if (!emailError) {
                                emailError = document.createElement('div');
                                emailError.className = 'error-message';
                                emailError.textContent = 'Please enter a valid email address';
                                this.parentNode.appendChild(emailError);
                            }
                        }
                    }
                }
            });
            
            // Remove error class when user starts typing
            input.addEventListener('input', function() {
                this.classList.remove('error');
                
                // Remove error message if it exists
                const errorMessage = this.parentNode.querySelector('.error-message');
                if (errorMessage) {
                    this.parentNode.removeChild(errorMessage);
                }
            });
        });
    }
}

// FAQ Accordion
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    if (accordionItems.length) {
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
}

// Newsletter Form
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            let valid = true;
            
            // Basic validation
            if (!emailInput.value.trim()) {
                valid = false;
                emailInput.classList.add('error');
            } else {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailInput.value.trim())) {
                    valid = false;
                    emailInput.classList.add('error');
                } else {
                    emailInput.classList.remove('error');
                }
            }
            
            if (valid) {
                // Show success message
                const formContent = newsletterForm.innerHTML;
                newsletterForm.innerHTML = `
                    
                        
                        Thank you for subscribing to our newsletter!
                    
                `;
                
                // In a real application, you would send the form data to the server here
                console.log('Newsletter form submitted successfully');
                
                // Reset form after 3 seconds (for demo purposes)
                setTimeout(() => {
                    newsletterForm.innerHTML = formContent;
                    newsletterForm.reset();
                    initNewsletterForm(); // Re-initialize the form
                }, 3000);
            }
        });
        
        // Remove error class when user starts typing
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        if (emailInput) {
            emailInput.addEventListener('input', function() {
                this.classList.remove('error');
            });
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
        gsap.from('.contact-hero h1', {
            duration: 1.2,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        });
        
        gsap.from('.contact-hero p', {
            duration: 1.2,
            y: 30,
            opacity: 0,
            ease: 'power3.out',
            delay: 0.3
        });
        
        // Contact cards animation
        gsap.from('.contact-card', {
            scrollTrigger: {
                trigger: '.contact-cards',
                start: 'top 80%'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'back.out(1.7)'
        });
        
        // Contact form animation
        gsap.from('.form-content', {
            scrollTrigger: {
                trigger: '.contact-form-container',
                start: 'top 75%'
            },
            x: -50,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });
        
        gsap.from('.form-image', {
            scrollTrigger: {
                trigger: '.contact-form-container',
                start: 'top 75%'
            },
            x: 50,
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
            delay: 0.3
        });
        
        // Map animation
        gsap.from('.map-wrapper', {
            scrollTrigger: {
                trigger: '.map-container',
                start: 'top 80%'
            },
            y: 30,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });
        
        // Direction items animation
        gsap.from('.direction-item', {
            scrollTrigger: {
                trigger: '.directions-grid',
                start: 'top 80%'
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'back.out(1.7)'
        });
        
        // FAQ accordion animation
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
        
        // Newsletter section animation
        gsap.from('.newsletter-text', {
            scrollTrigger: {
                trigger: '.newsletter-section',
                start: 'top 80%'
            },
            x: -30,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });
        
        gsap.from('.newsletter-form', {
            scrollTrigger: {
                trigger: '.newsletter-section',
                start: 'top 80%'
            },
            x: 30,
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
            delay: 0.3
        });
    } else {
        // Fallback for when GSAP is not available
        document.querySelectorAll('.contact-hero h1, .contact-hero p, .contact-card, .form-content, .form-image, .map-wrapper, .direction-item, .accordion-item, .newsletter-text, .newsletter-form').forEach(el => {
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
