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
        basePrice += (numPages - 5) * 1000; // Additional pages
    } else if (projectType === 'app') {
        basePrice = 30000;
        basePrice += (numPages - 5) * 2000; // Additional screens
    } else if (projectType === 'both') {
        basePrice = 50000;
        basePrice += (numPages - 5) * 1500;
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
        resultDiv.innerHTML = '<p class="text-danger">Please fill in all fields to get a recommendation.</p>';
        resultDiv.classList.add('show');
        return;
    }

    // Simulate AI processing
    resultDiv.innerHTML = '<p><i class="fas fa-spinner fa-spin me-2"></i>Analyzing your requirements...</p>';
    resultDiv.classList.add('show');

    setTimeout(() => {
        let recommendation = '';
        let suggestedPackage = '';
        let features = [];

        // AI logic based on inputs
        if (businessGoal === 'showcase') {
            if (businessType.toLowerCase().includes('restaurant') || businessType.toLowerCase().includes('food')) {
                recommendation = `For a ${businessType}, we recommend a visually stunning Portfolio Website with an image gallery to showcase your menu and ambiance.`;
                suggestedPackage = 'Portfolio Website (₹10,000)';
                features = ['Image Gallery', 'Menu Display', 'Reservation System', 'Location Map'];
            } else {
                recommendation = `A Portfolio Website would be perfect for showcasing your ${businessType}. It will help display your work, services, and achievements professionally.`;
                suggestedPackage = 'Portfolio Website (₹10,000)';
                features = ['Professional Design', 'Portfolio Gallery', 'About Section', 'Contact Form'];
            }
        } else if (businessGoal === 'sell') {
            recommendation = `To sell products online for your ${businessType}, we recommend a Small Business Website with e-commerce capabilities.`;
            suggestedPackage = 'Small Business Website (₹25,000)';
            features = ['Product Catalog', 'Shopping Cart', 'Payment Gateway', 'Order Management', 'Customer Accounts'];
        } else if (businessGoal === 'leads') {
            recommendation = `For lead generation in ${businessType}, a Basic Website with strong call-to-action elements and contact forms would be ideal.`;
            suggestedPackage = 'Basic Website (₹5,000) with lead capture features';
            features = ['Contact Forms', 'Call-to-Action Buttons', 'Service Showcase', 'Testimonials'];
        } else if (businessGoal === 'engagement') {
            recommendation = `To improve customer engagement for ${businessType}, consider our AI-Powered solutions with chatbot integration and a Business App.`;
            suggestedPackage = 'Business App (₹40,000) + AI Chatbot';
            features = ['AI Chatbot', 'Push Notifications', 'Customer Dashboard', 'Interactive Features', 'Analytics'];
        }

        const resultHTML = `
            <div class="ai-recommendation-result">
                <h5><i class="fas fa-lightbulb text-warning me-2"></i>AI Recommendation</h5>
                <p><strong>${recommendation}</strong></p>
                <div class="mt-3">
                    <h6>Suggested Package:</h6>
                    <p class="text-primary fw-bold">${suggestedPackage}</p>
                </div>
                <div class="mt-3">
                    <h6>Recommended Features:</h6>
                    <ul class="list-unstyled">
                        ${features.map(f => `<li><i class="fas fa-check-circle text-success me-2"></i>${f}</li>`).join('')}
                    </ul>
                </div>
                <div class="mt-3">
                    <a href="#contact" class="btn btn-primary btn-sm">Request Custom Quote</a>
                </div>
            </div>
        `;

        resultDiv.innerHTML = resultHTML;
    }, 2000);
}

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const phone = document.getElementById('contactPhone').value;
        const message = document.getElementById('contactMessage').value;

        // Validation
        if (!name || !email || !message) {
            showFormMessage('Please fill in all required fields.', 'danger');
            return;
        }

        if (!isValidEmail(email)) {
            showFormMessage('Please enter a valid email address.', 'danger');
            return;
        }

        // Show loading
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<span class="loading"></span> Sending...';
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            showFormMessage('Thank you! Your message has been sent successfully. We will get back to you soon.', 'success');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    formMessage.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    setTimeout(() => {
        formMessage.innerHTML = '';
    }, 5000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Chatbot Functionality
let chatbotOpen = false;

function toggleChat() {
    chatbotOpen = !chatbotOpen;
    const chatbotBody = document.getElementById('chatbotBody');
    chatbotBody.classList.toggle('active');
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();

    if (!message) return;

    // Add user message
    addMessageToChat(message, 'user');
    chatInput.value = '';

    // Simulate AI response
    setTimeout(() => {
        const response = getAIResponse(message);
        addMessageToChat(response, 'bot');
    }, 1000);
}

function addMessageToChat(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
    messageDiv.innerHTML = `<p>${message}</p>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getAIResponse(message) {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        return "Our pricing starts from ₹5,000 for basic websites. You can check our detailed pricing in the Pricing section or use our Cost Estimator tool for a custom quote!";
    } else if (lowerMessage.includes('website')) {
        return "We offer comprehensive website development services including Portfolio sites, Business websites, and E-commerce platforms. What type of website are you interested in?";
    } else if (lowerMessage.includes('app')) {
        return "We develop mobile apps for both iOS and Android platforms. Our packages range from ₹30,000 to ₹50,000 depending on features. Would you like to know more?";
    } else if (lowerMessage.includes('ai')) {
        return "We integrate AI features like chatbots, recommendation engines, and smart analytics into your projects. This can enhance user engagement significantly!";
    } else if (lowerMessage.includes('time') || lowerMessage.includes('duration')) {
        return "Our typical turnaround time is 5-7 days for basic projects, and 2-4 weeks for complex applications. We also offer rush delivery options!";
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('reach')) {
        return "You can reach us at info@aisolutions.com or call us at +91 98765 43210. You can also fill out the contact form below!";
    } else if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
        return "Hello! 👋 How can I help you today? Feel free to ask about our services, pricing, or anything else!";
    } else if (lowerMessage.includes('thank')) {
        return "You're welcome! If you have any other questions, feel free to ask. We're here to help! 😊";
    } else {
        return "That's a great question! For detailed information, please check our Services and Pricing sections, or you can contact us directly using the form below. Is there anything specific you'd like to know?";
    }
}

// Allow Enter key to send message
const chatInput = document.getElementById('chatInput');
if (chatInput) {
    chatInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Newsletter Form Handler
const newsletterForms = document.querySelectorAll('.newsletter-form');
newsletterForms.forEach(form => {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;

        if (!isValidEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        alert('Thank you for subscribing! You will receive our latest updates and offers.');
        this.reset();
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
