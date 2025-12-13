// Enhanced AI Chatbot with Advanced Features
// Supports: Session Memory, Multi-Language, Voice Input, File Upload, Context Awareness

// Configuration
const CHATBOT_CONFIG = {
    apiEndpoint: '/api/chat', // Placeholder for backend API
    enableVoice: true,
    enableFileUpload: true,
    enableMultiLanguage: true,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    typingDelay: 1000,
    supportedLanguages: ['en', 'hi', 'mr', 'gu', 'ta', 'te', 'bn'], // English + Indian languages
};

// Session Management
class ChatSession {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.conversationHistory = [];
        this.userPreferences = {};
        this.context = {
            projectType: null,
            numPages: null,
            features: [],
            budget: null,
            timeline: null,
            language: 'en'
        };
        this.lastActivity = Date.now();
        this.loadSession();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    saveSession() {
        const sessionData = {
            sessionId: this.sessionId,
            conversationHistory: this.conversationHistory,
            userPreferences: this.userPreferences,
            context: this.context,
            lastActivity: this.lastActivity
        };
        localStorage.setItem('chatbot_session', JSON.stringify(sessionData));
    }

    loadSession() {
        const savedSession = localStorage.getItem('chatbot_session');
        if (savedSession) {
            try {
                const data = JSON.parse(savedSession);
                // Check if session is still valid (not expired)
                if (Date.now() - data.lastActivity < CHATBOT_CONFIG.sessionTimeout) {
                    this.sessionId = data.sessionId;
                    this.conversationHistory = data.conversationHistory || [];
                    this.userPreferences = data.userPreferences || {};
                    this.context = data.context || this.context;
                }
            } catch (e) {
                console.error('Error loading session:', e);
            }
        }
    }

    addMessage(message, sender) {
        this.conversationHistory.push({
            message,
            sender,
            timestamp: Date.now()
        });
        this.lastActivity = Date.now();
        this.saveSession();
    }

    updateContext(key, value) {
        this.context[key] = value;
        this.saveSession();
    }

    getContext() {
        return this.context;
    }

    clearSession() {
        localStorage.removeItem('chatbot_session');
        this.conversationHistory = [];
        this.userPreferences = {};
        this.context = {
            projectType: null,
            numPages: null,
            features: [],
            budget: null,
            timeline: null,
            language: 'en'
        };
    }
}

// Initialize session
const chatSession = new ChatSession();

// Multi-language responses
const RESPONSES = {
    en: {
        greeting: "👋 Hello! I'm your AI assistant. How can I help you today?",
        pricing: "Our pricing starts from ₹5,000 for basic websites. Check our Pricing section for detailed packages!",
        services: "We offer Website Development, App Development, and AI-Powered solutions. What interests you?",
        thankYou: "You're welcome! Feel free to ask if you need anything else! 😊",
        projectType: "What type of project are you interested in? (Website/App/Both)",
        estimateStart: "Great! Let me help you get an estimate. What type of project do you need?",
        error: "I didn't quite understand that. Could you rephrase?",
    },
    hi: {
        greeting: "👋 नमस्ते! मैं आपका AI सहायक हूं। मैं आपकी कैसे मदद कर सकता हूं?",
        pricing: "हमारी कीमतें बुनियादी वेबसाइटों के लिए ₹5,000 से शुरू होती हैं। विस्तृत पैकेज के लिए हमारे मूल्य निर्धारण अनुभाग को देखें!",
        services: "हम वेबसाइट विकास, ऐप विकास और AI-संचालित समाधान प्रदान करते हैं। आपको क्या रुचि है?",
        thankYou: "आपका स्वागत है! यदि आपको कुछ और चाहिए तो बेझिझक पूछें! 😊",
        projectType: "आप किस प्रकार की परियोजना में रुचि रखते हैं? (वेबसाइट/ऐप/दोनों)",
        estimateStart: "बढ़िया! मैं आपको अनुमान प्राप्त करने में मदद करता हूं। आपको किस प्रकार की परियोजना की आवश्यकता है?",
        error: "मुझे वह समझ नहीं आया। क्या आप दोबारा कह सकते हैं?",
    }
};

// AI Response Engine with Context Awareness
class AIResponseEngine {
    constructor() {
        this.intents = this.loadIntents();
    }

    loadIntents() {
        return {
            greeting: {
                patterns: ['hi', 'hello', 'hey', 'namaste', 'नमस्ते', 'hola', 'good morning', 'good evening'],
                response: (context) => this.getLocalizedResponse('greeting')
            },
            pricing: {
                patterns: ['price', 'cost', 'pricing', 'how much', 'rates', 'fee', 'charge', 'कीमत', 'मूल्य'],
                response: (context) => {
                    let response = this.getLocalizedResponse('pricing');
                    if (context.projectType) {
                        response += `\n\nFor ${context.projectType} projects, we have specific packages. Would you like a detailed estimate?`;
                    }
                    return response;
                }
            },
            services: {
                patterns: ['service', 'what do you offer', 'what can you do', 'capabilities', 'सेवा', 'सेवाएं'],
                response: (context) => this.getLocalizedResponse('services')
            },
            website: {
                patterns: ['website', 'web development', 'web design', 'site', 'वेबसाइट'],
                response: (context) => {
                    chatSession.updateContext('projectType', 'website');
                    return "Great! We specialize in website development. Our packages include:\n\n🌐 Basic Website (₹5,000) - Up to 5 pages\n💼 Portfolio Website (₹10,000) - Up to 10 pages\n🏢 Small Business (₹25,000) - Unlimited pages\n\nHow many pages do you need?";
                }
            },
            app: {
                patterns: ['app', 'mobile app', 'application', 'android', 'ios', 'एप्लिकेशन', 'ऐप'],
                response: (context) => {
                    chatSession.updateContext('projectType', 'app');
                    return "Excellent choice! We develop mobile apps for both platforms. Our packages:\n\n📱 Basic App (₹30,000) - Single platform\n💻 Business App (₹40,000) - Multi-platform\n🚀 Custom Mini App (₹50,000) - Full features\n\nWhat features do you need?";
                }
            },
            estimate: {
                patterns: ['estimate', 'quote', 'calculation', 'calculator', 'अनुमान', 'calculate'],
                response: (context) => {
                    return this.generateEstimateFlow(context);
                }
            },
            features: {
                patterns: ['feature', 'functionality', 'capabilities', 'what features', 'फीचर'],
                response: (context) => {
                    return "We offer various features:\n\n✅ User Authentication (+₹5,000)\n💳 Payment Integration (+₹10,000)\n🤖 AI Features (+₹15,000)\n🔌 API Integration (+₹8,000)\n\nWhich features interest you?";
                }
            },
            timeline: {
                patterns: ['time', 'duration', 'how long', 'deadline', 'delivery', 'समय', 'अवधि'],
                response: (context) => {
                    let response = "Our typical turnaround times:\n\n⏱️ Standard: 2-4 weeks\n⚡ Rush: 1-2 weeks (+50% cost)\n\n";
                    if (context.projectType) {
                        response += `For your ${context.projectType} project, we estimate `;
                        response += context.timeline || '2-3 weeks';
                    }
                    return response;
                }
            },
            contact: {
                patterns: ['contact', 'reach', 'email', 'phone', 'call', 'संपर्क'],
                response: (context) => {
                    return "You can reach us at:\n\n📧 Email: info@aisolutions.com\n📱 Phone: +91 98765 43210\n📍 Location: Mumbai, Maharashtra\n\nOr fill out the contact form on our website!";
                }
            },
            ai: {
                patterns: ['ai', 'artificial intelligence', 'machine learning', 'chatbot', 'AI'],
                response: (context) => {
                    return "We integrate cutting-edge AI features:\n\n🤖 Smart Chatbots\n📊 Recommendation Engines\n⚡ Automated Workflows\n📈 Predictive Analytics\n\nAI features add ₹15,000 to your project. Interested?";
                }
            },
            languages: {
                patterns: ['language', 'hindi', 'multilingual', 'translation', 'भाषा'],
                response: (context) => {
                    return "I can communicate in multiple languages! 🌐\n\nSupported languages:\n• English\n• हिंदी (Hindi)\n• मराठी (Marathi)\n• ગુજરાતી (Gujarati)\n• தமிழ் (Tamil)\n• తెలుగు (Telugu)\n• বাংলা (Bengali)\n\nWhich language do you prefer?";
                }
            },
            thankYou: {
                patterns: ['thank', 'thanks', 'appreciate', 'धन्यवाद', 'शुक्रिया'],
                response: (context) => this.getLocalizedResponse('thankYou')
            }
        };
    }

    getLocalizedResponse(key) {
        const lang = chatSession.context.language || 'en';
        return RESPONSES[lang]?.[key] || RESPONSES.en[key];
    }

    generateEstimateFlow(context) {
        if (!context.projectType) {
            chatSession.updateContext('awaitingInput', 'projectType');
            return "Let me help you get an estimate! 📊\n\nFirst, what type of project do you need?\n\n🌐 Website\n📱 Mobile App\n🎯 Both";
        }

        if (!context.numPages) {
            chatSession.updateContext('awaitingInput', 'numPages');
            return "Great! How many pages/screens do you need? (Enter a number, e.g., 5)";
        }

        return this.calculateEstimate(context);
    }

    calculateEstimate(context) {
        let basePrice = 0;
        const numPages = parseInt(context.numPages) || 5;

        // Base price calculation
        if (context.projectType === 'website') {
            if (numPages <= 5) {
                basePrice = 5000;
            } else if (numPages <= 10) {
                basePrice = 10000;
            } else {
                basePrice = 25000;
            }
            if (numPages > 5) {
                basePrice += (numPages - 5) * 1000;
            }
        } else if (context.projectType === 'app') {
            basePrice = 30000;
            if (numPages > 5) {
                basePrice += (numPages - 5) * 2000;
            }
        } else if (context.projectType === 'both') {
            basePrice = 50000;
            if (numPages > 5) {
                basePrice += (numPages - 5) * 1500;
            }
        }

        // Add features cost
        const featuresCost = context.features.reduce((sum, feature) => {
            const costs = {
                'auth': 5000,
                'payment': 10000,
                'ai': 15000,
                'api': 8000
            };
            return sum + (costs[feature] || 0);
        }, 0);

        const totalPrice = basePrice + featuresCost;
        const timeline = context.projectType === 'app' ? '3-4 weeks' : '2-3 weeks';

        chatSession.updateContext('estimatedCost', totalPrice);
        chatSession.updateContext('timeline', timeline);

        return `📊 Estimated Project Cost:\n\n💰 Total: ₹${totalPrice.toLocaleString('en-IN')}\n⏱️ Timeline: ${timeline}\n\nThis includes:\n• Base ${context.projectType} package\n• ${numPages} pages/screens\n${featuresCost > 0 ? `• Additional features: ₹${featuresCost.toLocaleString('en-IN')}` : ''}\n\n*This is an approximate estimate. Would you like to request a detailed quote?`;
    }

    findBestMatch(message) {
        const lowerMessage = message.toLowerCase();
        let bestMatch = null;
        let highestScore = 0;

        for (const [intent, data] of Object.entries(this.intents)) {
            for (const pattern of data.patterns) {
                if (lowerMessage.includes(pattern.toLowerCase())) {
                    const score = pattern.length / lowerMessage.length;
                    if (score > highestScore) {
                        highestScore = score;
                        bestMatch = intent;
                    }
                }
            }
        }

        return bestMatch;
    }

    getResponse(message) {
        const context = chatSession.getContext();

        // Handle contextual inputs
        if (context.awaitingInput) {
            return this.handleContextualInput(message, context);
        }

        // Find intent and generate response
        const intent = this.findBestMatch(message);
        if (intent && this.intents[intent]) {
            return this.intents[intent].response(context);
        }

        // Default fallback
        return this.getLocalizedResponse('error') + "\n\nYou can ask me about:\n• Pricing & Packages\n• Services\n• Project Estimates\n• Timeline & Delivery\n• Contact Information";
    }

    handleContextualInput(message, context) {
        const awaitingInput = context.awaitingInput;
        chatSession.updateContext('awaitingInput', null);

        if (awaitingInput === 'projectType') {
            const lowerMessage = message.toLowerCase();
            if (lowerMessage.includes('website') || lowerMessage.includes('site')) {
                chatSession.updateContext('projectType', 'website');
            } else if (lowerMessage.includes('app') || lowerMessage.includes('mobile')) {
                chatSession.updateContext('projectType', 'app');
            } else if (lowerMessage.includes('both')) {
                chatSession.updateContext('projectType', 'both');
            }
            return this.generateEstimateFlow(chatSession.getContext());
        }

        if (awaitingInput === 'numPages') {
            const numPages = parseInt(message);
            if (!isNaN(numPages) && numPages > 0) {
                chatSession.updateContext('numPages', numPages);
                chatSession.updateContext('awaitingInput', 'features');
                return "Perfect! Do you need any additional features?\n\n✅ User Authentication\n💳 Payment Integration\n🤖 AI Features\n🔌 API Integration\n\nType the features you need, or 'none' to continue.";
            }
            return "Please enter a valid number of pages/screens.";
        }

        if (awaitingInput === 'features') {
            const lowerMessage = message.toLowerCase();
            const features = [];
            if (lowerMessage.includes('auth')) features.push('auth');
            if (lowerMessage.includes('payment')) features.push('payment');
            if (lowerMessage.includes('ai')) features.push('ai');
            if (lowerMessage.includes('api')) features.push('api');
            
            chatSession.updateContext('features', features);
            return this.calculateEstimate(chatSession.getContext());
        }

        return "Let me help you with that.";
    }
}

// Initialize AI engine
const aiEngine = new AIResponseEngine();

// Chatbot UI Functions
function toggleChatbot() {
    const container = document.getElementById('chatbotContainer');
    const toggleBtn = document.getElementById('chatbotToggle');
    
    container.classList.toggle('active');
    toggleBtn.classList.toggle('active');
    
    if (container.classList.contains('active')) {
        toggleBtn.innerHTML = '<i class="fas fa-times"></i>';
        // Focus input when opened
        setTimeout(() => {
            document.getElementById('chatInput').focus();
        }, 300);
    } else {
        toggleBtn.innerHTML = '<i class="fas fa-comments"></i>';
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) return;

    // Add user message to UI
    addMessageToUI(message, 'user');
    chatSession.addMessage(message, 'user');
    
    // Clear input
    input.value = '';

    // Show typing indicator
    showTypingIndicator();

    // Get AI response
    setTimeout(() => {
        const response = aiEngine.getResponse(message);
        hideTypingIndicator();
        addMessageToUI(response, 'bot');
        chatSession.addMessage(response, 'bot');
    }, CHATBOT_CONFIG.typingDelay);
}

function addMessageToUI(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
    
    const messagePara = document.createElement('p');
    // Use textContent to prevent XSS
    messagePara.textContent = message;
    messageDiv.appendChild(messagePara);
    
    // Add timestamp
    const timeSpan = document.createElement('span');
    timeSpan.className = 'message-time';
    timeSpan.textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    messageDiv.appendChild(timeSpan);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function handleQuickReply(type) {
    const messages = {
        pricing: 'Tell me about your pricing',
        services: 'What services do you offer?',
        estimate: 'I want to get a project estimate'
    };
    
    if (messages[type]) {
        document.getElementById('chatInput').value = messages[type];
        sendChatMessage();
    }
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

// Voice Input Feature
let recognition;
function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        addMessageToUI('Voice input is not supported in your browser. Please use Chrome or Edge.', 'bot');
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = chatSession.context.language === 'hi' ? 'hi-IN' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const voiceBtn = document.getElementById('voiceBtn');
    voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
    voiceBtn.style.color = '#ef4444';

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('chatInput').value = transcript;
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceBtn.style.color = '';
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceBtn.style.color = '';
        addMessageToUI('Voice input error. Please try again.', 'bot');
    };

    recognition.onend = () => {
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceBtn.style.color = '';
    };

    recognition.start();
}

// File Upload Feature
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        addMessageToUI('File size should be less than 5MB', 'bot');
        return;
    }

    // Show file upload message
    const fileName = file.name;
    const fileType = file.type;
    
    addMessageToUI(`📎 Uploaded: ${fileName}`, 'user');
    
    // Simulate processing
    showTypingIndicator();
    setTimeout(() => {
        hideTypingIndicator();
        if (fileType.startsWith('image/')) {
            addMessageToUI('Thanks for sharing the image! Our team will review your design and get back to you with feedback. Would you like to provide any additional details about your requirements?', 'bot');
        } else {
            addMessageToUI('Thanks for sharing the file! Our team will review it and contact you soon. Is there anything specific you\'d like us to focus on?', 'bot');
        }
    }, 1500);

    // Reset file input
    event.target.value = '';
}

// Initialize chatbot on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Enhanced AI Chatbot initialized! 🤖');
    
    // Check if user is returning
    if (chatSession.conversationHistory.length > 0) {
        setTimeout(() => {
            addMessageToUI('Welcome back! 👋 How can I assist you today?', 'bot');
        }, 500);
    }
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ChatSession, AIResponseEngine, CHATBOT_CONFIG };
}
