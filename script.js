/*
========================================
TELUGU DELICACIES WEBSITE JAVASCRIPT
========================================
Author: Telugu Delicacies
Description: Interactive functionality for responsive Telugu Delicacies website
Features: Smooth scrolling, form handling, animations, enhanced product showcase with rem-based scaling
Fonts: Montserrat (headers), Roboto (body text), Noto Sans Telugu (Telugu content)
Scaling: Responsive rem-based system with fluid typography using clamp()
Last Updated: 2024 - Updated for comprehensive font and scaling strategy
*/

/*
========================================
SMOOTH SCROLLING NAVIGATION
Functions for smooth page navigation
========================================
*/

/**
 * Smoothly scrolls to a specific section on the page
 * @param {string} sectionId - The ID of the section to scroll to
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        // Get header height to account for fixed positioning
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight - 20;
        
        // Perform smooth scroll
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

/*
========================================
PRODUCT DESCRIPTION DISPLAY
Interactive dropdown functionality for product categories
========================================
*/

/**
 * Shows or hides product descriptions based on dropdown selection
 * @param {HTMLElement} selectElement - The dropdown select element
 * @param {string} category - The product category identifier
 */
function showProductDescription(selectElement, category) {
    // FIXED: Enhanced dropdown functionality for Telugu text support
    console.log('Dropdown selection changed:', selectElement.value);
    
    // Hide all descriptions for this category first
    const categoryCard = selectElement.closest('.category-card');
    const allDescriptions = categoryCard.querySelectorAll('.product-description');
    
    allDescriptions.forEach(desc => {
        desc.style.display = 'none';
        // Remove any existing animation classes
        desc.classList.remove('fade-in');
    });
    
    // Show selected description with animation
    const selectedValue = selectElement.value;
    if (selectedValue) {
        const descriptionElement = document.getElementById(`${category}-${selectedValue}`);
        if (descriptionElement) {
            descriptionElement.style.display = 'block';
            // Add fade-in animation class
            setTimeout(() => {
                descriptionElement.classList.add('fade-in');
            }, 10);
            
            // FIXED: Log for debugging Telugu functionality
            console.log('Showing description for:', selectedValue);
            console.log('Description element found:', descriptionElement);
        }
    }
}

/*
========================================
CONTACT FORM HANDLING
Form submission, validation, and user feedback
========================================
*/

/**
 * Handles contact form submission with validation and user feedback
 * @param {Event} event - The form submit event
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Validate form before submission
    if (!validateForm(event.target)) {
        return;
    }
    
    // Get form data
    const formData = new FormData(event.target);
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value.trim();
    }
    
    // Show loading state
    const submitBtn = event.target.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call (replace with actual API endpoint)
    setTimeout(() => {
        // Show success message
        showSuccessMessage('Thank you for your message! We will get back to you soon.');
        
        // Reset form
        event.target.reset();
        
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Clear any validation errors
        clearFormErrors(event.target);
        
    }, 2000);
}

/**
 * Validates the entire contact form
 * @param {HTMLFormElement} form - The form element to validate
 * @returns {boolean} - True if form is valid, false otherwise
 */
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Shows a success message to the user
 * @param {string} message - The success message to display
 */
function showSuccessMessage(message) {
    // Create and show success message (you can customize this)
    alert(message);
    
    // Alternative: You could create a custom toast notification here
    // showToast(message, 'success');
}

/*
========================================
HEADER SCROLL EFFECTS
Dynamic header styling based on scroll position
========================================
*/

/**
 * Updates header appearance based on scroll position
 * Creates a more prominent header background when scrolling
 */
function updateHeaderOnScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    if (window.scrollY > 100) {
        // Scrolled state - more opaque background with blur effect
        header.style.background = 'linear-gradient(135deg, rgba(34,139,34,0.95), rgba(50,205,50,0.95))';
        header.style.backdropFilter = 'blur(10px)';
        header.style.webkitBackdropFilter = 'blur(10px)'; // Safari support
    } else {
        // Top of page state - original gradient
        header.style.background = 'linear-gradient(135deg, #228B22, #32CD32)';
        header.style.backdropFilter = 'none';
        header.style.webkitBackdropFilter = 'none';
    }
}

/*
========================================
SCROLL ANIMATIONS
Intersection Observer for element animations on scroll
========================================
*/

/**
 * Initializes scroll-triggered animations using Intersection Observer
 * Animates elements when they come into viewport
 */
function initializeScrollAnimations() {
    // Configuration for the intersection observer
    const observerOptions = {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px' // Trigger 50px before element enters viewport
    };
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Element is in viewport - animate in
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate
    const animateElements = document.querySelectorAll('.category-card, .info-card, .product-item');
    animateElements.forEach(el => {
        // Set initial state for animation
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        // Start observing the element
        observer.observe(el);
    });
}

/*
========================================
PRODUCT SHOWCASE CONTROLS
Interactive controls for the product ticker
========================================
*/

/**
 * Initializes hover and touch controls for the product showcase
 * Pauses animation on interaction for better user experience
 * Now works seamlessly with rem-based responsive scaling
 */
function initializeProductShowcaseControls() {
    const productScroll = document.getElementById('productScroll');
    const scrollContainer = productScroll?.parentElement;
    if (!productScroll) return;
    
    // Pause animation on mouse hover for better desktop UX
    productScroll.addEventListener('mouseenter', () => {
        productScroll.style.animationPlayState = 'paused';
    });
    
    // Resume animation when mouse leaves
    productScroll.addEventListener('mouseleave', () => {
        productScroll.style.animationPlayState = 'running';
    });
    
    // ENHANCED: Advanced touch scrolling support
    // Variables to track touch interaction state
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let isScrolling = false;
    let autoScrollPaused = false;
    let scrollTimeout;
    
    // Touch start handler - detects beginning of touch interaction
    scrollContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
        isScrolling = false;
        
        // Pause auto-scroll animation during touch interaction
        if (!autoScrollPaused) {
            productScroll.style.animationPlayState = 'paused';
            autoScrollPaused = true;
        }
        
        // Clear any existing auto-resume timeout
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
    }, { passive: true });
    
    // Touch move handler for swipe detection
    // Handles horizontal swipe gestures for manual scrolling
    scrollContainer.addEventListener('touchmove', (e) => {
        if (!touchStartX) return;
        
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const deltaX = touchStartX - touchX;
        const deltaY = touchStartY - touchY;
        
        // Determine if this is a horizontal swipe (not vertical scroll)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
            if (!isScrolling) {
                isScrolling = true;
                scrollContainer.classList.add('manual-scroll');
                productScroll.classList.add('manual-control');
            }
            
            // Prevent default page scrolling during horizontal swipe
            e.preventDefault();
            
            // Apply smooth manual scrolling with resistance factor
            scrollContainer.scrollLeft += deltaX * 0.8; // Smooth scrolling factor
            touchStartX = touchX; // Update start position for continuous scrolling
        }
    }, { passive: false });
    
    // Touch end handler
    // Handles end of touch interaction and auto-resume logic
    scrollContainer.addEventListener('touchend', (e) => {
        const touchEndTime = Date.now();
        const touchDuration = touchEndTime - touchStartTime;
        
        // Reset touch tracking variables
        touchStartX = 0;
        touchStartY = 0;
        
        // Remove manual control styling classes
        scrollContainer.classList.remove('manual-scroll');
        productScroll.classList.remove('manual-control');
        
        // Resume auto-scroll after a delay to allow user to finish viewing
        scrollTimeout = setTimeout(() => {
            if (autoScrollPaused) {
                productScroll.style.animationPlayState = 'running';
                autoScrollPaused = false;
                isScrolling = false;
            }
        }, 2000); // Resume after 2 seconds of no interaction
        
    }, { passive: true });
    
    // Handle scroll events for better UX
    // Manages auto-resume during manual scrolling with mouse/trackpad
    let scrollEndTimeout;
    scrollContainer.addEventListener('scroll', () => {
        // Clear existing scroll end detection timeout
        if (scrollEndTimeout) {
            clearTimeout(scrollEndTimeout);
        }
        
        // Set new timeout to detect when scrolling has stopped
        scrollEndTimeout = setTimeout(() => {
            // Auto-resume animation if not being manually controlled
            if (!isScrolling && autoScrollPaused) {
                productScroll.style.animationPlayState = 'running';
                autoScrollPaused = false;
            }
        }, 1500); // Resume after 1.5 seconds of scroll inactivity
    }, { passive: true });
    
    // Enhanced wheel scrolling for desktop
    scrollContainer.addEventListener('wheel', (e) => {
        // Pause animation during wheel scroll
        productScroll.style.animationPlayState = 'paused';
        autoScrollPaused = true;
        
        // Horizontal scroll with wheel
        scrollContainer.scrollLeft += e.deltaY * 0.5;
        e.preventDefault();
        
        // Clear existing timeout
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        // Resume animation after wheel scroll ends
        scrollTimeout = setTimeout(() => {
            productScroll.style.animationPlayState = 'running';
            autoScrollPaused = false;
        }, 2000);
        
    }, { passive: false });
}

/*
========================================
FORM VALIDATION SYSTEM
Real-time form validation with user feedback
========================================
*/

/**
 * Validates an individual form field
 * @param {Event} event - The field blur or input event
 * @returns {boolean} - True if field is valid, false otherwise
 */
function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    // Remove existing error styling
    field.classList.remove('error');
    clearFieldError(field);
    
    // Validation rules
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    if (field.type === 'tel' && value && !isValidPhone(value)) {
        showFieldError(field, 'Please enter a valid phone number');
        return false;
    }
    
    return true;
}

/**
 * Clears field error state and message
 * @param {HTMLElement} field - The form field element
 */
function clearFieldError(field) {
    field.classList.remove('error');
    const errorMsg = field.parentNode.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

/**
 * Displays error message for a form field
 * @param {HTMLElement} field - The form field element
 * @param {string} message - The error message to display
 */
function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    clearFieldError(field);
    
    // Add new error message
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.setAttribute('role', 'alert'); // Accessibility
    
    field.parentNode.appendChild(errorElement);
}

/**
 * Clears all form errors
 * @param {HTMLFormElement} form - The form element
 */
function clearFormErrors(form) {
    const errorElements = form.querySelectorAll('.error-message');
    const errorFields = form.querySelectorAll('.error');
    
    errorElements.forEach(el => el.remove());
    errorFields.forEach(field => field.classList.remove('error'));
}

/**
 * Validates email address format
 * @param {string} email - The email address to validate
 * @returns {boolean} - True if email is valid, false otherwise
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates phone number format
 * @param {string} phone - The phone number to validate
 * @returns {boolean} - True if phone is valid, false otherwise
 */
function isValidPhone(phone) {
    // Allow international format, digits, spaces, hyphens, and parentheses
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

/*
========================================
PERFORMANCE OPTIMIZATION
Debouncing scroll events for better performance
========================================
*/

/**
 * Debounces a function to prevent excessive calls
 * @param {Function} func - The function to debounce
 * @param {number} wait - The delay in milliseconds
 * @returns {Function} - The debounced function
 */
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

/*
========================================
IMAGE LOADING OPTIMIZATION
Lazy loading and error handling for images
========================================
*/

/**
 * Initializes image loading optimizations
 * Handles loading states and errors gracefully
 */
function initializeImageOptimizations() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Set initial opacity for loading animation
        if (!img.complete) {
            img.style.opacity = '0';
        }
        
        // Handle successful image load
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        
        // Handle image load errors
        img.addEventListener('error', () => {
            console.warn('Image failed to load:', img.src);
            // You could set a fallback image here
            // img.src = '/images/fallback.jpg';
        });
    });
}

/*
========================================
ACCESSIBILITY ENHANCEMENTS
Keyboard navigation and screen reader support
========================================
*/

/**
 * Enhances form accessibility
 * Adds proper ARIA labels and keyboard navigation
 */
function enhanceAccessibility() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Add field validation event listeners
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
        
        // Enhance keyboard navigation
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && input.type !== 'textarea') {
                e.preventDefault();
                const nextField = getNextFormField(input);
                if (nextField) {
                    nextField.focus();
                } else {
                    // Last field - focus submit button
                    const submitBtn = form.querySelector('.submit-btn');
                    if (submitBtn) submitBtn.focus();
                }
            }
        });
    });
}

/**
 * Gets the next form field for keyboard navigation
 * @param {HTMLElement} currentField - The current form field
 * @returns {HTMLElement|null} - The next form field or null
 */
function getNextFormField(currentField) {
    const form = currentField.closest('form');
    const fields = Array.from(form.querySelectorAll('input, select, textarea'));
    const currentIndex = fields.indexOf(currentField);
    return fields[currentIndex + 1] || null;
}

/*
========================================
MOBILE MENU FUNCTIONALITY
Enhanced mobile navigation (for future use)
========================================
*/

/**
 * Initializes mobile menu functionality
 * Currently handles navigation button interactions
 */
function initializeMobileInteractions() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        // Add touch feedback
        btn.addEventListener('touchstart', () => {
            btn.style.transform = 'scale(0.95)';
        });
        
        btn.addEventListener('touchend', () => {
            btn.style.transform = '';
        });
        
        // Handle click events
        btn.addEventListener('click', () => {
            // Add ripple effect or other feedback if desired
            addClickFeedback(btn);
        });
    });
}

/**
 * Adds visual feedback for button clicks
 * @param {HTMLElement} button - The button element
 */
function addClickFeedback(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 100);
}

/**
 * Enables smooth horizontal scrolling with momentum
 * @param {HTMLElement} container - The scroll container
 */
function enableSmoothScrolling(container) {
    let isScrolling = false;
    let scrollVelocity = 0;
    let lastScrollLeft = container.scrollLeft;
    let lastTime = Date.now();
    
    function updateMomentum() {
        if (isScrolling) {
            const now = Date.now();
            const deltaTime = now - lastTime;
            const deltaScroll = container.scrollLeft - lastScrollLeft;
            
            scrollVelocity = deltaScroll / deltaTime;
            lastScrollLeft = container.scrollLeft;
            lastTime = now;
            
            requestAnimationFrame(updateMomentum);
        } else if (Math.abs(scrollVelocity) > 0.1) {
            // Apply momentum scrolling
            container.scrollLeft += scrollVelocity * 16; // 16ms frame time
            scrollVelocity *= 0.95; // Friction
            requestAnimationFrame(updateMomentum);
        }
    }
    
    container.addEventListener('touchstart', () => {
        isScrolling = true;
        scrollVelocity = 0;
        lastScrollLeft = container.scrollLeft;
        lastTime = Date.now();
        updateMomentum();
    }, { passive: true });
    
    container.addEventListener('touchend', () => {
        isScrolling = false;
    }, { passive: true });
}

/*
========================================
MAIN INITIALIZATION
Sets up all functionality when the page loads
========================================
*/

/**
 * Main initialization function
 * Called when the DOM is fully loaded
 * Initializes all interactive features with rem-based responsive scaling
 */
function initializeWebsite() {
    // Initialize all interactive features for responsive design
    initializeScrollAnimations();
    initializeProductShowcaseControls();
    initializeImageOptimizations();
    enhanceAccessibility();
    initializeMobileInteractions();
    
    // Initialize enhanced smooth scrolling for product showcase
    const scrollContainer = document.querySelector('.scroll-container');
    if (scrollContainer) {
        enableSmoothScrolling(scrollContainer);
        console.log('Enhanced touch scrolling enabled for product showcase with rem-based scaling');
    }
    
    // Set up optimized scroll event listener with debouncing for performance
    const debouncedScrollHandler = debounce(updateHeaderOnScroll, 10);
    window.addEventListener('scroll', debouncedScrollHandler);
    
    // Add smooth page entrance animation for better UX
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Log successful initialization with font information
    console.log('Telugu Delicacies website initialized successfully with Montserrat headers and Roboto body text');
}

/*
========================================
EVENT LISTENERS
Set up main event listeners when DOM is ready
========================================
*/

// Initialize everything when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeWebsite);

// Handle page visibility changes (for performance optimization)
document.addEventListener('visibilitychange', () => {
    const productScroll = document.getElementById('productScroll');
    if (productScroll) {
        if (document.hidden) {
            // Page is hidden - pause animations to save resources
            productScroll.style.animationPlayState = 'paused';
        } else {
            // Page is visible - resume animations
            productScroll.style.animationPlayState = 'running';
        }
    }
});

// Handle window resize events
window.addEventListener('resize', debounce(() => {
    // Recalculate any layout-dependent values if needed
    console.log('Window resized - layouts may need adjustment');
}, 250));

// Handle connection changes (for progressive enhancement)
if ('connection' in navigator) {
    navigator.connection.addEventListener('change', () => {
        // Could adjust image quality or disable heavy animations on slow connections
        console.log('Connection changed:', navigator.connection.effectiveType);
    });
}

/*
========================================
UTILITY FUNCTIONS
Helper functions for various website features
========================================
*/

/**
 * Randomizes the order of products in the showcase section
 * Shuffles the product items for variety on each page load
 */
function randomizeProductShowcase() {
    const productScroll = document.getElementById('productScroll');
    if (!productScroll) return;
    
    const items = Array.from(productScroll.children);
    const firstHalf = items.slice(0, Math.floor(items.length / 2));
    const secondHalf = items.slice(Math.floor(items.length / 2));
    
    // Shuffle first half (main products)
    const shuffled = shuffleArray([...firstHalf]);
    
    // Clear container
    productScroll.innerHTML = '';
    
    // Add shuffled items
    shuffled.forEach(item => productScroll.appendChild(item));
    
    // Add duplicate items for infinite loop
    shuffled.forEach(item => {
        const duplicate = item.cloneNode(true);
        productScroll.appendChild(duplicate);
    });
}

/**
 * Fisher-Yates shuffle algorithm for array randomization
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled array
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Utility function to safely query DOM elements
 * @param {string} selector - CSS selector
 * @returns {Element|null} - The element or null if not found
 */
function safeQuerySelector(selector) {
    try {
        return document.querySelector(selector);
    } catch (error) {
        console.warn('Invalid selector:', selector, error);
        return null;
    }
}

/**
 * Utility function to format phone numbers for display
 * @param {string} phone - Raw phone number
 * @returns {string} - Formatted phone number
 */
function formatPhoneNumber(phone) {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Format based on length
    if (digits.length === 10) {
        return digits.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
    
    return phone; // Return as-is if not standard format
}

// Export functions for potential use in other scripts (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        scrollToSection,
        showProductDescription,
        handleFormSubmit,
        validateField,
        isValidEmail,
        isValidPhone,
        debounce
    };
}
