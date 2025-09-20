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
        const targetPosition = section.offsetTop - headerHeight - 10;
        
        // Perform smooth scroll
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Make scrollToSection globally accessible for inline onclick handlers
window.scrollToSection = scrollToSection;

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
    
    // Show loading state
    const submitBtn = event.target.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Get form data for Netlify
    const formData = new FormData(event.target);
    
    // Submit to Netlify
    fetch('/', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
    })
    .then(() => {
        // Show success message
        showSuccessMessage('Thank you for your message! We will get back to you soon.');
        
        // Reset form
        event.target.reset();
        
        // Clear any validation errors
        clearFormErrors(event.target);
    })
    .catch((error) => {
        console.error('Form submission error:', error);
        showErrorMessage('Sorry, there was an error sending your message. Please try again or contact us directly.');
    })
    .finally(() => {
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
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
    // Create a toast notification for better UX
    showToast(message, 'success');
}

/**
 * Shows an error message to the user
 * @param {string} message - The error message to display
 */
function showErrorMessage(message) {
    // Create a toast notification for errors
    showToast(message, 'error');
}

/**
 * Creates and displays a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of toast ('success' or 'error')
 */
function showToast(message, type = 'success') {
    // Remove any existing toasts
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add toast styles if not already added
    if (!document.querySelector('#toast-styles')) {
        const styles = document.createElement('style');
        styles.id = 'toast-styles';
        styles.textContent = `
            .toast-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                padding: 1rem;
                display: flex;
                align-items: center;
                gap: 1rem;
                z-index: 10000;
                max-width: 400px;
                animation: slideInRight 0.3s ease;
                border-left: 4px solid;
            }
            
            .toast-success {
                border-left-color: #228B22;
                color: #228B22;
            }
            
            .toast-error {
                border-left-color: #dc3545;
                color: #dc3545;
            }
            
            .toast-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                flex: 1;
            }
            
            .toast-close {
                background: none;
                border: none;
                cursor: pointer;
                color: #666;
                padding: 0.25rem;
                border-radius: 4px;
                transition: background-color 0.2s ease;
            }
            
            .toast-close:hover {
                background-color: rgba(0,0,0,0.1);
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @media (max-width: 768px) {
                .toast-notification {
                    left: 20px;
                    right: 20px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add toast to page
    document.body.appendChild(toast);
    
    // Auto-remove toast after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

/*
========================================
HEADER SCROLL EFFECTS
Dynamic header styling based on scroll position
========================================
*/

/**
 * Updates header appearance based on scroll position
 */
function updateHeaderOnScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    const scrollY = window.scrollY;
    
    if (scrollY > 20) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.borderBottom = '1px solid rgba(0, 0, 0, 0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.9)';
        header.style.borderBottom = '1px solid rgba(0, 0, 0, 0.1)';
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
    
    // Initialize showcase mode management
    initializeShowcaseMode();
    
    // Ensure ticker animation is running by default
    productScroll.style.animationPlayState = 'running';
    
    // Pause animation on mouse hover for better desktop UX
    productScroll.addEventListener('mouseenter', () => {
        productScroll.style.animationPlayState = 'paused';
    });
    
    // Resume animation when mouse leaves
    productScroll.addEventListener('mouseleave', () => {
        productScroll.style.animationPlayState = 'running';
    });
    
    // Touch interaction handling - only pause when user actively interacts
    let isUserInteracting = false;
    let interactionTimeout;
    
    const handleInteractionStart = () => {
        if (!isUserInteracting) {
            productScroll.style.animationPlayState = 'paused';
            isUserInteracting = true;
        }
        
        // Clear any existing timeout
        if (interactionTimeout) {
            clearTimeout(interactionTimeout);
        }
    };
    
    const handleInteractionEnd = () => {
        // Resume ticker animation after brief delay
        interactionTimeout = setTimeout(() => {
            productScroll.style.animationPlayState = 'running';
            isUserInteracting = false;
        }, 2000); // Resume ticker after 2 seconds of inactivity
    };
    
    // Touch events - pause ticker during active touch interaction
    scrollContainer.addEventListener('touchstart', handleInteractionStart, { passive: true });
    scrollContainer.addEventListener('touchend', handleInteractionEnd, { passive: true });
    scrollContainer.addEventListener('touchcancel', handleInteractionEnd, { passive: true });
    
    // Only pause ticker if user is actively scrolling (not just from ticker animation)
    let lastScrollLeft = scrollContainer.scrollLeft;
    let scrollCheckTimeout;
    
    scrollContainer.addEventListener('scroll', () => {
        const currentScrollLeft = scrollContainer.scrollLeft;
        
        // Only consider it user interaction if scroll position actually changed significantly
        if (Math.abs(currentScrollLeft - lastScrollLeft) > 5) {
            handleInteractionStart();
            
            // Clear previous timeout and set new one
            if (scrollCheckTimeout) {
                clearTimeout(scrollCheckTimeout);
            }
            
            scrollCheckTimeout = setTimeout(() => {
                handleInteractionEnd();
            }, 1000); // Resume ticker 1 second after scrolling stops
        }
        
        lastScrollLeft = currentScrollLeft;
    }, { passive: true });
    
    // Wheel events for desktop
    scrollContainer.addEventListener('wheel', (e) => {
        handleInteractionStart();
        
        // Allow smooth horizontal scrolling with wheel
        scrollContainer.scrollLeft += e.deltaY * 0.5;
        
        // Resume ticker after wheel interaction
        if (interactionTimeout) {
            clearTimeout(interactionTimeout);
        }
        interactionTimeout = setTimeout(() => {
            productScroll.style.animationPlayState = 'running';
            isUserInteracting = false;
        }, 1500);
        
        e.preventDefault();
    });
}

/*
========================================
SHOWCASE MODE MANAGEMENT
Intelligent automatic/manual mode switching
========================================
*/

/**
 * Initializes the intelligent showcase mode system
 * Handles automatic/manual mode transitions
 */
function initializeShowcaseMode() {
    const productScroll = document.getElementById('productScroll');
    const scrollContainer = productScroll?.parentElement;
    if (!productScroll || !scrollContainer) return;
    
    let isManualMode = false;
    let autoReturnTimeout;
    let hoverTimeout;
    
    // Configuration
    const config = {
        autoReturnDelay: 3000,
        hoverActivationDelay: 500,
        transitionDuration: 300
    };
    
    /**
     * Switches to manual mode
     */
    function activateManualMode() {
        if (isManualMode) return;
        
        isManualMode = true;
        productScroll.style.animationPlayState = 'paused';
        scrollContainer.style.cursor = 'grab';
        
        // Clear any existing timeout
        if (autoReturnTimeout) {
            clearTimeout(autoReturnTimeout);
        }
        
        console.log('Manual mode activated');
    }
    
    /**
     * Returns to automatic mode
     */
    function activateAutoMode() {
        if (!isManualMode) return;
        
        isManualMode = false;
        productScroll.style.animationPlayState = 'running';
        scrollContainer.style.cursor = '';
        
        console.log('Auto mode activated');
    }
    
    /**
     * Sets up auto-return timer
     */
    function setupAutoReturn() {
        if (autoReturnTimeout) {
            clearTimeout(autoReturnTimeout);
        }
        
        autoReturnTimeout = setTimeout(() => {
            activateAutoMode();
        }, config.autoReturnDelay);
    }
    
    // Hover intent detection (desktop)
    scrollContainer.addEventListener('mouseenter', () => {
        hoverTimeout = setTimeout(() => {
            activateManualMode();
        }, config.hoverActivationDelay);
    });
    
    scrollContainer.addEventListener('mouseleave', () => {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
        }
        setupAutoReturn();
    });
    
    // Touch intent detection (mobile)
    scrollContainer.addEventListener('touchstart', () => {
        activateManualMode();
    }, { passive: true });
    
    scrollContainer.addEventListener('touchend', () => {
        setupAutoReturn();
    }, { passive: true });
    
    // Scroll wheel intent detection
    scrollContainer.addEventListener('wheel', (e) => {
        activateManualMode();
        scrollContainer.scrollLeft += e.deltaY * 0.5;
        setupAutoReturn();
        e.preventDefault();
    });
    
    // Focus intent detection (accessibility)
    scrollContainer.addEventListener('focus', () => {
        activateManualMode();
    });
    
    scrollContainer.addEventListener('blur', () => {
        setupAutoReturn();
    });
    
    // Manual scrolling detection
    let lastScrollLeft = scrollContainer.scrollLeft;
    scrollContainer.addEventListener('scroll', () => {
        const currentScrollLeft = scrollContainer.scrollLeft;
        
        if (Math.abs(currentScrollLeft - lastScrollLeft) > 5) {
            activateManualMode();
            setupAutoReturn();
        }
        
        lastScrollLeft = currentScrollLeft;
    }, { passive: true });
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

/*
========================================
HEADER NAVIGATION FUNCTIONALITY
Complete header navigation with WhatsApp integration
========================================
*/

// WhatsApp catalog configuration
const WHATSAPP_CATALOG_URL = "https://wa.me/c/919618519191";

/**
 * Check if user is on mobile device
 * @returns {boolean} True if mobile device detected
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
}

/**
 * Handle WhatsApp button click
 * Mobile: Direct to catalog, Desktop: Show QR modal
 */
function handleWhatsAppClick() {
    if (isMobileDevice()) {
        // Direct to WhatsApp catalog on mobile
        window.open(WHATSAPP_CATALOG_URL, '_blank', 'noopener,noreferrer');
    } else {
        // Show QR code modal on desktop
        showWhatsAppQR();
    }
}

/**
 * Show WhatsApp QR code modal for desktop users
 */
function showWhatsAppQR() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('whatsappQRModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'whatsappQRModal';
        modal.className = 'whatsapp-qr-modal';
        modal.innerHTML = `
            <div class="whatsapp-qr-backdrop"></div>
            <div class="whatsapp-qr-content">
                <button class="whatsapp-qr-close" onclick="closeWhatsAppQR()">
                    <i class="fas fa-times"></i>
                </button>
                <div class="whatsapp-qr-header">
                    <i class="fab fa-whatsapp"></i>
                    <h3>Scan to Open Catalog</h3>
                    <p>Scan this QR code with your phone to view our products on WhatsApp</p>
                </div>
                <div class="whatsapp-qr-code">
                    <canvas id="qrCanvas"></canvas>
                </div>
                <div class="whatsapp-qr-footer">
                    <p>Or visit: <a href="${WHATSAPP_CATALOG_URL}" target="_blank">${WHATSAPP_CATALOG_URL}</a></p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add modal styles
        if (!document.getElementById('whatsapp-qr-styles')) {
            const styles = document.createElement('style');
            styles.id = 'whatsapp-qr-styles';
            styles.textContent = `
                .whatsapp-qr-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 1;
                    visibility: visible;
                    transition: all 0.3s ease;
                }
                .whatsapp-qr-modal.hidden {
                    opacity: 0;
                    visibility: hidden;
                }
                .whatsapp-qr-backdrop {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(8px);
                }
                .whatsapp-qr-content {
                    position: relative;
                    background: white;
                    border-radius: 1rem;
                    padding: 2rem;
                    max-width: 400px;
                    width: 90vw;
                    text-align: center;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                }
                .whatsapp-qr-close {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #666;
                    transition: color 0.2s ease;
                }
                .whatsapp-qr-close:hover {
                    color: #333;
                }
                .whatsapp-qr-header i {
                    font-size: 3rem;
                    color: #25D366;
                    margin-bottom: 1rem;
                }
                .whatsapp-qr-header h3 {
                    margin: 0 0 0.5rem 0;
                    color: #333;
                }
                .whatsapp-qr-header p {
                    margin: 0 0 2rem 0;
                    color: #666;
                    font-size: 0.9rem;
                }
                .whatsapp-qr-code {
                    margin: 2rem 0;
                }
                .whatsapp-qr-code canvas {
                    max-width: 200px;
                    height: auto;
                }
                .whatsapp-qr-footer p {
                    font-size: 0.8rem;
                    color: #666;
                    margin: 0;
                }
                .whatsapp-qr-footer a {
                    color: #0077B6;
                    text-decoration: none;
                }
            `;
            document.head.appendChild(styles);
        }
    }
    
    // Show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Generate QR code if library is available
    if (typeof QRCode !== 'undefined') {
        const canvas = document.getElementById('qrCanvas');
        if (canvas) {
            QRCode.toCanvas(canvas, WHATSAPP_CATALOG_URL, { width: 200 }, function (error) {
                if (error) console.error('QR Code generation error:', error);
            });
        }
    } else {
        // Fallback if QR library not available
        document.querySelector('.whatsapp-qr-code').innerHTML = `
            <p style="color: #666; font-size: 0.9rem;">QR Code library not loaded.<br>
            <a href="${WHATSAPP_CATALOG_URL}" target="_blank" style="color: #25D366;">Click here to open catalog</a></p>
        `;
    }
}

/*
========================================
Close WhatsApp QR Modal
========================================
*/
function closeWhatsAppQR() {
    const modal = document.getElementById('whatsappQRModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

/**
 * Toggle mobile navigation menu
 */
function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    
    if (!mobileNav || !hamburgerBtn) return;
    
    const isOpen = mobileNav.classList.contains('show');
    
    if (isOpen) {
        mobileNav.classList.remove('show');
        hamburgerBtn.classList.remove('active');
        document.body.style.overflow = '';
    } else {
        mobileNav.classList.add('show');
        hamburgerBtn.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Close mobile navigation menu
 */
function closeMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    
    if (!mobileNav || !hamburgerBtn) return;
    
    mobileNav.classList.remove('show');
    hamburgerBtn.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Handle navigation button clicks
 * @param {string} target - Target section to scroll to
 */
function handleNavigation(target) {
    scrollToSection(target);
    closeMobileMenu();
}

/**
 * Initialize header navigation functionality
 */
function initializeHeaderNavigation() {
    // Hamburger menu toggle
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Desktop navigation buttons
    const productsBtn = document.getElementById('productsBtn');
    const contactBtn = document.getElementById('contactBtn');
    const whatsappBtn = document.getElementById('whatsappBtn');
    
    if (productsBtn) {
        productsBtn.addEventListener('click', () => handleNavigation('products'));
    }
    
    if (contactBtn) {
        contactBtn.addEventListener('click', () => handleNavigation('contact'));
    }
    
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', handleWhatsAppClick);
    }
    
    // Mobile navigation buttons
    const mobileProductsBtn = document.getElementById('mobileProductsBtn');
    const mobileContactBtn = document.getElementById('mobileContactBtn');
    const mobileWhatsappBtn = document.getElementById('mobileWhatsappBtn');
    
    if (mobileProductsBtn) {
        mobileProductsBtn.addEventListener('click', () => handleNavigation('products'));
    }
    
    if (mobileContactBtn) {
        mobileContactBtn.addEventListener('click', () => handleNavigation('contact'));
    }
    
    if (mobileWhatsappBtn) {
        mobileWhatsappBtn.addEventListener('click', handleWhatsAppClick);
    }
    
    // Click outside to close mobile menu
    document.addEventListener('click', (e) => {
        const mobileNav = document.getElementById('mobileNav');
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        
        if (!mobileNav || !hamburgerBtn) return;
        
        const isMenuOpen = mobileNav.classList.contains('show');
        const isClickOnMenu = mobileNav.contains(e.target);
        const isClickOnHamburger = hamburgerBtn.contains(e.target);
        
        if (isMenuOpen && !isClickOnMenu && !isClickOnHamburger) {
            closeMobileMenu();
        }
    });
    
    // Click outside to close WhatsApp QR modal
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('whatsappQRModal');
        if (modal && e.target.classList.contains('whatsapp-qr-backdrop')) {
            closeWhatsAppQR();
        }
    });
    
    // ESC key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
            closeWhatsAppQR();
        }
    });
}

/*
========================================
MAIN INITIALIZATION FUNCTION
========================================
*/

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize header navigation
    initializeHeaderNavigation();
    
    // Initialize other functionality
    initializeScrollAnimations();
    initializeProductShowcaseControls();
    initializeMobileInteractions();
    enhanceAccessibility();
    initializeImageOptimizations();
    
    // Setup form validation if contact form exists
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    console.log('All functionality initialized successfully');
});

// Handle page visibility changes (for performance optimization)
document.addEventListener('visibilitychange', () => {
    const productScroll = document.getElementById('productScroll');
    
    if (productScroll) {
        if (document.hidden) {
            // Page is hidden - pause animations to save resources
            productScroll.style.animationPlayState = 'paused';
        } else {
            // Page is visible - resume ticker animation
            productScroll.style.animationPlayState = 'running';
        }
    }
});

// Add scroll header effects
let lastScrollY = window.scrollY;
// Removed scroll effects to keep header persistent as requested

// Handle connection changes (for progressive enhancement)
if ('connection' in navigator) {
    navigator.connection.addEventListener('change', () => {
        // Could adjust image quality or disable heavy animations on slow connections
        console.log('Connection changed:', navigator.connection.effectiveType);
    });
}

// Make functions globally available
window.closeWhatsAppQR = closeWhatsAppQR;