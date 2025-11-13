# 🔐 N-Device Auth System with Auth0, Next.js & MongoDB

A full-stack authentication system built with **Next.js 15**, **Auth0**, **MongoDB Atlas**, and **Socket.io**, featuring concurrent device session limits, real-time force logout, and a modern UI powered by **shadcn/ui**, **TailwindCSS**, and **GSAP**.

---

## 🚀 Overview

This application allows a user to stay logged in on a maximum of **3 devices** concurrently.  
If a 4th login occurs, the app redirects to a **Device Management screen** where the user can choose one active device to force logout before proceeding.

All forced logouts happen **instantly and gracefully in real-time** using **Socket.io**.

---

## ✨ Features

- 🔐 **Auth0 Authentication** – Secure login/logout/session handling  
- 💻 **Concurrent Session Limit (N=3)** – Enforced across all devices  
- ⚡ **Real-Time Force Logout** – Uses Socket.io for instant logout notifications  
- 📱 **Device Identification** – Unique `deviceId` stored locally per browser  
- 📇 **Phone Number Onboarding** – User must enter phone number on first login  
- 🧠 **Polished UI** – Built using shadcn/ui + TailwindCSS + GSAP animations  
- ☁️ **Deployed on Vercel** – Node.js runtime for MongoDB and Socket.io  

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | Next.js 15, TypeScript, TailwindCSS, shadcn/ui, GSAP |
| **Authentication** | Auth0 Next.js SDK |
| **Database** | MongoDB Atlas (Mongoose) |
| **Real-Time** | Socket.io |
| **Deployment** | Vercel |

---

## ⚙️ Environment Variables

Create a `.env.local` file in your project root:

```bash
# Auth0
AUTH0_SECRET=your_random_long_secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-tenant-region.auth0.com
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret

# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<db>?retryWrites=true&w=majority

```
# Multi-Device Authentication System

A Next.js application with Auth0 authentication and device management featuring real-time session control using Socket.io.

## 🗂️ Folder Structure

```
my-app/
├── app/
│   ├── api/
│   │   ├── device/
│   │   │   ├── validate/route.ts
│   │   │   ├── list/route.ts
│   │   │   └── force-logout/route.ts
│   │   └── user/profile/route.ts
│   ├── private/
│   │   ├── page.tsx           # Dashboard
│   │   ├── setup/page.tsx     # First-login phone setup
│   ├── device-limit/page.tsx  # Shown when N-device limit reached
│   ├── page.tsx               # Public landing page
│   └── layout.tsx
├── components/
│   ├── DeviceModal.tsx
│   └── ui/...
├── models/
│   ├── UserDevice.ts
│   └── UserProfile.ts
├── lib/
│   ├── auth0.ts
│   └── mongodb.ts
└── pages/api/socket.ts        # Socket.io server
```

## 🧠 How It Works

### 1. Login with Auth0
Auth0 authenticates and redirects to `/api/device/validate`.

### 2. Device Validation
- If user has < 3 active devices → new device is added.
- If user already has 3 devices → redirected to `/device-limit`.

### 3. Device Limit Screen
- Displays all active devices.
- User selects one to force logout.
- Selected device receives "force_logout" via Socket.io.

### 4. Real-Time Force Logout
The kicked device shows an alert and redirects to `/auth/logout`.

### 5. Profile Setup
- On first login, user must provide a phone number (`/private/setup`).
- Once saved, redirected to the dashboard (`/private`).

## 🧠 API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/device/validate` | GET | Checks active devices & enforces N limit |
| `/api/device/list` | GET | Returns all active devices for a user |
| `/api/device/force-logout` | POST | Removes target device & triggers Socket.io event |
| `/api/user/profile` | GET/POST | Fetches or saves user phone number |
| `/pages/api/socket` | WebSocket | Handles real-time force logout events |

## 🧩 MongoDB Models

### UserDevice

| Field | Type | Description |
|-------|------|-------------|
| userId | string | Auth0 user ID |
| deviceId | string | Unique device UUID |
| userAgent | string | Browser/device info |
| socketId | string | Active socket connection |
| createdAt | Date | Timestamp |

### UserProfile

| Field | Type | Description |
|-------|------|-------------|
| userId | string | Auth0 user ID |
| phone | string | Phone number |

## 🧪 Running Locally

```bash
npm install
npm run dev
```

1. Visit http://localhost:3000
2. Login → redirect to setup (if first login)
3. Enter phone number → redirect to dashboard
4. Try logging in from 4th browser → choose a device to logout

## ☁️ Deployment on Vercel

1. Push code to GitHub.
2. Import repository into Vercel.
3. Add all environment variables under Settings → Environment Variables.
4. Make sure all database routes include:
   ```typescript
   export const runtime = "nodejs";
   ```
5. Deploy 🚀

### Update Auth0 Settings

Update your Auth0 app settings:
- **Allowed Callback URLs**: `https://your-domain.vercel.app/auth/callback`
- **Allowed Logout URLs**: `https://your-domain.vercel.app/`
- **Allowed Web Origins**: `https://your-domain.vercel.app`

## 🎨 Screens & Flow

1. **Public Landing Page** → Login button
2. **Phone Setup Page** → On first login
3. **Private Dashboard** → Name, Email, Phone, Manage Devices
4. **Device Limit Screen** → If logged in on >3 devices
5. **Real-Time Force Logout** → Instantly logged out on kicked device

## 🧠 Future Improvements

- Add device name parsing (browser + OS icons)
- Implement "Remember this device" toggle
- Add admin dashboard for session monitoring

## 🏁 Author

**Anirban Sinha**  
Web Developer • React | Next.js | TypeScript | Node.js
