# SafeHer – Women Safety Emergency & Support System 🛡️

SafeHer is a comprehensive, real-time emergency safety and monitoring system built to protect women and vulnerable individuals in critical situations. With a single click or countdown trigger, SafeHer initiates multi-channel alerts (SMS, Voice Call, and Email with live GPS coordinates) directly to trusted emergency contacts.

---

## 🌟 Key Features

- **🚨 One-Touch Emergency SOS**:
  - Instant SOS activation with audible alarm siren and visual pulse indicator.
  - Automated cancellation countdown timer with PIN protection (`1234` default).
- **📍 Real-Time GPS Tracking & Map Pin**:
  - Captures high-accuracy geolocation coordinates.
  - Generates live Google Maps location links automatically included in all alerts.
- **✉️ Web3Forms Emergency Email Alerts**:
  - Programmatically dispatches formatted emergency emails via the official Web3Forms API.
  - Live GPS coordinates, timestamp, user name, and immediate action checklist delivered straight to configured emergency inboxes.
- **📱 Automatic Emergency SMS (MSG91 Flow API)**:
  - Dispatches automated SMS messages with location links directly from the server to configured Indian phone numbers.
- **📞 Outbound Voice Calling (Twilio Voice API)**:
  - Automated outbound emergency voice calls to the designated primary contact.
- **🔊 Deterrent Alarm Siren & Fake Call Simulator**:
  - High-decibel audible siren to deter potential threats and attract attention.
  - Realistic incoming call simulator to help de-escalate uncomfortable situations.
- **⏱️ Safety Check-In Timer**:
  - Set destination check-in timers (e.g. traveling home at night) with automated alerts if not checked in on time.
- **🌐 Geofencing Safe Zones**:
  - Define custom safe zones (home, university, workplace) with entry/exit tracking.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js
- **Notification Services**:
  - **Web3Forms API**: Emergency Email Delivery
  - **MSG91 Flow v5 API**: Indian SMS Gateway
  - **Twilio REST API**: Outbound Emergency Voice Calls

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/AbhayDubey78/SafeHer-Women-Emergency-and-Support-System.git
cd SafeHer-Women-Emergency-and-Support-System
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory by copying `.env.example`:
```bash
cp .env.example .env
```

Configure your credentials in `.env`:
```env
PORT=5000

# MSG91 SMS Provider
MSG91_AUTH_KEY=your_msg91_auth_key
MSG91_TEMPLATE_ID=your_msg91_template_id
MSG91_SENDER_ID=SFHERO

# Twilio Voice Calling
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Web3Forms Emergency Email API
WEB3FORMS_ACCESS_KEY=your_web3forms_access_key
VITE_WEB3FORMS_ACCESS_KEY=your_web3forms_access_key
```

### 4. Running the Application Locally
Run both the frontend and backend servers concurrently:
```bash
npm run dev:all
```

Or run them individually:
- **Frontend App**: `npm run dev` *(Runs on http://localhost:3000)*
- **Backend API**: `npm run server` *(Runs on http://localhost:5000)*

---

## ☁️ Deploy to Render (Free)

This repository includes a `render.yaml` blueprint for 1-click deployment on [Render](https://render.com).

### Option 1: Automatic Blueprint (Recommended)
1. Sign up or log in to [Render](https://render.com) with your GitHub account.
2. Go to [dashboard.render.com/blueprints](https://dashboard.render.com/blueprints).
3. Click **New Blueprint Instance**.
4. Select `AbhayDubey78/SafeHer-Women-Emergency-and-Support-System`.
5. Enter your environment variables (`WEB3FORMS_ACCESS_KEY`, `VITE_WEB3FORMS_ACCESS_KEY`, `MSG91_AUTH_KEY`, etc.) and click **Apply**.
6. Render will automatically build both frontend & backend and deploy your full-stack app on a free `.onrender.com` URL!

### Option 2: Manual Web Service
1. On Render, click **New +** → **Web Service**.
2. Connect `AbhayDubey78/SafeHer-Women-Emergency-and-Support-System`.
3. Settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
4. Add your `.env` variables under the **Environment** tab.
5. Click **Deploy Web Service**. Render serves the built React frontend and Express API together with zero CORS issues!

---

## 🛡️ Security & Privacy
- Sensitive credentials (`.env`) are strictly excluded from version control via `.gitignore`.
- User location coordinates are only transmitted during active user-authorized SOS emergencies or explicit location sharing.
- Safe resolution requires PIN verification.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
