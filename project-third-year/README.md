# 🎬 CinemaHeist — AI-Powered Movie Discovery & Tracking Platform

Welcome to **CinemaHeist** (formerly StreamHub), a premium, high-performance Progressive Web App (PWA) designed for cinephiles. Discover, track, rate, and share movies powered by custom AI recommendation algorithms.

🚀 **Live Site**: [https://cinemaheist.online](https://cinemaheist.online)

---

## ✨ Features

- **🧠 Hybrid AI Recommendations**: Collaborative filtering and content-based algorithms suggest movies tailored to user preferences.
- **📱 PWA First-Class Experience**: Fully offline-capable service worker integration with customized load caching and install prompts.
- **⚡ Immersive Shimmer Skeleton UI**: Custom, premium grid load state skeletons mimic page layouts to ensure a smooth, skeleton-first user experience.
- **🕒 Relative Activity Logs**: User activity feeds showing chronological actions (e.g. `Just now`, `5m ago`, `Yesterday`) alongside absolute calendar dates.
- **🔒 Secure Architecture**: Robust FastAPI rate-limiting, CORS whitelisting, and strict Content-Security-Policy (CSP) headers.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Core**: React 18, Vite
- **Styling**: Styled-Components (Vanilla CSS with rich aesthetics, glassmorphism, and responsive gradients)
- **State & Service**: Service Worker (Network-First Navigation caching), React Router DOM

### Backend (Server)
- **Core**: FastAPI (Python 3.10+)
- **Database**: MongoDB (via Motor async driver)
- **Security**: TrustedHostMiddleware, CORSMiddleware, SlowAPI Rate Limiting

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- MongoDB running locally or a MongoDB Atlas URI

### 📦 Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/competitive7coder/STREAMHUB_V2.git
   cd STREAMHUB_V2/project-third-year
   ```

2. **Setup the Backend Server**:
   ```bash
   cd app
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```
   Create a `.env` file inside the `app/` directory and configure your credentials:
   ```env
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
   Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```

3. **Setup the Frontend Client**:
   ```bash
   cd ../client/recommendation-system
   npm install
   ```
   Create a `.env.development` file inside the client directory:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
   Start the frontend dev server:
   ```bash
   npm run dev
   ```

---

## 🌎 Production Deployments

- **Frontend Hosting**: Cloudflare Pages (`https://cinemaheist.online` redirects from `stream1hub.pages.dev`).
- **Backend API**: Render (`https://streamhub-research.onrender.com`).
