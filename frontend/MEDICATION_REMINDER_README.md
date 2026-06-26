# HealthLink AI - Medication Reminder Quick Start

## Features ✨

✅ **Add/Edit/Delete Reminders** - Full CRUD operations  
✅ **Persistent Storage** - Save reminders with localStorage  
✅ **Beautiful UI** - Mobile-responsive design  
✅ **Statistics Dashboard** - Track total and daily reminders  
✅ **Browser Notifications** - Desktop alerts at reminder time  
✅ **Export Data** - Download reminders as JSON  
✅ **Offline Support** - Works without internet  
✅ **Backend Integration** - Ready for SMS/Email alerts

## Running Locally

### Option 1: Simple HTML/JS (No Backend Needed)

```bash
# Just open the file in your browser
# Linux/Mac
open frontend/medication-reminder.html

# Or use a simple Python server
python -m http.server 8000
# Visit http://localhost:8000/frontend/medication-reminder.html
```

### Option 2: With Backend Support (for SMS/Email)

```bash
# Terminal 1: Start Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys
npm run dev

# Terminal 2: Start Frontend
cd frontend
npm install
npm run dev
# Visit http://localhost:3000
```

## Key Functionality

### 1. Add Reminder
- Enter medicine name
- Add dosage
- Select frequency
- Set reminder time
- Optional notes

### 2. Manage Reminders
- **Toggle**: Mark as taken
- **Edit**: Update medicine details
- **Delete**: Remove reminder
- **View Stats**: See total and daily reminders

### 3. Notifications
- Browser notifications at reminder time
- SMS alerts (when SMS service configured)
- Email reminders (when email service configured)

### 4. Data Management
- **Export**: Download all reminders as JSON
- **Clear All**: Remove all reminders
- **LocalStorage**: Auto-saves locally

## Backend Endpoints

```
POST   /api/medication/add-reminder          - Add new reminder
GET    /api/medication/reminders/:userId     - Get user's reminders
PUT    /api/medication/reminder/:reminderId  - Update reminder
DELETE /api/medication/reminder/:reminderId  - Delete reminder
POST   /api/medication/send-alert            - Send SMS/Email alert
POST   /api/medication/sync                  - Sync offline reminders
```

## Technology Stack

**Frontend:**
- HTML5
- CSS3 (with gradients & animations)
- Vanilla JavaScript
- Service Worker (for offline support)
- Local Storage API

**Backend:**
- Node.js
- Express.js
- Twilio (for SMS)
- Nodemailer (for Email)

## Configuration

### Environment Variables (.env)

```bash
# Backend
PORT=5000
NODE_ENV=development

# SMS Service (Twilio)
SMS_ACCOUNT_SID=your_sid
SMS_AUTH_TOKEN=your_token
SMS_FROM_NUMBER=+1234567890

# Email Service
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Screenshots & Demo

The app features:
- 🎨 Beautiful gradient UI
- 📱 Mobile-responsive design
- 🔔 Real-time notifications
- 📊 Statistics dashboard
- 💾 Auto-saving with localStorage
- 🌐 Offline-first architecture

## Next Steps

1. ✅ Test locally
2. ✅ Add SMS service (Twilio)
3. ✅ Configure email notifications
4. ✅ Connect to backend database
5. ✅ Deploy to production

## Support

For issues or questions, check the main [README.md](../README.md) or create an issue on GitHub.

---

**Made with ❤️ for better healthcare in Zimbabwe**
