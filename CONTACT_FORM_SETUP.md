# Contact Form Email Integration Setup Guide

This guide explains how to set up the email functionality for the Contact Us section.

## Features

✅ **Modern, Bold Design** with animations and gradients  
✅ **Live Form Validation** for name, email, and message fields  
✅ **Character Counter** for message field  
✅ **Multiple Email Service Options** (Gmail, SendGrid, Mailgun)  
✅ **Input Sanitization** to prevent XSS attacks  
✅ **Rate Limiting** to prevent spam (3 requests per minute per IP)  
✅ **Responsive Design** for all screen sizes  
✅ **Success/Error Messages** with smooth animations  

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Email Service

Choose one of the following email service options:

#### Option A: Gmail (Easiest for Testing)

1. Enable 2-Factor Authentication in your Gmail account
2. Generate an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password
3. Create a `.env` file:

```bash
cp .env.example .env
```

4. Edit `.env` with your credentials:

```env
EMAIL_SERVICE=gmail
GMAIL_USER=your.email@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password
```

#### Option B: SendGrid (Recommended for Production)

1. Sign up for SendGrid at https://sendgrid.com/
2. Create an API key
3. Verify your sender email
4. Update `.env`:

```env
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_SENDER=noreply@yourdomain.com
```

#### Option C: Mailgun (Alternative for Production)

1. Sign up for Mailgun at https://www.mailgun.com/
2. Get your API key and domain
3. Update `.env`:

```env
EMAIL_SERVICE=mailgun
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=mg.yourdomain.com
```

### 3. Start the Server

```bash
npm start
```

For development with auto-restart:

```bash
npm run dev
```

The server will run on http://localhost:3000

## Testing the Contact Form

### Development Mode (No Email Service)

If you don't configure an email service, the form will still work and log submissions to the console. This is useful for testing.

### With Email Service Configured

1. Open the website in your browser
2. Navigate to the Contact Us section
3. Fill out the form:
   - **Name**: At least 2 characters, letters and spaces only
   - **Email**: Valid email format (live validation)
   - **Message**: At least 10 characters
4. Click "Send Inquiry"
5. Check your email at `aryaman@gmail.com`

## Form Validation Rules

| Field | Required | Validation |
|-------|----------|------------|
| Name | Yes | Min 2 chars, letters and spaces only, max 100 chars |
| Email | Yes | Valid email format with live validation |
| Phone | No | No specific format required |
| Inquiry Type | No | Dropdown: Project/Support/General/Quote |
| Message | Yes | Min 10 chars, max 1000 chars with counter |

## Security Features

### Input Sanitization
All user inputs are sanitized to prevent XSS attacks:
- HTML tags are stripped
- Special characters are escaped
- Input lengths are validated

### Rate Limiting
- Maximum 3 requests per minute per IP address
- Prevents spam and abuse
- Returns 429 status code when limit exceeded

### CORS Protection
- Configured to accept requests from allowed origins
- Can be customized via `CORS_ORIGIN` environment variable

## Email Template

The contact form sends beautifully formatted HTML emails with:
- Gradient header with inquiry type badge
- Organized field display
- Direct reply-to functionality
- Timestamp in IST timezone

## API Endpoints

### POST /api/contact

Send a contact form submission.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 98765 43210",
  "inquiryType": "project",
  "message": "I would like to build a website..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Thank you for contacting us! We will get back to you within 24 hours.",
  "ticketId": "CONTACT-1234567890"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Invalid email address"
}
```

### GET /api/health

Check if the server is running.

**Response:**
```json
{
  "status": "ok",
  "service": "contact-form-api"
}
```

## Frontend Integration

The contact form automatically handles:
1. **Live validation** as users type
2. **Character counting** for the message field
3. **Loading states** with animated spinner
4. **Success/error messages** with icons
5. **Automatic fallback** if backend is unavailable

## Deployment

### Deploy to Heroku

1. Create a new Heroku app
2. Set environment variables:
   ```bash
   heroku config:set EMAIL_SERVICE=gmail
   heroku config:set GMAIL_USER=your.email@gmail.com
   heroku config:set GMAIL_APP_PASSWORD=your_password
   ```
3. Deploy:
   ```bash
   git push heroku main
   ```

### Deploy to Vercel/Netlify

For serverless deployment, you'll need to adapt the backend to use serverless functions. Alternatively, use EmailJS directly from the frontend.

### Using EmailJS (Frontend-Only Alternative)

If you prefer not to run a backend server:

1. Sign up at https://www.emailjs.com/
2. Create an email service and template
3. Update the `sendViaEmailJS` function in `js/script.js` with your credentials

## Troubleshooting

### Emails Not Sending

1. **Check server logs** for error messages
2. **Verify email service credentials** in `.env`
3. **Check spam folder** for test emails
4. **Gmail users**: Ensure App Password is enabled
5. **SendGrid users**: Verify sender email address

### Form Validation Issues

1. **Clear browser cache** and reload
2. **Check browser console** for JavaScript errors
3. **Verify all required fields** have valid input

### Rate Limit Errors

1. Wait 1 minute before trying again
2. Check if multiple users are testing from the same network
3. Adjust rate limit in server configuration if needed

## Customization

### Change Recipient Email

Edit `server.js` and change `aryaman@gmail.com` to your desired email address in:
- Line 154 (Nodemailer)
- Line 168 (SendGrid)
- Line 183 (Mailgun)

### Modify Email Template

Edit the `generateEmailHTML()` function in `server.js` to customize:
- Colors and styling
- Layout structure
- Additional fields
- Branding elements

### Adjust Rate Limits

In `server.js`, modify:
```javascript
const RATE_LIMIT_WINDOW = 60000; // milliseconds
const MAX_REQUESTS_PER_WINDOW = 3; // requests
```

## Support

For issues or questions:
- Email: aryaman@gmail.com
- Check server logs: `npm start` output
- Review browser console for frontend errors

## License

ISC
