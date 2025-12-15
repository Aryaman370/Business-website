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
                patterns: ['hi', 'hello', 'hey', 'namaste', 'नमस्ते', 'hola', 'good morning', 'good evening', 'greetings'],
                response: (context) => this.getLocalizedResponse('greeting')
            },
            pricing: {
                patterns: ['price', 'cost', 'pricing', 'how much', 'rates', 'fee', 'charge', 'कीमत', 'मूल्य', 'budget', 'affordable', 'cheap', 'expensive'],
                response: (context) => {
                    let response = this.getLocalizedResponse('pricing');
                    if (context.projectType) {
                        response += `\n\nFor ${context.projectType} projects, we have specific packages. Would you like a detailed estimate?`;
                    }
                    return response;
                }
            },
            services: {
                patterns: ['service', 'what do you offer', 'what can you do', 'capabilities', 'सेवा', 'सेवाएं', 'what you do', 'offerings'],
                response: (context) => this.getLocalizedResponse('services')
            },
            website: {
                patterns: ['website', 'web development', 'web design', 'site', 'वेबसाइट', 'webpage', 'portal', 'landing page', 'blog'],
                response: (context) => {
                    chatSession.updateContext('projectType', 'website');
                    return "Great! We specialize in website development. Our packages include:\n\n🌐 Basic Website (₹5,000) - Up to 5 pages\n💼 Portfolio Website (₹10,000) - Up to 10 pages\n🏢 Small Business (₹25,000) - Unlimited pages\n\nHow many pages do you need?";
                }
            },
            app: {
                patterns: ['app', 'mobile app', 'application', 'android', 'ios', 'एप्लिकेशन', 'ऐप', 'mobile', 'smartphone app'],
                response: (context) => {
                    chatSession.updateContext('projectType', 'app');
                    return "Excellent choice! We develop mobile apps for both platforms. Our packages:\n\n📱 Basic App (₹30,000) - Single platform\n💻 Business App (₹40,000) - Multi-platform\n🚀 Custom Mini App (₹50,000) - Full features\n\nWhat features do you need?";
                }
            },
            estimate: {
                patterns: ['estimate', 'quote', 'calculation', 'calculator', 'अनुमान', 'calculate', 'quotation', 'proposal'],
                response: (context) => {
                    return this.generateEstimateFlow(context);
                }
            },
            features: {
                patterns: ['feature', 'functionality', 'capabilities', 'what features', 'फीचर', 'options', 'add-ons'],
                response: (context) => {
                    return "We offer various features:\n\n✅ User Authentication (+₹5,000)\n💳 Payment Integration (+₹10,000)\n🤖 AI Features (+₹15,000)\n🔌 API Integration (+₹8,000)\n\nWhich features interest you?";
                }
            },
            timeline: {
                patterns: ['time', 'duration', 'how long', 'deadline', 'delivery', 'समय', 'अवधि', 'when', 'complete', 'finish'],
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
                patterns: ['contact', 'reach', 'email', 'phone', 'call', 'संपर्क', 'support', 'help desk', 'get in touch'],
                response: (context) => {
                    return "You can reach us at:\n\n📧 Email: info@aisolutions.com\n📱 Phone: +91 98765 43210\n📍 Location: Mumbai, Maharashtra\n\nOr fill out the contact form on our website!";
                }
            },
            ai: {
                patterns: ['ai', 'artificial intelligence', 'machine learning', 'chatbot', 'AI', 'ml', 'deep learning', 'neural network'],
                response: (context) => {
                    return "We integrate cutting-edge AI features:\n\n🤖 Smart Chatbots\n📊 Recommendation Engines\n⚡ Automated Workflows\n📈 Predictive Analytics\n\nAI features add ₹15,000 to your project. Interested?";
                }
            },
            languages: {
                patterns: ['language', 'hindi', 'multilingual', 'translation', 'भाषा', 'localization', 'regional'],
                response: (context) => {
                    return "I can communicate in multiple languages! 🌐\n\nSupported languages:\n• English\n• हिंदी (Hindi)\n• मराठी (Marathi)\n• ગુજરાતી (Gujarati)\n• தமிழ் (Tamil)\n• తెలుగు (Telugu)\n• বাংলা (Bengali)\n\nWhich language do you prefer?";
                }
            },
            thankYou: {
                patterns: ['thank', 'thanks', 'appreciate', 'धन्यवाद', 'शुक्रिया', 'grateful', 'awesome'],
                response: (context) => this.getLocalizedResponse('thankYou')
            },
            // NEW COMPREHENSIVE INTENTS
            ecommerce: {
                patterns: ['ecommerce', 'e-commerce', 'online store', 'shop', 'shopping cart', 'sell online', 'marketplace'],
                response: (context) => {
                    return "We build powerful e-commerce solutions! 🛒\n\nFeatures include:\n• Product catalog with search\n• Shopping cart & checkout\n• Payment gateway integration\n• Order management\n• Inventory tracking\n• Customer accounts\n\nE-commerce starts at ₹25,000. Need a detailed quote?";
                }
            },
            payment: {
                patterns: ['payment', 'pay', 'payment method', 'card', 'upi', 'paypal', 'stripe', 'razorpay', 'installment'],
                response: (context) => {
                    return "We accept multiple payment methods:\n\n💳 Credit/Debit Cards\n📱 UPI Payment\n🏦 Bank Transfer\n💰 PayPal\n\nPayment terms:\n• 50% advance to start\n• 50% on delivery\n\nFlexible installments available for projects above ₹50,000!";
                }
            },
            technology: {
                patterns: ['technology', 'tech stack', 'framework', 'programming', 'code', 'platform', 'tools'],
                response: (context) => {
                    return "We use modern, industry-standard technologies:\n\n🎨 Frontend: React, Vue, Angular, HTML5/CSS3\n⚙️ Backend: Node.js, Python, PHP, .NET\n📱 Mobile: React Native, Flutter, Native iOS/Android\n🗄️ Database: MySQL, MongoDB, PostgreSQL\n☁️ Cloud: AWS, Azure, Google Cloud\n🤖 AI/ML: TensorFlow, PyTorch, OpenAI\n\nNeed specific tech recommendations?";
                }
            },
            seo: {
                patterns: ['seo', 'search engine', 'google ranking', 'optimization', 'visibility', 'traffic'],
                response: (context) => {
                    return "SEO is included in all our packages! 🔍\n\nSEO services:\n✅ Keyword research & optimization\n✅ Meta tags & descriptions\n✅ Site speed optimization\n✅ Mobile responsiveness\n✅ XML sitemap\n✅ Google Analytics integration\n\nAdvanced SEO package (+₹8,000):\n• Content strategy\n• Link building\n• Monthly reporting\n\nInterested?";
                }
            },
            hosting: {
                patterns: ['hosting', 'domain', 'server', 'deployment', 'go live', 'dns', 'ssl'],
                response: (context) => {
                    return "We provide complete hosting solutions! 🌐\n\nHosting options:\n🔹 Shared Hosting (₹2,000/year)\n🔹 VPS Hosting (₹8,000/year)\n🔹 Cloud Hosting (₹15,000/year)\n🔹 Dedicated Server (Custom pricing)\n\nIncludes:\n• Free SSL certificate\n• Daily backups\n• 99.9% uptime\n• Email accounts\n• Technical support\n\nDomain registration available at ₹800/year!";
                }
            },
            maintenance: {
                patterns: ['maintenance', 'update', 'support', 'fix', 'bug', 'issue', 'upgrade', 'modify'],
                response: (context) => {
                    return "We offer comprehensive maintenance packages! 🔧\n\n📦 Basic (₹3,000/month):\n• Bug fixes\n• Security updates\n• Monthly backup\n\n📦 Standard (₹6,000/month):\n• Everything in Basic\n• Content updates\n• Performance monitoring\n• Monthly reports\n\n📦 Premium (₹12,000/month):\n• Everything in Standard\n• Feature additions\n• 24/7 support\n• Priority response\n\nAll packages include free support for first 3 months!";
                }
            },
            portfolio: {
                patterns: ['portfolio', 'previous work', 'examples', 'samples', 'showcase', 'projects done', 'case study'],
                response: (context) => {
                    return "We've successfully delivered 150+ projects! 🎯\n\nRecent projects:\n💼 E-commerce platform for fashion brand\n🏥 Hospital management system\n🍽️ Restaurant ordering app\n📚 Educational platform with LMS\n🏢 Corporate website for IT firm\n\nClient satisfaction: 98%\nAverage rating: 4.8/5\n\nWould you like to see specific examples in your industry?";
                }
            },
            security: {
                patterns: ['security', 'secure', 'safe', 'protection', 'hack', 'ssl', 'encryption', 'data protection'],
                response: (context) => {
                    return "Security is our top priority! 🔒\n\nSecurity measures:\n✅ SSL/HTTPS encryption\n✅ Secure authentication\n✅ Data encryption\n✅ Regular security audits\n✅ GDPR compliance\n✅ SQL injection protection\n✅ XSS protection\n✅ DDoS protection\n\nAll our applications follow OWASP security guidelines!";
                }
            },
            responsive: {
                patterns: ['responsive', 'mobile friendly', 'tablet', 'device', 'screen size', 'adaptive'],
                response: (context) => {
                    return "All our websites are fully responsive! 📱💻\n\nResponsive features:\n✅ Mobile-first design\n✅ Works on all screen sizes\n✅ Touch-friendly interface\n✅ Fast loading on mobile\n✅ Optimized images\n✅ Cross-browser compatible\n\nTested on:\n• iOS (iPhone, iPad)\n• Android devices\n• Desktop browsers\n• Tablets\n\nGuaranteed perfect display on all devices!";
                }
            },
            cms: {
                patterns: ['cms', 'content management', 'wordpress', 'admin panel', 'manage content', 'edit'],
                response: (context) => {
                    return "We offer user-friendly CMS solutions! 📝\n\nCMS options:\n🔹 WordPress - Easy to use, plugin-rich\n🔹 Custom CMS - Tailored to your needs\n🔹 Headless CMS - Modern & flexible\n\nCMS features:\n✅ Easy content editing\n✅ User management\n✅ Media library\n✅ SEO tools\n✅ Custom post types\n✅ No coding required\n\nCMS integration adds ₹5,000 to your project!";
                }
            },
            database: {
                patterns: ['database', 'data storage', 'mysql', 'mongodb', 'sql', 'data management'],
                response: (context) => {
                    return "We design efficient database solutions! 🗄️\n\nDatabase options:\n• MySQL - Reliable & popular\n• PostgreSQL - Advanced features\n• MongoDB - NoSQL flexibility\n• Firebase - Real-time sync\n\nDatabase services:\n✅ Schema design\n✅ Data migration\n✅ Performance optimization\n✅ Backup & recovery\n✅ Security implementation\n\nWhat type of data will you be managing?";
                }
            },
            api: {
                patterns: ['api', 'integration', 'third party', 'connect', 'webhook', 'rest api', 'graphql'],
                response: (context) => {
                    return "We excel at API integration! 🔌\n\nPopular integrations:\n📧 Email (SendGrid, Mailchimp)\n💳 Payment (Stripe, Razorpay, PayPal)\n📱 SMS (Twilio, AWS SNS)\n🗺️ Maps (Google Maps, Mapbox)\n📊 Analytics (Google Analytics, Mixpanel)\n🔗 Social Media (Facebook, Twitter, Instagram)\n☁️ Cloud Storage (AWS S3, Google Cloud)\n\nCustom API development: ₹8,000+\n\nNeed specific integration?";
                }
            },
            design: {
                patterns: ['design', 'ui', 'ux', 'interface', 'look', 'theme', 'layout', 'mockup', 'prototype'],
                response: (context) => {
                    return "We create stunning designs! 🎨\n\nDesign process:\n1️⃣ Research & analysis\n2️⃣ Wireframing\n3️⃣ UI/UX design\n4️⃣ Prototype\n5️⃣ Client review\n6️⃣ Final design\n\nDesign principles:\n✅ User-centered\n✅ Modern & clean\n✅ Brand-aligned\n✅ Conversion-focused\n✅ Accessible\n\nCustom design included in all packages!\nPremium design service (+₹7,000) for advanced animations & interactions.";
                }
            },
            revisions: {
                patterns: ['revision', 'changes', 'modify', 'edit', 'redo', 'adjustments', 'corrections'],
                response: (context) => {
                    return "We offer flexible revision policies! ✏️\n\nRevisions included:\n🔹 Basic Package: 2 revisions\n🔹 Portfolio Package: 3 revisions\n🔹 Business Package: 5 revisions\n\nRevision scope:\n✅ Content changes\n✅ Design tweaks\n✅ Feature adjustments\n✅ Layout modifications\n\nAdditional revisions: ₹2,000 each\n\nWe work until you're 100% satisfied!";
                }
            },
            refund: {
                patterns: ['refund', 'money back', 'guarantee', 'cancel', 'cancellation', 'policy'],
                response: (context) => {
                    return "We have a fair refund policy! 💰\n\nRefund terms:\n✅ 100% refund if we don't start work\n✅ 50% refund if cancelled within 1 week\n✅ No refund after design approval\n\nWe guarantee:\n• Quality work\n• Timely delivery\n• Your satisfaction\n\nOur goal is your success - we'll work with you to ensure you're happy!";
                }
            },
            team: {
                patterns: ['team', 'developer', 'designer', 'who', 'staff', 'employees', 'about you'],
                response: (context) => {
                    return "Our expert team is here for you! 👥\n\nTeam members:\n👨‍💻 5+ Senior Developers\n🎨 3 UI/UX Designers\n🔧 2 DevOps Engineers\n🤖 AI/ML Specialists\n📊 Project Managers\n\nExperience:\n• 8+ years average experience\n• 150+ projects delivered\n• Certified professionals\n• Continuous learning\n\nWe're based in Mumbai with clients worldwide!";
                }
            },
            process: {
                patterns: ['process', 'how it works', 'workflow', 'steps', 'procedure', 'methodology'],
                response: (context) => {
                    return "Our streamlined development process: 📋\n\n1️⃣ Discovery & Planning\n   • Requirements gathering\n   • Project scope\n\n2️⃣ Design Phase\n   • Wireframes\n   • UI/UX design\n\n3️⃣ Development\n   • Frontend coding\n   • Backend development\n\n4️⃣ Testing\n   • Quality assurance\n   • Bug fixes\n\n5️⃣ Launch\n   • Deployment\n   • Training\n\n6️⃣ Support\n   • Maintenance\n   • Updates\n\nRegular updates throughout the process!";
                }
            },
            training: {
                patterns: ['training', 'teach', 'learn', 'tutorial', 'how to use', 'guide', 'documentation'],
                response: (context) => {
                    return "We provide comprehensive training! 📚\n\nTraining includes:\n✅ Video tutorials\n✅ Written documentation\n✅ Live training session\n✅ User manual\n✅ Admin guide\n✅ FAQ section\n\nAdditional training:\n• On-site training (+₹5,000)\n• Extended sessions (+₹3,000/session)\n• Custom training materials\n\nWe ensure you're comfortable managing your project!";
                }
            },
            urgency: {
                patterns: ['urgent', 'asap', 'immediately', 'rush', 'emergency', 'quick', 'fast'],
                response: (context) => {
                    return "We can handle urgent projects! ⚡\n\nRush delivery options:\n🔥 Super Rush (3-5 days): +100% cost\n⚡ Rush (1-2 weeks): +50% cost\n🚀 Priority (2-3 weeks): +25% cost\n\nFor urgent projects:\n• Dedicated team\n• Daily updates\n• Priority support\n• Weekend work if needed\n\nAvailability depends on current workload. Contact us immediately!";
                }
            },
            comparison: {
                patterns: ['compare', 'difference', 'vs', 'versus', 'better', 'alternative', 'competitors'],
                response: (context) => {
                    return "Why choose us? 🌟\n\nOur advantages:\n✅ AI-powered development (60% faster)\n✅ Transparent pricing\n✅ No hidden costs\n✅ Modern technology\n✅ Post-launch support\n✅ 98% client satisfaction\n✅ Money-back guarantee\n\nCompetitor comparison:\n• 40% more affordable\n• 2x faster delivery\n• Better quality code\n• Ongoing support included\n\nSee why 150+ clients chose us!";
                }
            },
            testimonials: {
                patterns: ['testimonial', 'review', 'feedback', 'rating', 'client', 'customer experience'],
                response: (context) => {
                    return "Our clients love us! ⭐⭐⭐⭐⭐\n\nRecent reviews:\n\n💬 \"Exceptional work! Delivered on time and within budget.\" - Priya S.\n\n💬 \"The AI features increased our sales by 40%.\" - Rahul M.\n\n💬 \"Professional team, great communication.\" - Ananya R.\n\nRatings:\n⭐ Overall: 4.8/5\n⭐ Quality: 4.9/5\n⭐ Communication: 4.7/5\n⭐ Value: 4.8/5\n\nCheck our website for more reviews!";
                }
            },
            industries: {
                patterns: ['industry', 'sector', 'business type', 'niche', 'specialization', 'domain'],
                response: (context) => {
                    return "We serve diverse industries! 🏢\n\nExpertise in:\n🏥 Healthcare\n🛍️ E-commerce & Retail\n🍽️ Food & Restaurants\n🎓 Education\n💼 Corporate & B2B\n🏨 Hospitality\n💰 Finance & Fintech\n🏋️ Fitness & Wellness\n🎨 Creative & Media\n⚖️ Legal Services\n\nEvery industry has unique needs - we customize solutions for your sector!";
                }
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

        // Enhanced fallback with smart suggestions
        return this.getSmartFallback(message, context);
    }

    getSmartFallback(message, context) {
        const lowerMessage = message.toLowerCase();
        
        // Provide topic-specific suggestions based on keywords
        let suggestions = [];
        
        if (lowerMessage.includes('work') || lowerMessage.includes('job') || lowerMessage.includes('career')) {
            return "I can help you with our services! Are you looking for:\n\n💼 **Our portfolio** - See our previous work\n👥 **About our team** - Meet our developers\n📞 **Contact us** - Get in touch\n\nOr ask me about specific services like websites, apps, or AI features!";
        }
        
        if (lowerMessage.includes('start') || lowerMessage.includes('begin') || lowerMessage.includes('project')) {
            return "Let's get started! 🚀\n\nI can help you with:\n📊 **Get an estimate** - Quick cost calculation\n📝 **Project planning** - Discuss your requirements\n📞 **Contact sales** - Talk to our team\n\nWhat would you like to do first?";
        }
        
        if (lowerMessage.includes('help') || lowerMessage.includes('assist')) {
            return "I'm here to help! 😊\n\nI can answer questions about:\n\n💰 **Pricing** - Our packages and costs\n🛠️ **Services** - What we offer\n⏱️ **Timeline** - How long projects take\n🔒 **Security** - Data protection\n💳 **Payment** - Payment methods\n📱 **Technology** - Tech we use\n🎨 **Design** - UI/UX services\n🔧 **Maintenance** - Support packages\n⭐ **Reviews** - Client testimonials\n\nWhat would you like to know?";
        }
        
        // Default comprehensive fallback
        return this.getLocalizedResponse('error') + "\n\n💡 Here are some things I can help you with:\n\n**Popular Topics:**\n• Pricing & Packages\n• Website Development\n• Mobile Apps\n• E-commerce Solutions\n• AI Integration\n• SEO Services\n• Hosting & Domains\n• Maintenance & Support\n\n**Quick Actions:**\n• Get a project estimate\n• See our portfolio\n• Contact our team\n• Check reviews\n\nTry asking about any of these topics!";
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
    // Format message while preventing XSS - preserve line breaks
    const lines = message.split('\n');
    lines.forEach((line, index) => {
        if (index > 0) {
            messagePara.appendChild(document.createElement('br'));
        }
        messagePara.appendChild(document.createTextNode(line));
    });
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
    
    // Create spans safely without innerHTML
    for (let i = 0; i < 3; i++) {
        const span = document.createElement('span');
        typingDiv.appendChild(span);
    }
    
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
