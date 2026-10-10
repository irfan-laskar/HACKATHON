# MarketSphere — Marketing Knowledge & Educational Video-Sharing Platform

**MarketSphere** is a complete, modern, fully responsive educational web application designed to empower students, creators, and small business owners to learn marketing, branding, commercial product photography, business registration, GST compliance, and entrepreneurship.

Inspired by the usability of YouTube, the editorial cleanliness of Medium, and the structured course paths of Coursera.

---

## 🌟 Core Pillars

1. **Marketing Knowledge Hub:** In-depth educational articles, step-by-step masterclasses, and practical frameworks covering the 4Ps, 7Ps, STP segmentation, SEO architecture, organic reach, and WhatsApp sales funnels.
2. **Educational Video Platform:** A YouTube-style platform where registered creators upload high-yield educational videos (MP4/WebM) with custom thumbnails, learning objectives, like and comment interactions, and moderation queues.
3. **Small Business Startup & Growth Academy:** A sequential 12-step roadmap from ideation to scaling, dedicated niche blueprints (Home bakery, local retail, clothing brand), and an interactive **Unit Economics & Margin Calculator**.
4. **Branding & Commercial Photography Academy:** Principles of color psychology and typography paired with a **DIY Lighting Studio Simulator** demonstrating how to shoot professional product photos on a smartphone using an ₹80 foam board reflector.
5. **Indian Business Registration & GST Guide:** India-focused compliance breakdowns comparing Sole Proprietorship, LLP, and Private Limited structures, official Udyam MSME portal guide, GST invoicing thresholds, and authoritative government links with statutory disclaimers.
6. **Brand Collaboration & Influencer Hub:** Micro vs nano-creator outreach playbook featuring **one-click copyable pitch proposal scripts**, ASCI/FTC disclosure guidelines, and deliverable rate card estimators.
7. **Creator & Admin Dashboards:** Dedicated studios for creators to manage video uploads and track views/likes, plus a protected administrative compliance portal for role toggling, user suspensions, and moderation queues.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 19 with Vite & TypeScript
- **Styling:** Tailwind CSS with custom fonts (`Outfit` and `Inter`)
- **Icons:** Lucide React
- **Animations:** Framer Motion for toasts, modals, and interactive transitions
- **Routing:** React Router v7
- **HTTP Client:** Axios with JWT request interceptors

### Backend
- **Runtime:** Node.js (v24+) & Express.js
- **Database:** MongoDB with Mongoose (with dual-mode support for MongoDB Atlas & embedded zero-dependency local store)
- **Authentication:** JWT with bcrypt password hashing and HTTP-only cookie support
- **Uploads & Media:** Multer with hybrid disk storage (`/uploads`) and direct Cloudinary cloud storage
- **Security:** Helmet HTTP security headers, CORS origin protection, role-based authorization

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Installation
Clone or navigate to the repository directory:
```bash
cd c:\Users\IRFAN\OneDrive\Desktop\hackathon
npm install
```

Install server and client packages:
```bash
npm install --prefix server
npm install --prefix client
```

### 2. Environment Configuration
Both `server` and `client` come with pre-configured `.env` files for immediate zero-config execution.

**Server (`server/.env`):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/marketsphere
JWT_SECRET=marketsphere_super_secret_jwt_key_2026_dev_secure
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

# Optional: Cloudinary Cloud Media Storage
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```
*Note: If MongoDB Atlas or local MongoDB is not running, MarketSphere automatically activates its resilient embedded data store seeded with comprehensive educational content so the entire app works immediately out of the box!*

**Client (`client/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Locally (One Command)
Start both the backend API server (port 5000) and the Vite frontend (port 5173) simultaneously:
```bash
npm run dev
```

Visit the application in your browser:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🔑 Demo Accounts (One-Click Login Enabled)

On the Login screen, click any of the **One-Click Demo Account** buttons to immediately test specific role capabilities:

| Role | Email | Password | Access Permissions |
|---|---|---|---|
| **Editorial Admin** | `admin@marketsphere.com` | `admin123456` | Platform stats, user role management, account suspension, moderation review queue |
| **Creator** | `priya.sharma@marketsphere.com` | `creator123` | Creator Studio, video uploads, channel analytics, article publishing |
| **Learner / Founder** | `vikram.patel@marketsphere.com` | `user123456` | Course browsing, video streaming, like toggling, comment posting, content reporting |

---

## 🧪 Automated Test Suite

MarketSphere includes an automated end-to-end API test suite testing all endpoints, authentication, content retrieval, likes, comments, and admin moderation:

```bash
npm test
```

Test Results:
```text
  ✅ PASS: GET /health returns online status
  ✅ PASS: GET /categories returns 10 educational categories
  ✅ PASS: GET /articles returns educational articles
  ✅ PASS: GET /articles/:slug returns article with checklists and related
  ✅ PASS: GET /videos returns educational video library
  ✅ PASS: GET /videos/:slug returns video with learning objectives
  ✅ PASS: GET /search?q=marketing returns multi-category results
  ✅ PASS: GET /search/suggestions?q=mark returns quick suggestions
  ✅ PASS: POST /auth/register creates new learner account
  ✅ PASS: POST /auth/login validates credentials and issues JWT
  ✅ PASS: GET /auth/me returns authenticated profile with token
  ✅ PASS: POST /interactions/like toggles like on article
  ✅ PASS: POST /interactions/comments posts discussion comment
  ✅ PASS: POST /interactions/report submits flag to moderation queue
  ✅ PASS: POST /auth/login with Admin credentials
  ✅ PASS: GET /admin/stats returns platform aggregation metrics
```

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` — Register a new account (`name`, `email`, `password`, `role`)
- `POST /api/auth/login` — Sign in and obtain JWT token and HTTP-only cookie
- `POST /api/auth/logout` — Clear session
- `GET /api/auth/me` — Get authenticated user details
- `PUT /api/auth/profile` — Update user profile & biography
- `POST /api/auth/become-creator` — Upgrade learner account to Creator
- `POST /api/auth/follow/:id` — Follow/unfollow creator

### Articles & Marketing Hub
- `GET /api/articles` — Filter articles by category, difficulty, search, and sort
- `GET /api/articles/:slug` — View single article, checklists, tools, and increment view count
- `POST /api/articles` — Publish new article (requires auth)
- `PUT /api/articles/:id` — Update article (creator or admin)
- `DELETE /api/articles/:id` — Delete article (creator or admin)

### Educational Videos
- `GET /api/videos` — Browse videos with category and popularity filters
- `GET /api/videos/:slug` — Stream video, view learning objectives, related videos
- `POST /api/videos/upload` — Upload MP4/WebM video with thumbnail and objectives (creator/admin)
- `GET /api/videos/creator/dashboard` — View creator's uploads and analytics
- `DELETE /api/videos/:id` — Delete video

### Interactions & Moderation
- `POST /api/interactions/like` — Toggle like on article, video, or comment
- `GET /api/interactions/like-status` — Check if current user liked item
- `GET /api/interactions/comments` — Fetch discussion thread for article or video
- `POST /api/interactions/comments` — Post a new question or comment
- `DELETE /api/interactions/comments/:id` — Delete comment (author or admin)
- `POST /api/interactions/report` — Submit content report to educational review queue

### Global Search
- `GET /api/search?q=...` — Unified multi-model search across articles, videos, and creators
- `GET /api/search/suggestions?q=...` — Instant auto-complete search suggestions

### Administrator Portal
- `GET /api/admin/stats` — Platform aggregates (users, creators, articles, videos, views)
- `GET /api/admin/users` — List and filter users
- `PUT /api/admin/users/:id/role` — Update user role (`user`, `creator`, `admin`)
- `PUT /api/admin/users/:id/suspend` — Suspend or reinstate user with reason
- `GET /api/admin/reports` — View pending moderation queue
- `PUT /api/admin/reports/:id/resolve` — Resolve report and unpublish violating content

---

## ⚖️ Statutory & Compliance Notice

Information provided in the legal and GST modules is strictly for educational purposes and is not a substitute for formal legal, accounting, or tax counsel. Official government portals linked throughout the platform are verified regularly.
