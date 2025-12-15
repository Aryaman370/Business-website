/**
 * Sample Node.js Backend Server for AI Chatbot
 * 
 * This is a reference implementation showing how to integrate:
 * - OpenAI GPT API for conversational AI
 * - Project cost estimation
 * - Contact form handling
 * - Session management
 * 
 * To use this server:
 * 1. Install dependencies: npm install express cors dotenv openai body-parser
 * 2. Create .env file with your API keys
 * 3. Run: node server.js
 */

// Dependencies (install via npm)
// const express = require('express');
// const cors = require('cors');
// const { Configuration, OpenAIApi } = require('openai');
// require('dotenv').config();

// Server configuration example
const SERVER_CONFIG = {
    port: process.env.PORT || 3000,
    corsOrigin: process.env.CORS_ORIGIN || '*',
    openaiApiKey: process.env.OPENAI_API_KEY,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
};

/**
 * Example Express.js server setup
 */
function createServer() {
    /*
    const app = express();
    
    // Middleware
    app.use(cors({ origin: SERVER_CONFIG.corsOrigin }));
    app.use(express.json());
    app.use(express.static('public'));

    // Session storage (use Redis in production)
    const sessions = new Map();

    // OpenAI Configuration
    const configuration = new Configuration({
        apiKey: SERVER_CONFIG.openaiApiKey,
    });
    const openai = new OpenAIApi(configuration);

    // POST /api/chat - Handle chat messages
    app.post('/api/chat', async (req, res) => {
        try {
            const { message, context, sessionId } = req.body;

            // Get or create session
            let session = sessions.get(sessionId) || {
                id: sessionId,
                history: [],
                context: {},
                createdAt: Date.now()
            };

            // Update session context
            session.context = { ...session.context, ...context };
            session.lastActivity = Date.now();

            // Prepare messages for OpenAI
            const messages = [
                {
                    role: 'system',
                    content: `You are a helpful AI assistant for an AI-powered web and app development business.
                    
                    Services and Pricing:
                    - Basic Website: ₹5,000 (up to 5 pages)
                    - Portfolio Website: ₹10,000 (up to 10 pages)
                    - Small Business Website: ₹25,000 (unlimited pages)
                    - Basic App: ₹30,000 (single platform)
                    - Business App: ₹40,000 (multi-platform)
                    - Custom Mini App: ₹50,000 (full features)
                    
                    Additional Features:
                    - User Authentication: +₹5,000
                    - Payment Integration: +₹10,000
                    - AI Features: +₹15,000
                    - API Integration: +₹8,000
                    
                    Contact: info@aisolutions.com, +91 98765 43210
                    Location: Mumbai, Maharashtra, India
                    
                    Provide helpful, concise responses. Help users estimate costs and choose the right package.`
                },
                ...session.history.map(h => ({
                    role: h.sender === 'user' ? 'user' : 'assistant',
                    content: h.message
                })),
                {
                    role: 'user',
                    content: message
                }
            ];

            // Call OpenAI API (SDK v4.x)
            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages,
                max_tokens: 500,
                temperature: 0.7,
            });

            const aiResponse = completion.choices[0].message.content;

            // Update session history
            session.history.push({ message, sender: 'user', timestamp: Date.now() });
            session.history.push({ message: aiResponse, sender: 'bot', timestamp: Date.now() });

            // Keep only last 20 messages
            if (session.history.length > 20) {
                session.history = session.history.slice(-20);
            }

            // Save session
            sessions.set(sessionId, session);

            res.json({
                success: true,
                message: aiResponse,
                sessionId: sessionId,
                context: session.context
            });

        } catch (error) {
            console.error('Chat API error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to process message',
                message: 'I apologize, but I encountered an error. Please try again or contact us directly.'
            });
        }
    });

    // POST /api/estimate - Calculate project estimate
    app.post('/api/estimate', async (req, res) => {
        try {
            const { projectType, numPages, features, timeline } = req.body;

            let basePrice = 0;
            const pages = parseInt(numPages) || 5;

            // Calculate base price
            if (projectType === 'website') {
                if (pages <= 5) basePrice = 5000;
                else if (pages <= 10) basePrice = 10000;
                else basePrice = 25000;
                
                if (pages > 5) {
                    basePrice += (pages - 5) * 1000;
                }
            } else if (projectType === 'app') {
                basePrice = 30000;
                if (pages > 5) {
                    basePrice += (pages - 5) * 2000;
                }
            } else if (projectType === 'both') {
                basePrice = 50000;
                if (pages > 5) {
                    basePrice += (pages - 5) * 1500;
                }
            }

            // Add features cost
            const featureCosts = {
                auth: 5000,
                payment: 10000,
                ai: 15000,
                api: 8000
            };

            const featuresCost = (features || []).reduce((sum, feature) => {
                return sum + (featureCosts[feature] || 0);
            }, 0);

            // Calculate timeline multiplier
            const timelineMultiplier = timeline === 'rush' ? 1.5 : 1;

            const totalCost = (basePrice + featuresCost) * timelineMultiplier;
            const estimatedTimeline = projectType === 'app' ? '3-4 weeks' : '2-3 weeks';

            res.json({
                success: true,
                estimate: {
                    basePrice,
                    featuresCost,
                    totalCost,
                    timeline: estimatedTimeline,
                    breakdown: {
                        projectType,
                        numPages: pages,
                        features: features || [],
                        rushDelivery: timeline === 'rush'
                    }
                }
            });

        } catch (error) {
            console.error('Estimate API error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to calculate estimate'
            });
        }
    });

    // POST /api/contact - Handle contact form submissions
    app.post('/api/contact', async (req, res) => {
        try {
            const { name, email, phone, message, sessionId, conversationHistory } = req.body;

            // Validate input
            if (!name || !email || !message) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields'
                });
            }

            // Here you would:
            // 1. Store in database
            // 2. Send email notification
            // 3. Create CRM entry
            
            console.log('Contact submission:', { name, email, phone, message });

            res.json({
                success: true,
                message: 'Thank you for contacting us! We will get back to you soon.',
                ticketId: `TICKET-${Date.now()}`
            });

        } catch (error) {
            console.error('Contact API error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to submit contact form'
            });
        }
    });

    // POST /api/feedback - Handle user feedback
    app.post('/api/feedback', async (req, res) => {
        try {
            const { rating, comment, sessionId } = req.body;

            // Store feedback in database
            console.log('Feedback received:', { rating, comment, sessionId });

            res.json({
                success: true,
                message: 'Thank you for your feedback!'
            });

        } catch (error) {
            console.error('Feedback API error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to submit feedback'
            });
        }
    });

    // Clean up old sessions periodically
    setInterval(() => {
        const now = Date.now();
        for (const [sessionId, session] of sessions.entries()) {
            if (now - session.lastActivity > SERVER_CONFIG.sessionTimeout) {
                sessions.delete(sessionId);
                console.log(`Cleaned up expired session: ${sessionId}`);
            }
        }
    }, 5 * 60 * 1000); // Run every 5 minutes

    // Start server
    app.listen(SERVER_CONFIG.port, () => {
        console.log(`🚀 AI Chatbot Backend running on port ${SERVER_CONFIG.port}`);
        console.log(`📡 CORS enabled for: ${SERVER_CONFIG.corsOrigin}`);
    });

    return app;
    */
}

// Example .env file content:
/*
PORT=3000
OPENAI_API_KEY=your_openai_api_key_here
CORS_ORIGIN=http://localhost:8000
NODE_ENV=development

# Email Configuration (for contact form)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Database (optional)
DATABASE_URL=mongodb://localhost:27017/chatbot
*/

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SERVER_CONFIG,
        createServer
    };
}

console.log('This is a reference implementation for the backend server.');
console.log('To use this, create a separate Node.js project and install required dependencies.');
