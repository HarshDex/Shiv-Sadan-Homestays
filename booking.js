// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Loader animation
    setTimeout(function() {
        document.querySelector('.loader').style.opacity = '0';
        setTimeout(function() {
            document.querySelector('.loader').style.display = 'none';
        }, 500);
    }, 1500);

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    mobileMenuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        const spans = mobileMenuToggle.querySelectorAll('span');
        spans.forEach(span => span.classList.toggle('active'));
    });

    // Booking steps navigation
    const bookingSteps = document.querySelectorAll('.booking-step');
    const bookingStepContents = document.querySelectorAll('.booking-step-content');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const confirmButton = document.getElementById('confirm-booking');

    // Next step buttons
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const nextStep = this.getAttribute('data-next');
            goToStep(nextStep);
        });
    });

    // Previous step buttons
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevStep = this.getAttribute('data-prev');
            goToStep(prevStep);
        });
    });

    // Confirm booking button
    if (confirmButton) {
        confirmButton.addEventListener('click', function() {
            const policyAgreement = document.getElementById('policy-agreement');
            if (policyAgreement && !policyAgreement.checked) {
                alert('Please agree to the booking and cancellation policies to proceed.');
                return;
            }
            
            // Show confirmation screen
            bookingStepContents.forEach(content => {
                content.classList.remove('active');
            });
            
            const confirmationContent = document.querySelector('[data-step="confirmation"]');
            if (confirmationContent) {
                confirmationContent.classList.add('active');
            }
            
            // Update booking steps indicator
            bookingSteps.forEach(step => {
                step.classList.remove('active');
                if (step.getAttribute('data-step') === '4') {
                    step.classList.add('completed');
                }
            });
        });
    }

    // Function to navigate between steps
    function goToStep(stepNumber) {
        // Validate current step before proceeding
        const currentStep = getCurrentStep();
        if (parseInt(stepNumber) > parseInt(currentStep) && !validateStep(currentStep)) {
            return;
        }
        
        // Update booking steps indicator
        bookingSteps.forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.getAttribute('data-step')) < parseInt(stepNumber)) {
                step.classList.add('completed');
            }
            if (step.getAttribute('data-step') === stepNumber) {
                step.classList.add('active');
            }
        });
        
        // Show the selected step content
        bookingStepContents.forEach(content => {
            content.classList.remove('active');
            if (content.getAttribute('data-step') === stepNumber) {
                content.classList.add('active');
            }
        });
        
        // If moving to step 4, update the booking summary
        if (stepNumber === '4') {
            updateBookingSummary();
        }
        
        // Scroll to top of the form
        document.querySelector('.booking-form-container').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    // Function to get current active step
    function getCurrentStep() {
        const activeStep = document.querySelector('.booking-step.active');
        return activeStep ? activeStep.getAttribute('data-step') : '1';
    }

    // Function to validate each step
    function validateStep(stepNumber) {
        switch(stepNumber) {
            case '1':
                return validateDatesStep();
            case '2':
                return validateRoomStep();
            case '3':
                return validateGuestDetailsStep();
            default:
                return true;
        }
    }

    // Validate dates step
    function validateDatesStep() {
        const checkIn = document.getElementById('check-in');
        const checkOut = document.getElementById('check-out');
        const adults = document.getElementById('adults');
        
        if (!checkIn.value) {
            alert('Please select a check-in date.');
            checkIn.focus();
            return false;
        }
        
        if (!checkOut.value) {
            alert('Please select a check-out date.');
            checkOut.focus();
            return false;
        }
        
        // Check if check-out is after check-in
        const checkInDate = new Date(checkIn.value);
        const checkOutDate = new Date(checkOut.value);
        
        if (checkOutDate <= checkInDate) {
            alert('Check-out date must be after check-in date.');
            checkOut.focus();
            return false;
        }
        
        // Check if dates are in the future
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (checkInDate < today) {
            alert('Check-in date cannot be in the past.');
            checkIn.focus();
            return false;
        }
        
        return true;
    }

    // Validate room selection step
    function validateRoomStep() {
        const roomSelection = document.querySelector('input[name="room-selection"]:checked');
        
        if (!roomSelection) {
            alert('Please select a room to continue.');
            return false;
        }
        
        return true;
    }

    // Validate guest details step
    function validateGuestDetailsStep() {
        const requiredFields = [
            'first-name',
            'last-name',
            'email',
            'phone',
            'address',
            'city',
            'country',
            'arrival-time'
        ];
        
        for (const fieldId of requiredFields) {
            const field = document.getElementById(fieldId);
            if (!field.value) {
                alert(`Please fill in the ${fieldId.replace('-', ' ')} field.`);
                field.focus();
                return false;
            }
        }
        
        // Validate email format
        const email = document.getElementById('email');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value)) {
            alert('Please enter a valid email address.');
            email.focus();
            return false;
        }
        
        // Validate phone format (basic validation)
        const phone = document.getElementById('phone');
        const phonePattern = /^\+?[0-9\s\-()]{8,20}$/;
        if (!phonePattern.test(phone.value)) {
            alert('Please enter a valid phone number.');
            phone.focus();
            return false;
        }
        
        return true;
    }

    // Update booking summary
    function updateBookingSummary() {
        // Stay details
        const checkIn = document.getElementById('check-in').value;
        const checkOut = document.getElementById('check-out').value;
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const nights = Math.floor((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        
        document.getElementById('summary-checkin').textContent = formatDate(checkInDate);
        document.getElementById('summary-checkout').textContent = formatDate(checkOutDate);
        document.getElementById('summary-duration').textContent = `${nights} Night${nights > 1 ? 's' : ''}`;
        
        const adults = document.getElementById('adults').value;
        const children = document.getElementById('children').value;
        let guestsText = `${adults} Adult${adults > 1 ? 's' : ''}`;
        if (parseInt(children) > 0) {
            guestsText += `, ${children} Child${children > 1 ? 'ren' : ''}`;
        }
        document.getElementById('summary-guests').textContent = guestsText;
        
        // Room details
        const selectedRoom = document.querySelector('input[name="room-selection"]:checked');
        let roomName = 'No room selected';
        let roomRate = '₹0';
        
        if (selectedRoom) {
            const roomOption = selectedRoom.closest('.room-option');
            roomName = roomOption.querySelector('h3').textContent;
            roomRate = roomOption.querySelector('.price').textContent;
        }
        
        document.getElementById('summary-room').textContent = roomName;
        document.getElementById('summary-rate').textContent = `${roomRate} per night`;
        
        // Guest information
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        document.getElementById('summary-name').textContent = `${firstName} ${lastName}`;
        document.getElementById('summary-email').textContent = document.getElementById('email').value;
        document.getElementById('summary-phone').textContent = document.getElementById('phone').value;
        
        // Payment calculation
        const rateValue = parseInt(roomRate.replace(/[^\d]/g, ''));
        const roomCharges = rateValue * nights;
        const taxes = Math.round(roomCharges * 0.18);
        const totalAmount = roomCharges + taxes;
        
        document.getElementById('summary-room-charges').textContent = `₹${roomCharges.toLocaleString()}`;
        document.getElementById('summary-taxes').textContent = `₹${taxes.toLocaleString()}`;
        document.getElementById('summary-total').textContent = `₹${totalAmount.toLocaleString()}`;
    }

    // Format date for display
    function formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // Room selection handling
    const roomSelections = document.querySelectorAll('input[name="room-selection"]');
    roomSelections.forEach(room => {
        room.addEventListener('change', function() {
            const roomOptions = document.querySelectorAll('.room-option');
            roomOptions.forEach(option => {
                option.classList.remove('selected');
            });
            
            if (this.checked) {
                this.closest('.room-option').classList.add('selected');
            }
        });
    });

    // Payment method selection
    const paymentOptions = document.querySelectorAll('.payment-option input[type="radio"]');
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            const paymentLabels = document.querySelectorAll('.payment-option');
            paymentLabels.forEach(label => {
                label.classList.remove('active');
            });
            
            if (this.checked) {
                this.closest('.payment-option').classList.add('active');
            }
        });
    });

    // Set min dates for check-in and check-out
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const checkInInput = document.getElementById('check-in');
    const checkOutInput = document.getElementById('check-out');
    
    if (checkInInput && checkOutInput) {
        const formatInputDate = date => {
            return date.toISOString().split('T')[0];
        };
        
        checkInInput.min = formatInputDate(today);
        checkOutInput.min = formatInputDate(tomorrow);
        
        // Update check-out min date when check-in changes
        checkInInput.addEventListener('change', function() {
            const newMinCheckout = new Date(this.value);
            newMinCheckout.setDate(newMinCheckout.getDate() + 1);
            checkOutInput.min = formatInputDate(newMinCheckout);
            
            // If current check-out date is before new min, update it
            if (new Date(checkOutInput.value) <= new Date(this.value)) {
                checkOutInput.value = formatInputDate(newMinCheckout);
            }
        });
    }

    // Accordion functionality for FAQs
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', function() {
            item.classList.toggle('active');
            
            const icon = this.querySelector('.accordion-icon i');
            icon.classList.toggle('fa-plus');
            icon.classList.toggle('fa-minus');
            
            const content = item.querySelector('.accordion-content');
            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = '0';
            }
        });
    });

    // Download confirmation
    const downloadBtn = document.getElementById('download-confirmation');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Your booking confirmation will be downloaded as a PDF.');
            // In a real implementation, this would generate and download a PDF
        });
    }

    // Initialize the current date for the booking form
    const currentDate = new Date("March 14, 2025");
    if (checkInInput && !checkInInput.value) {
        const defaultCheckIn = new Date(currentDate);
        defaultCheckIn.setDate(defaultCheckIn.getDate() + 7); // Default to 7 days from now
        checkInInput.value = formatInputDate(defaultCheckIn);
        
        const defaultCheckOut = new Date(defaultCheckIn);
        defaultCheckOut.setDate(defaultCheckOut.getDate() + 3); // Default to 3 nights stay
        checkOutInput.value = formatInputDate(defaultCheckOut);
    }

    function formatInputDate(date) {
        return date.toISOString().split('T')[0];
    }

    // GSAP animations for page elements
    if (typeof gsap !== 'undefined') {
        // Hero section animations
        gsap.from('.booking-hero-content', {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out'
        });
        
        // Booking steps animation
        gsap.from('.booking-step', {
            opacity: 0,
            y: 30,
            stagger: 0.2,
            duration: 0.8,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: '.booking-steps',
                start: 'top 80%'
            }
        });
        
        // Room options animation
        gsap.from('.room-option', {
            opacity: 0,
            y: 40,
            stagger: 0.3,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.available-rooms',
                start: 'top 80%'
            }
        });
        
        // Info cards animation
        gsap.from('.info-card', {
            opacity: 0,
            y: 30,
            stagger: 0.2,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.booking-info-grid',
                start: 'top 80%'
            }
        });
    }
});
