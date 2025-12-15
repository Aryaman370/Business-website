# Quick Start Guide - AI Chatbot

## 🚀 Get Started in 3 Steps

### Step 1: View the Website

Simply open `index.html` in a web browser:

```bash
# Using Python HTTP server
python3 -m http.server 8000

# Then open: http://localhost:8000
```

Or deploy to:
- GitHub Pages (free)
- Netlify (free)
- Vercel (free)

### Step 2: Test the Chatbot

1. Click the purple chat button in bottom-right corner
2. Try these commands:
   - "What are your pricing options?"
   - "I need a website"
   - "I want to get an estimate"
   - "Tell me about AI features"

3. Test advanced features:
   - Click quick reply buttons
   - Try voice input (Chrome/Edge only)
   - Upload a file (click paperclip icon)

### Step 3: Deploy (Optional)

**Frontend Only** (Works immediately)
```bash
# Deploy to GitHub Pages
git push origin main

# Or use Netlify/Vercel (drag & drop)
```

**With Backend** (For full AI features)
```bash
# 1. Set up backend
cd backend
npm install
echo "OPENAI_API_KEY=your_key" > .env
node server.js

# 2. Update frontend API URL in js/api-integration.js
# 3. Deploy both frontend and backend
```

## 📚 Documentation

- **CHATBOT_README.md** - Complete chatbot documentation
- **DEPLOYMENT.md** - Deployment guide for all platforms
- **IMPLEMENTATION_SUMMARY.md** - Project overview and features

## ✨ Features Available

✅ **Works Immediately** (No setup required)
- Interactive chatbot UI
- FAQ responses
- Project cost estimation
- Multi-language support
- Voice input (Chrome/Edge)
- File upload

🔧 **Requires Backend** (Optional, for full AI)
- OpenAI GPT integration
- Advanced conversational AI
- Custom training
- Analytics

## 🎯 Test Page

Open `test-chatbot.html` for a dedicated testing environment with:
- Feature checklist
- Sample queries
- Testing instructions

## 💡 Quick Tips

1. **Mobile Testing**: Open on phone - chatbot is fully responsive
2. **Voice Input**: Only works on Chrome/Edge, requires HTTPS
3. **Session Memory**: Chatbot remembers conversation for 30 min
4. **Language**: Say "language" to see multi-language support

## 🔒 Security

- Zero vulnerabilities (CodeQL verified)
- XSS protection implemented
- Secure file upload handling
- Session timeout protection

## 📞 Support

- Email: info@aisolutions.com
- Phone: +91 98765 43210
- Docs: See CHATBOT_README.md

---

**Ready to use!** No build process needed for basic functionality.
