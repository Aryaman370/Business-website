# Enhanced AI Chatbot Documentation

## Overview

This AI-powered chatbot provides intelligent conversational support for the business website. It features contextual understanding, session memory, multi-language support, voice interaction, and file upload capabilities.

## Features Implemented

### Phase 1: Modern UI & Interactive Components ✅

- **Expandable Chatbot Widget**
  - Floating button with pulse animation
  - Smooth slide-up animation when opened
  - Minimizable/expandable interface
  - Status indicator (online/offline)

- **Enhanced Message Display**
  - User and bot message bubbles with distinct styling
  - Typing indicators during bot responses
  - Message timestamps
  - Smooth scroll animations
  - Quick reply buttons for common queries

- **Interactive Input Components**
  - Text input with focus states
  - Voice input button (speech-to-text)
  - File upload button (for designs/wireframes)
  - Send button with hover effects

### Phase 2: Advanced Conversational Capabilities ✅

- **Session Memory**
  - Maintains conversation history within session
  - Remembers user preferences (project type, budget, etc.)
  - Auto-saves to localStorage
  - 30-minute session timeout

- **Contextual Responses**
  - Understands project types (Website/App/Both)
  - Remembers number of pages and features
  - Provides personalized recommendations
  - Context-aware follow-up questions

- **Project Assistance**
  - Collects project requirements interactively
  - Calculates project cost estimates
  - Provides timeline estimates
  - Suggests appropriate packages

- **FAQ Handling**
  - Pricing information
  - Service descriptions
  - Timeline and delivery details
  - Contact information
  - AI features explanation

### Phase 3: Backend Integration Structure ✅

- **API Integration Module** (`api-integration.js`)
  - Ready for OpenAI GPT integration
  - Dialogflow support structure
  - Retry logic with exponential backoff
  - Fallback responses when API unavailable

- **Sample Backend Server** (`server-reference.js`)
  - Node.js/Express.js example
  - OpenAI GPT integration pattern
  - Session management
  - Endpoint examples for chat, estimate, contact

### Phase 4: Enhanced Features ✅

- **Multi-Language Support**
  - English (default)
  - Hindi (हिंदी)
  - Support structure for:
    - Marathi (मराठी)
    - Gujarati (ગુજરાતી)
    - Tamil (தமிழ்)
    - Telugu (తెలుగు)
    - Bengali (বাংলা)

- **Voice Interaction**
  - Speech-to-text using Web Speech API
  - Supports English and Hindi
  - Visual feedback during recording
  - Error handling for unsupported browsers

- **File Upload**
  - Upload images (designs/wireframes)
  - PDF document support
  - 5MB file size limit
  - Upload confirmation messages

## File Structure

```
js/
├── chatbot.js              # Main chatbot logic
├── api-integration.js      # Backend API communication
├── script.js               # General website scripts
└── server-reference.js     # Backend server example (reference)
```

## Usage

### Basic Chat Interaction

1. Click the floating chatbot button (bottom-right)
2. Type your message or use voice input
3. Press Enter or click send button
4. View bot responses with typing indicator

### Quick Replies

Click on quick reply buttons for common queries:
- 💰 Pricing
- 🛠️ Services
- 📊 Get Estimate

### Getting a Project Estimate

1. Ask "I want to get an estimate"
2. Specify project type (Website/App/Both)
3. Provide number of pages/screens
4. Select additional features
5. Receive detailed cost breakdown

### Voice Input

1. Click microphone button
2. Speak your message
3. Text appears in input field
4. Review and send

### File Upload

1. Click paperclip button
2. Select image or PDF file
3. File uploads with confirmation
4. Bot acknowledges receipt

## Session Management

- **Auto-Save**: Conversations saved to localStorage
- **Session ID**: Unique ID generated per session
- **Timeout**: 30 minutes of inactivity
- **Context Preservation**: Project details remembered
- **Clear Session**: Automatically on timeout

## Responsive Design

- **Desktop** (≥992px): Full-width 380px widget
- **Tablet** (768-991px): Responsive width
- **Mobile** (<768px): Full-width with padding
- **Small Mobile** (<576px): Optimized for small screens

## Browser Compatibility

### Full Support
- Chrome 90+
- Edge 90+
- Safari 14+
- Firefox 88+

### Voice Input Support
- Chrome/Edge only (Web Speech API)
- Safari and Firefox: Text input only

## Configuration

### Chatbot Config (`chatbot.js`)

```javascript
const CHATBOT_CONFIG = {
    apiEndpoint: '/api/chat',        // Backend API endpoint
    enableVoice: true,               // Enable voice input
    enableFileUpload: true,          // Enable file uploads
    enableMultiLanguage: true,       // Multi-language support
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    typingDelay: 1000,              // Typing indicator delay
    supportedLanguages: ['en', 'hi', 'mr', 'gu', 'ta', 'te', 'bn']
};
```

### API Config (`api-integration.js`)

```javascript
const API_CONFIG = {
    baseURL: '/api',
    timeout: 10000,
    retryAttempts: 3
};
```

## Backend Integration

### Prerequisites

1. Node.js 14+ installed
2. npm or yarn package manager
3. OpenAI API key (for GPT integration)

### Setup

1. Create new Node.js project:
```bash
mkdir chatbot-backend
cd chatbot-backend
npm init -y
```

2. Install dependencies:
```bash
npm install express cors dotenv openai body-parser
```

3. Create `.env` file:
```env
PORT=3000
OPENAI_API_KEY=your_api_key_here
CORS_ORIGIN=http://localhost:8000
```

4. Use `server-reference.js` as template
5. Start server:
```bash
node server.js
```

### API Endpoints

#### POST `/api/chat`
Handle chat messages with AI response

**Request:**
```json
{
  "message": "What are your pricing options?",
  "context": { "projectType": "website" },
  "sessionId": "session_123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Our website packages start from ₹5,000...",
  "sessionId": "session_123",
  "context": { "projectType": "website" }
}
```

#### POST `/api/estimate`
Calculate project cost estimate

**Request:**
```json
{
  "projectType": "website",
  "numPages": 10,
  "features": ["auth", "payment"],
  "timeline": "standard"
}
```

**Response:**
```json
{
  "success": true,
  "estimate": {
    "basePrice": 10000,
    "featuresCost": 15000,
    "totalCost": 25000,
    "timeline": "2-3 weeks"
  }
}
```

## Customization

### Adding New Intents

Edit `chatbot.js`, add to `AIResponseEngine.loadIntents()`:

```javascript
newIntent: {
    patterns: ['keyword1', 'keyword2'],
    response: (context) => {
        return "Your response here";
    }
}
```

### Adding New Languages

1. Add language code to `supportedLanguages`
2. Add translations to `RESPONSES` object
3. Update voice recognition language codes

### Styling Customization

Edit `style.css`:

```css
.chatbot-container {
    /* Customize colors, sizes, animations */
}
```

## Testing

### Manual Testing Checklist

- [ ] Open/close chatbot widget
- [ ] Send text messages
- [ ] Use quick reply buttons
- [ ] Test voice input (Chrome/Edge)
- [ ] Upload files (images/PDFs)
- [ ] Get project estimate
- [ ] Test on mobile device
- [ ] Verify session persistence
- [ ] Check responsive design

### Browser Console Testing

```javascript
// Access chatbot session
console.log(chatSession.getContext());

// View conversation history
console.log(chatSession.conversationHistory);

// Test AI response engine
console.log(aiEngine.getResponse("test message"));
```

## Performance

- **Initial Load**: ~30KB (chatbot.js)
- **API Integration**: ~10KB (api-integration.js)
- **Memory Usage**: <5MB (typical session)
- **LocalStorage**: <1MB (session data)

## Security Considerations

- XSS Protection: Uses `textContent` instead of `innerHTML`
- File Upload: Size and type validation
- API Security: CORS configuration required
- Session Security: Auto-timeout after inactivity
- Input Sanitization: Escapes special characters

## Future Enhancements

### Planned Features

- [ ] Sentiment analysis
- [ ] Conversation analytics
- [ ] Custom training on company data
- [ ] Screen sharing support
- [ ] Video chat integration
- [ ] Advanced NLU with Rasa
- [ ] Webhook integrations
- [ ] CRM integration

## Troubleshooting

### Chatbot Not Appearing

- Check if `chatbot.js` is loaded
- Verify HTML includes chatbot widget
- Check browser console for errors

### Voice Input Not Working

- Only works in Chrome/Edge
- Check microphone permissions
- Ensure HTTPS (required for speech API)

### API Integration Issues

- Verify backend server is running
- Check CORS configuration
- Validate API endpoint URLs
- Review network tab in DevTools

## Support

For issues or questions:
- Email: info@aisolutions.com
- Phone: +91 98765 43210
- GitHub: Create an issue in repository

## License

This chatbot implementation is part of the AI Solutions Business Website project.

---

**Built with ❤️ using AI-Assisted Development**
