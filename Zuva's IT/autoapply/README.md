# ZUVA IT – AI-Powered Job Application Automation

> Apply to 100s of jobs automatically with AI. ZUVA IT generates tailored ATS-optimized resumes, personalized cover letters, and sends applications via Gmail — all on autopilot.

---

## 🚀 Quick Start

### 1 · Clone & Install

```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```

### 2 · Configure Environment Variables

**Backend:**
```bash
cp backend/.env.example backend/.env
# Fill in your API keys
```

**Frontend:**
```bash
cp frontend/.env.example frontend/.env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3 · Run Development Servers

```bash
# Terminal 1 – Backend (port 5000)
cd backend
npm run dev

# Terminal 2 – Frontend (port 3000)
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🏗️ Project Structure

```
zuva-it/
├── frontend/                  # Next.js 14 App Router + Tailwind + Framer Motion
│   ├── app/
│   │   ├── page.tsx           # Landing page (hero, features, pricing, CTA)
│   │   ├── login/page.tsx     # Login with Google OAuth
│   │   ├── register/page.tsx  # Register with password strength
│   │   ├── dashboard/page.tsx # 4-tab dashboard
│   │   └── pricing/page.tsx   # Pricing with Razorpay integration
│   ├── components/
│   │   ├── Navbar.tsx         # Sticky navbar with theme toggle
│   │   ├── ResumeUploader.tsx # Drag & drop with AES-256 encrypt
│   │   ├── JobCard.tsx        # Job card with AI Optimize + Auto Apply
│   │   ├── ApplicationTracker.tsx  # Status timeline
│   │   ├── AIOptimizeModal.tsx     # AI resume & cover letter modal
│   │   └── PricingCard.tsx    # Animated pricing card
│   └── lib/
│       ├── api.ts             # Axios with JWT auto-attach
│       └── auth.ts            # Auth helpers
│
└── backend/                   # Node.js + Express
    └── src/
        ├── server.js          # Express entry point
        ├── config/db.js       # MongoDB connection
        ├── models/            # User, Resume, Job, Application
        ├── middleware/        # JWT auth, rate limiting
        ├── routes/            # auth, resume, jobs, applications, payments
        ├── services/          # ai, gmail, crypto
        └── jobs/              # jobFetcher.job.js (Remotive + Adzuna)
```

---

## 🔑 Required API Keys

| Service | Key | Purpose |
|---------|-----|---------|
| MongoDB Atlas | `MONGODB_URI` | Database |
| OpenAI | `OPENAI_API_KEY` | AI resume/cover letter |
| Google Cloud | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | OAuth + Gmail API |
| Razorpay | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | Payments (INR) |
| Stripe (optional) | `STRIPE_SECRET_KEY` | Payments (USD) |
| Adzuna (optional) | `ADZUNA_APP_ID`, `ADZUNA_API_KEY` | Extra job data |

---

## ✨ Features

| Feature | Status |
|---------|--------|
| JWT + Google OAuth auth | ✅ |
| Resume upload (PDF/DOCX) with AES-256 encryption | ✅ |
| AI ATS resume optimization (GPT-4o-mini) | ✅ |
| AI cover letter generation | ✅ |
| Job fetching from Remotive (free, no key needed) | ✅ |
| Job fetching from Adzuna API | ✅ |
| Gmail auto-send via OAuth | ✅ |
| Application tracker | ✅ |
| Razorpay payment integration | ✅ |
| Stripe checkout | ✅ |
| Free plan limit (5 apps/day) | ✅ |
| Dark/Light mode | ✅ |
| Rate limiting + Helmet security | ✅ |

---

## 🌐 Deployment

### Frontend → Vercel
```bash
cd frontend
npx vercel
# Set NEXT_PUBLIC_API_URL to your backend URL
```

### Backend → Render
1. Create new Web Service on [render.com](https://render.com)
2. Connect your GitHub repo
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add all environment variables from `.env.example`

### Database → MongoDB Atlas
Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)

---

## 🔒 Security

- Passwords hashed with **bcrypt** (12 rounds)
- Resumes encrypted with **AES-256-CBC** at rest
- JWT tokens expire in 7 days
- Rate limiting: 100 req/15min global, 5 req/min on auth
- CORS restricted to frontend URL
- Helmet security headers

---

## 📜 API Reference

```
POST   /api/auth/register         Register new user
POST   /api/auth/login            Login, returns JWT
GET    /api/auth/me               Get current user (protected)
PUT    /api/auth/preferences      Update job preferences (protected)
GET    /api/auth/google           Google OAuth start
GET    /api/auth/google/callback  Google OAuth callback

POST   /api/resume/upload         Upload and encrypt resume (protected)
POST   /api/resume/optimize       AI optimize resume (protected)
POST   /api/resume/cover-letter   Generate cover letter (protected)

GET    /api/jobs                  Paginated jobs list (protected)
GET    /api/jobs/latest           Jobs from last 3 hours (protected)

POST   /api/apply                 Auto-apply to job (protected)
GET    /api/applications          List user applications (protected)

POST   /api/payments/razorpay/order   Create Razorpay order (protected)
POST   /api/payments/razorpay/verify  Verify payment + upgrade plan (protected)
POST   /api/payments/stripe/checkout  Stripe checkout session (protected)
```

---

Built with ❤️ by ZUVA IT Team
