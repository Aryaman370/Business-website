// Backend API Integration for AI Chatbot
// This module handles communication with the backend server for AI-powered responses

const API_CONFIG = {
    baseURL: '/api', // Update with your backend URL
    endpoints: {
        chat: '/chat',
        estimate: '/estimate',
        contact: '/contact',
        feedback: '/feedback'
    },
    apiKey: '', // Set via environment variable or config
    timeout: 10000, // 10 seconds
    retryAttempts: 3
};

// API Client Class
class ChatbotAPI {
    constructor(config = API_CONFIG) {
        this.config = config;
        this.requestQueue = [];
        this.isProcessing = false;
    }

    /**
     * Send message to backend AI service (OpenAI GPT, Dialogflow, etc.)
     * @param {string} message - User message
     * @param {object} context - Conversation context
     * @returns {Promise<object>} AI response
     */
    async sendMessage(message, context = {}) {
        try {
            const response = await this.makeRequest('POST', this.config.endpoints.chat, {
                message,
                context,
                sessionId: context.sessionId || chatSession.sessionId,
                timestamp: Date.now()
            });

            return response;
        } catch (error) {
            console.error('Error sending message to API:', error);
            return this.getFallbackResponse(message);
        }
    }

    /**
     * Get project estimate from backend
     * @param {object} projectDetails - Project specifications
     * @returns {Promise<object>} Estimate details
     */
    async getEstimate(projectDetails) {
        try {
            const response = await this.makeRequest('POST', this.config.endpoints.estimate, {
                projectType: projectDetails.projectType,
                numPages: projectDetails.numPages,
                features: projectDetails.features,
                timeline: projectDetails.timeline,
                sessionId: chatSession.sessionId
            });

            return response;
        } catch (error) {
            console.error('Error getting estimate:', error);
            // Fallback to client-side calculation
            return null;
        }
    }

    /**
     * Submit contact request
     * @param {object} contactData - Contact information
     * @returns {Promise<object>} Submission status
     */
    async submitContact(contactData) {
        try {
            const response = await this.makeRequest('POST', this.config.endpoints.contact, {
                ...contactData,
                sessionId: chatSession.sessionId,
                conversationHistory: chatSession.conversationHistory
            });

            return response;
        } catch (error) {
            console.error('Error submitting contact:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Send feedback
     * @param {object} feedback - User feedback
     * @returns {Promise<object>} Submission status
     */
    async sendFeedback(feedback) {
        try {
            const response = await this.makeRequest('POST', this.config.endpoints.feedback, {
                ...feedback,
                sessionId: chatSession.sessionId
            });

            return response;
        } catch (error) {
            console.error('Error sending feedback:', error);
            return { success: false };
        }
    }

    /**
     * Make HTTP request with retry logic
     * @param {string} method - HTTP method
     * @param {string} endpoint - API endpoint
     * @param {object} data - Request data
     * @returns {Promise<object>} Response data
     */
    async makeRequest(method, endpoint, data = null) {
        const url = this.config.baseURL + endpoint;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
            },
            ...(data && { body: JSON.stringify(data) })
        };

        let lastError;
        for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

                const response = await fetch(url, {
                    ...options,
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                return await response.json();
            } catch (error) {
                lastError = error;
                console.warn(`Request attempt ${attempt} failed:`, error.message);
                
                if (attempt < this.config.retryAttempts) {
                    // Exponential backoff
                    await this.sleep(Math.pow(2, attempt) * 1000);
                }
            }
        }

        throw lastError;
    }

    /**
     * Get fallback response when API is unavailable
     * @param {string} message - User message
     * @returns {object} Fallback response
     */
    getFallbackResponse(message) {
        return {
            message: "I'm currently experiencing connection issues with the AI service. However, I can still help you with basic information. Please check our website sections or try again in a moment.",
            fallback: true,
            suggestions: [
                { text: 'View Pricing', action: 'scroll_to_pricing' },
                { text: 'Contact Us', action: 'scroll_to_contact' },
                { text: 'Try Again', action: 'retry' }
            ]
        };
    }

    /**
     * Sleep utility for retry delays
     * @param {number} ms - Milliseconds to sleep
     * @returns {Promise}
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// OpenAI GPT Integration (for future implementation)
class OpenAIIntegration {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.endpoint = 'https://api.openai.com/v1/chat/completions';
        this.model = 'gpt-3.5-turbo'; // or 'gpt-4'
        this.maxTokens = 500;
        this.temperature = 0.7;
    }

    /**
     * Get AI response from OpenAI GPT
     * @param {string} message - User message
     * @param {array} history - Conversation history
     * @returns {Promise<string>} AI response
     */
    async getResponse(message, history = []) {
        const messages = [
            {
                role: 'system',
                content: `You are a helpful AI assistant for a web and app development business. 
                Your role is to:
                - Answer questions about services, pricing, and features
                - Help users estimate project costs
                - Provide information about development timelines
                - Be friendly, professional, and helpful
                
                Services offered:
                - Website Development (₹5,000 - ₹25,000)
                - App Development (₹30,000 - ₹50,000)
                - AI Integration (₹15,000 additional)
                
                Keep responses concise and actionable.`
            },
            ...history.map(h => ({
                role: h.sender === 'user' ? 'user' : 'assistant',
                content: h.message
            })),
            {
                role: 'user',
                content: message
            }
        ];

        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages,
                    max_tokens: this.maxTokens,
                    temperature: this.temperature
                })
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI API error:', error);
            throw error;
        }
    }
}

// Dialogflow Integration (for future implementation)
class DialogflowIntegration {
    constructor(config) {
        this.projectId = config.projectId;
        this.sessionId = config.sessionId;
        this.languageCode = config.languageCode || 'en-US';
    }

    /**
     * Detect intent using Dialogflow
     * @param {string} text - User text
     * @returns {Promise<object>} Intent detection result
     */
    async detectIntent(text) {
        // This would require backend proxy due to CORS and authentication
        const endpoint = `/api/dialogflow/detect-intent`;
        
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text,
                    sessionId: this.sessionId,
                    languageCode: this.languageCode
                })
            });

            return await response.json();
        } catch (error) {
            console.error('Dialogflow error:', error);
            throw error;
        }
    }
}

// Initialize API client
const chatbotAPI = new ChatbotAPI();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ChatbotAPI,
        OpenAIIntegration,
        DialogflowIntegration,
        API_CONFIG
    };
}
