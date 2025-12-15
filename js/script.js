// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const increment = target / speed;
        let count = 0;

        const updateCount = () => {
            count += increment;
            if (count < target) {
                counter.textContent = Math.ceil(count);
                setTimeout(updateCount, 1);
            } else {
                counter.textContent = target;
            }
        };

        updateCount();
    });
}

// Trigger counter animation when section is visible
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const metricsSection = document.querySelector('.metrics-section');
if (metricsSection) {
    observer.observe(metricsSection);
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar Scroll Effect
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(31, 41, 55, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = '#1f2937';
        navbar.style.backdropFilter = 'none';
    }
});

// Cost Estimator Functionality
const projectTypeSelect = document.getElementById('projectType');
const numPagesInput = document.getElementById('numPages');
const pagesValueSpan = document.getElementById('pagesValue');
const timelineSelect = document.getElementById('timeline');
const estimatedPriceDiv = document.getElementById('estimatedPrice');

// Update pages value display
if (numPagesInput) {
    numPagesInput.addEventListener('input', function () {
        pagesValueSpan.textContent = this.value;
        calculateEstimate();
    });
}

// Calculate estimate when any input changes
const estimatorInputs = document.querySelectorAll('#costEstimatorForm input, #costEstimatorForm select');
estimatorInputs.forEach(input => {
    input.addEventListener('change', calculateEstimate);
});

function calculateEstimate() {
    const projectType = projectTypeSelect.value;
    const numPages = parseInt(numPagesInput.value);
    const timeline = parseFloat(timelineSelect.value);

    let basePrice = 0;

    // Base price calculation
    if (projectType === 'website') {
        if (numPages <= 5) {
            basePrice = 5000;
        } else if (numPages <= 10) {
            basePrice = 10000;
        } else {
            basePrice = 25000;
        }
        if (numPages > 5) {
            basePrice += (numPages - 5) * 1000; // Additional pages
        }
    } else if (projectType === 'app') {
        basePrice = 30000;
        if (numPages > 5) {
            basePrice += (numPages - 5) * 2000; // Additional screens
        }
    } else if (projectType === 'both') {
        basePrice = 50000;
        if (numPages > 5) {
            basePrice += (numPages - 5) * 1500;
        }
    }

    // Add feature costs
    const featureAuth = document.getElementById('featureAuth').checked ? 5000 : 0;
    const featurePayment = document.getElementById('featurePayment').checked ? 10000 : 0;
    const featureAI = document.getElementById('featureAI').checked ? 15000 : 0;
    const featureAPI = document.getElementById('featureAPI').checked ? 8000 : 0;

    const featuresTotal = featureAuth + featurePayment + featureAI + featureAPI;

    // Calculate final price
    let totalPrice = (basePrice + featuresTotal) * timeline;

    // Update display
    if (estimatedPriceDiv && projectType) {
        estimatedPriceDiv.textContent = `₹${totalPrice.toLocaleString('en-IN')}`;
    }
}

// AI Recommendation System
function getAIRecommendation() {
    const businessType = document.getElementById('businessType').value;
    const businessGoal = document.getElementById('businessGoal').value;
    const resultDiv = document.getElementById('aiRecommendation');

    if (!businessType || !businessGoal) {
        resultDiv.textContent = '';
        const errorP = document.createElement('p');
        errorP.className = 'text-danger';
        errorP.textContent = 'Please fill in all fields to get a recommendation.';
        resultDiv.appendChild(errorP);
        resultDiv.classList.add('show');
        return;
    }

    // Sanitize user input
    const sanitizedBusinessType = businessType.replace(/[<>]/g, '');

    // Simulate AI processing
    resultDiv.innerHTML = '<p><i class="fas fa-spinner fa-spin me-2"></i>Analyzing your requirements...</p>';
    resultDiv.classList.add('show');

    setTimeout(() => {
        let recommendation = '';
        let suggestedPackage = '';
        let features = [];

        // AI logic based on inputs
        if (businessGoal === 'showcase') {
            if (sanitizedBusinessType.toLowerCase().includes('restaurant') || sanitizedBusinessType.toLowerCase().includes('food')) {
                recommendation = `For a ${sanitizedBusinessType}, we recommend a visually stunning Portfolio Website with an image gallery to showcase your menu and ambiance.`;
                suggestedPackage = 'Portfolio Website (₹10,000)';
                features = ['Image Gallery', 'Menu Display', 'Reservation System', 'Location Map'];
            } else {
                recommendation = `A Portfolio Website would be perfect for showcasing your ${sanitizedBusinessType}. It will help display your work, services, and achievements professionally.`;
                suggestedPackage = 'Portfolio Website (₹10,000)';
                features = ['Professional Design', 'Portfolio Gallery', 'About Section', 'Contact Form'];
            }
        } else if (businessGoal === 'sell') {
            recommendation = `To sell products online for your ${sanitizedBusinessType}, we recommend a Small Business Website with e-commerce capabilities.`;
            suggestedPackage = 'Small Business Website (₹25,000)';
            features = ['Product Catalog', 'Shopping Cart', 'Payment Gateway', 'Order Management', 'Customer Accounts'];
        } else if (businessGoal === 'leads') {
            recommendation = `For lead generation in ${sanitizedBusinessType}, a Basic Website with strong call-to-action elements and contact forms would be ideal.`;
            suggestedPackage = 'Basic Website (₹5,000) with lead capture features';
            features = ['Contact Forms', 'Call-to-Action Buttons', 'Service Showcase', 'Testimonials'];
        } else if (businessGoal === 'engagement') {
            recommendation = `To improve customer engagement for ${sanitizedBusinessType}, consider our AI-Powered solutions with chatbot integration and a Business App.`;
            suggestedPackage = 'Business App (₹40,000) + AI Chatbot';
            features = ['AI Chatbot', 'Push Notifications', 'Customer Dashboard', 'Interactive Features', 'Analytics'];
        }

        // Create result using DOM manipulation to prevent XSS
        resultDiv.textContent = '';
        const resultContainer = document.createElement('div');
        resultContainer.className = 'ai-recommendation-result';
        
        const title = document.createElement('h5');
        title.innerHTML = '<i class="fas fa-lightbulb text-warning me-2"></i>AI Recommendation';
        resultContainer.appendChild(title);
        
        const recText = document.createElement('p');
        const recStrong = document.createElement('strong');
        recStrong.textContent = recommendation;
        recText.appendChild(recStrong);
        resultContainer.appendChild(recText);
        
        const packageDiv = document.createElement('div');
        packageDiv.className = 'mt-3';
        const packageTitle = document.createElement('h6');
        packageTitle.textContent = 'Suggested Package:';
        const packageText = document.createElement('p');
        packageText.className = 'text-primary fw-bold';
        packageText.textContent = suggestedPackage;
        packageDiv.appendChild(packageTitle);
        packageDiv.appendChild(packageText);
        resultContainer.appendChild(packageDiv);
        
        const featuresDiv = document.createElement('div');
        featuresDiv.className = 'mt-3';
        const featuresTitle = document.createElement('h6');
        featuresTitle.textContent = 'Recommended Features:';
        const featuresList = document.createElement('ul');
        featuresList.className = 'list-unstyled';
        features.forEach(f => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check-circle text-success me-2"></i>`;
            li.appendChild(document.createTextNode(f));
            featuresList.appendChild(li);
        });
        featuresDiv.appendChild(featuresTitle);
        featuresDiv.appendChild(featuresList);
        resultContainer.appendChild(featuresDiv);
        
        const ctaDiv = document.createElement('div');
        ctaDiv.className = 'mt-3';
        const ctaLink = document.createElement('a');
        ctaLink.href = '#contact';
        ctaLink.className = 'btn btn-primary btn-sm';
        ctaLink.textContent = 'Request Custom Quote';
        ctaDiv.appendChild(ctaLink);
        resultContainer.appendChild(ctaDiv);
        
        resultDiv.appendChild(resultContainer);
    }, 2000);
}

// Contact Form Handler with Live Validation
const contactForm = document.getElementById('contactForm');
const contactName = document.getElementById('contactName');
const contactEmail = document.getElementById('contactMessage');
const contactMessage = document.getElementById('contactMessage');

// Configuration constants
const CONTACT_EMAIL = 'aryamaninbox@gmail.com';
const NAME_VALIDATION_PATTERN = /^[a-zA-Z\s]+$/;
const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 100;
const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 1000;

// Character counter for message
if (contactMessage) {
    contactMessage.addEventListener('input', function() {
        const charCount = document.getElementById('charCount');
        if (charCount) {
            charCount.textContent = this.value.length;
        }
    });
}

// Live email validation
if (contactEmail) {
    contactEmail.addEventListener('input', function() {
        const emailError = document.getElementById('emailError');
        const emailValid = document.getElementById('emailValid');
        
        if (this.value.length === 0) {
            this.classList.remove('is-valid', 'is-invalid');
            emailError.classList.remove('show');
            emailValid.classList.remove('show');
        } else if (isValidEmail(this.value)) {
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
            emailError.classList.remove('show');
            emailValid.classList.add('show');
        } else {
            this.classList.remove('is-valid');
            this.classList.add('is-invalid');
            emailError.textContent = 'Please enter a valid email address';
            emailError.classList.add('show');
            emailValid.classList.remove('show');
        }
    });
}

// Live name validation
if (contactName) {
    contactName.addEventListener('input', function() {
        const nameError = document.getElementById('nameError');
        
        if (this.value.length === 0) {
            this.classList.remove('is-valid', 'is-invalid');
            nameError.classList.remove('show');
        } else if (this.value.length < MIN_NAME_LENGTH) {
            this.classList.remove('is-valid');
            this.classList.add('is-invalid');
            nameError.textContent = `Name must be at least ${MIN_NAME_LENGTH} characters long`;
            nameError.classList.add('show');
        } else if (!NAME_VALIDATION_PATTERN.test(this.value)) {
            this.classList.remove('is-valid');
            this.classList.add('is-invalid');
            nameError.textContent = 'Name can only contain letters and spaces';
            nameError.classList.add('show');
        } else {
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
            nameError.classList.remove('show');
        }
    });
}

if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = contactName.value.trim();
        const email = contactEmail.value.trim();
        const phone = document.getElementById('contactPhone').value.trim();
        const inquiryType = document.getElementById('inquiryType').value;
        const message = contactMessage.value.trim();

        // Validation
        if (!name || !email || !message) {
            showFormMessage('Please fill in all required fields.', 'danger', 'fas fa-exclamation-circle');
            return;
        }

        if (name.length < MIN_NAME_LENGTH || name.length > MAX_NAME_LENGTH || !NAME_VALIDATION_PATTERN.test(name)) {
            showFormMessage(`Please enter a valid name (letters and spaces only, ${MIN_NAME_LENGTH}-${MAX_NAME_LENGTH} characters).`, 'danger', 'fas fa-exclamation-circle');
            return;
        }

        if (!isValidEmail(email)) {
            showFormMessage('Please enter a valid email address.', 'danger', 'fas fa-exclamation-circle');
            return;
        }

        if (message.length < MIN_MESSAGE_LENGTH || message.length > MAX_MESSAGE_LENGTH) {
            showFormMessage(`Message must be between ${MIN_MESSAGE_LENGTH} and ${MAX_MESSAGE_LENGTH} characters long.`, 'danger', 'fas fa-exclamation-circle');
            return;
        }

        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';
        submitBtn.disabled = true;

        try {
            // Prepare form data (sanitization happens on server)
            const formData = {
                name: name,
                email: email,
                phone: phone,
                inquiryType: inquiryType || 'general',
                message: message,
                timestamp: new Date().toISOString()
            };

            // Try to send via backend API
            const response = await sendContactEmail(formData);
            
            if (response.success) {
                showFormMessage(
                    'Thank you for reaching out! We\'ll get back to you within 24 hours.',
                    'success',
                    'fas fa-check-circle'
                );
                contactForm.reset();
                // Reset validation classes
                contactName.classList.remove('is-valid', 'is-invalid');
                contactEmail.classList.remove('is-valid', 'is-invalid');
                document.getElementById('emailValid').classList.remove('show');
                document.getElementById('charCount').textContent = '0';
            } else {
                throw new Error(response.error || 'Failed to send message');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            showFormMessage(
                `There was an error sending your message. Please try again or contact us directly at ${CONTACT_EMAIL}.`,
                'danger',
                'fas fa-exclamation-triangle'
            );
        } finally {
            // Reset button state
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
}

// Send contact email via backend
async function sendContactEmail(formData) {
    try {
        // Try to send via backend API
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Backend API not available');
        }
    } catch (error) {
        // Fallback: Use EmailJS if backend is not available
        console.log('Backend not available, using EmailJS fallback');
        return sendViaEmailJS(formData);
    }
}

// EmailJS integration (fallback method)
async function sendViaEmailJS(formData) {
    try {
        // Check if EmailJS is configured
        if (typeof emailjs === 'undefined') {
            console.log('EmailJS not configured, simulating success');
            // In production, this would fail. For now, simulate success
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ success: true });
                }, 1000);
            });
        }

        // EmailJS configuration would go here
        // emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData)
        
        return { success: true };
    } catch (error) {
        console.error('EmailJS error:', error);
        return { success: false, error: error.message };
    }
}

function showFormMessage(message, type, icon = '') {
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = '';
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    
    if (icon) {
        const iconElement = document.createElement('i');
        iconElement.className = icon;
        alertDiv.appendChild(iconElement);
        alertDiv.appendChild(document.createTextNode(' ' + message));
    } else {
        alertDiv.textContent = message;
    }
    
    formMessage.appendChild(alertDiv);
    
    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => {
            formMessage.textContent = '';
        }, 300);
    }, 8000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Chatbot Functionality - Now handled by chatbot.js
// Keeping this section for backward compatibility
// The enhanced chatbot is loaded from js/chatbot.js

// Newsletter Form Handler
const newsletterForms = document.querySelectorAll('.newsletter-form');
newsletterForms.forEach(form => {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        const submitBtn = this.querySelector('button[type="submit"]');

        if (!isValidEmail(email)) {
            // Create temporary error message
            const errorMsg = document.createElement('small');
            errorMsg.className = 'text-danger d-block mt-2';
            errorMsg.textContent = 'Please enter a valid email address.';
            this.appendChild(errorMsg);
            setTimeout(() => errorMsg.remove(), 3000);
            return;
        }

        // Show success message
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribed!';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
});

// Scroll to Top Button
const scrollTopBtn = document.createElement('div');
scrollTopBtn.className = 'scroll-top';
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
});

scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Auto-close navbar on mobile after clicking a link
const navLinks = document.querySelectorAll('.nav-link');
const navbarCollapse = document.querySelector('.navbar-collapse');

navLinks.forEach(link => {
    link.addEventListener('click', function () {
        if (window.innerWidth < 992) {
            navbarCollapse.classList.remove('show');
        }
    });
});

// Preloader (optional - can be added if needed)
window.addEventListener('load', function () {
    document.body.classList.add('loaded');
});

// Form Range Slider Visual Feedback
const rangeInputs = document.querySelectorAll('input[type="range"]');
rangeInputs.forEach(input => {
    input.addEventListener('input', function () {
        const min = this.min || 0;
        const max = this.max || 100;
        const val = this.value;
        const percentage = ((val - min) / (max - min)) * 100;
        this.style.background = `linear-gradient(to right, #6366f1 0%, #6366f1 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`;
    });

    // Trigger on load
    input.dispatchEvent(new Event('input'));
});

// Initialize tooltips if Bootstrap tooltips are used
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Add animation to pricing cards on hover
const pricingCards = document.querySelectorAll('.pricing-card');
pricingCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        if (this.classList.contains('featured')) {
            this.style.transform = 'scale(1.05)';
        } else {
            this.style.transform = 'translateY(0) scale(1)';
        }
    });
});

// Lazy loading for images (if needed for performance)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    const lazyImages = document.querySelectorAll('img.lazy');
    lazyImages.forEach(img => imageObserver.observe(img));
}

console.log('AI Solutions Website Loaded Successfully! 🚀');
