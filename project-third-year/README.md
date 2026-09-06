# 🎬 CinemaHeist — Free OTT Movie Streaming Platform

CinemaHeist is a high-tech, responsive **Free OTT Movie Streaming & Personalized Recommendation Platform** built with a modern ASGI asynchronous backend and a clean, responsive React frontend client.

🌐 **Production Website**: [https://www.cinemaheist.online](https://www.cinemaheist.online)

---

## 🚀 Key Features

### 1. Personalized Recommendation Engine
* Uses collaborative filtering (**SVD Matrix Retraining**) built in Python.
* Gathers user interaction logs (trailer watch time, watchlist bookmarks) to customize recommendations dynamically.

### 2. User Analytics Dashboard
* **Statistics widgets**: Displays watchlist count, total click interactions, favorite genre, and estimated watch hours.
* **Custom SVG Charts**: 
  * Donut chart mapping genre distribution frequency.
  * Area-line timeline showing daily interaction trends for the last 7 days.

### 3. Real-Time Notification Center
* Global header bell icon with unread notification badge overlays.
* WebSockets-backed (**Socket.io**) live delivery: instantly pushes toast notifications and updates feeds.
* Seeded trending notifications generated dynamically from top TMDB movies on server startup.
* Admins can delete notifications, triggering real-time WebSocket removals on all online user sessions.

### 4. Admin Management Center
* **User Management Directory**: Search, promote/demote administrator roles, and delete user profiles.
* **ML Control Dashboard**: Monitor SVD training states and trigger model retrains with real-time terminal progress console output.
* **Broadcast alerts system**: Compose alerts with optional target URLs and links, and manage active notifications with quick-delete options.

---

## 📁 Project Structure

```
CINEMAHEIST/
└── project-third-year/
    ├── README.md                         ← Project documentation
    ├── load_test_signup.py               ← Locust signup endpoint load test script
    ├── requirements.txt                  ← Python dependencies
    ├── runtime.txt                       ← Python runtime version
    ├── .gitignore
    ├── LICENSE
    │
    ├── app/                              ← FastAPI Backend Application
    │   ├── main.py                       ← FastAPI entry point & CORS configuration
    │   ├── config.py                     ← Application settings & environment variables
    │   ├── security.py                   ← Password hashing (async bcrypt) & JWT auth
    │   ├── socket_manager.py             ← Socket.IO real-time event manager
    │   │
    │   ├── api/
    │   │   ├── deps.py                   ← Shared API dependencies & auth guards
    │   │   └── v1/
    │   │       ├── api.py                ← V1 API router aggregation
    │   │       └── endpoints/
    │   │           ├── auth.py           ← Login, signup, token refresh & password reset
    │   │           ├── movies.py         ← Search, movie details & AI recommendations
    │   │           ├── users.py          ← User watchlist & profile settings
    │   │           ├── activity.py       ← Log user interactions (4 signal types)
    │   │           ├── profile.py        ← Avatar upload (Cloudinary) & settings
    │   │           ├── feedback.py       ← User feedback submissions
    │   │           ├── admin.py          ← User administration & ML model retraining triggers
    │   │           ├── notifications.py  ← Real-time broadcasts & notification deletion
    │   │           └── stream.py         ← Video streaming / watch modal backend
    │   │
    │   ├── cache/
    │   │   └── redis.py                  ← Upstash Redis client & caching helper
    │   │
    │   ├── db/
    │   │   ├── base.py                   ← Beanie ODM document model registry
    │   │   └── session.py                ← MongoDB Atlas Motor async connection setup
    │   │
    │   ├── models/
    │   │   ├── user.py                   ← User Beanie model & watchlist timestamps
    │   │   ├── activity.py               ← Interaction log Beanie model (4 signals)
    │   │   ├── feedback.py               ← Feedback Beanie model
    │   │   └── notification.py           ← Notification Beanie model
    │   │
    │   ├── schemas/
    │   │   ├── user.py                   ← Pydantic user request/response schemas
    │   │   ├── token.py                  ← JWT Token response schemas
    │   │   └── movie.py                  ← Movie payload schemas
    │   │
    │   ├── utils/
    │   │   ├── email.py                  ← Brevo OTP email sender helper
    │   │   └── cloudinary.py             ← Cloudinary image upload helper
    │   │
    │   └── ml/                           ← Machine Learning Engine
    │       ├── engine.py                 ← Core hybrid recommendation engine (C1 + C2)
    │       ├── ablation_study_v4.py      ← Reproduces Table IV ablation study
    │       ├── sensitivity_analysis.py   ← Reproduces Table V parameter sensitivity
    │       ├── movielens_to_streamhub.py ← MovieLens 25M dataset converter
    │       ├── expand_dataset.py         ← TMDB 10,000 movie dataset builder
    │       ├── enrich_movies.py          ← Movie metadata enrichment script
    │       ├── add_language_column.py    ← Language attribute processor
    │       ├── movies.csv                ← Fallback movie dataset
    │       ├── movies_enriched.csv       ← Enriched 10,000 movie dataset (generated)
    │       └── movielens/
    │           ├── ratings.csv           ← Downloaded MovieLens ratings (623MB)
    │           └── links.csv             ← MovieLens to TMDB mapping
    │
    └── client/recommendation-system/    ← React Frontend Application (Vite 5)
        ├── src/
        │   ├── App.js                    ← React routes & app entry layout
        │   ├── index.js                  ← App DOM mount point
        │   ├── services/api.js           ← Axios instance with JWT refresh interceptors
        │   │
        │   ├── components/
        │   │   ├── auth/                 ← ForgotPassword, ResetPassword
        │   │   ├── common/               ← LoadingSpinner, VideoModal
        │   │   ├── dashboard/            ← ActivityFeed
        │   │   ├── home/                 ← HeroSection, HeroSlider
        │   │   ├── layout/               ← Navbar (bell dropdown), Footer, MainLayout
        │   │   └── movie/                ← MovieCard, MovieRow, MovieDetailModal,
        │   │                               Top10MovieCard, Top10Section, WatchMovieModal
        │   │
        │   ├── pages/
        │   │   ├── HomePage.js           ← Authenticated home view
        │   │   ├── PublicHome.js         ← Guest landing page
        │   │   ├── Dashboard.js          ← User dashboard with SVG analytics
        │   │   ├── SearchPage.js         ← Multi-filter movie search
        │   │   ├── MovieDetailPage.js    ← Movie details & trailer view
        │   │   ├── GenrePage.js          ← Genre browsing (slug URLs)
        │   │   ├── AdminDashboard.js     ← User administration & broadcast alerts
        │   │   ├── Login.js / Signup.js  ← Auth screens
        │   │   ├── ProfileSettings.js    ← User profile & avatar settings
        │   │   ├── AboutUs.js            ← About platform details
        │   │   └── ContactUs.js          ← Contact page
        │   │
        │   ├── hooks/
        │   │   └── useSEO.js             ← Custom dynamic SEO hook
        │   │
        │   ├── utils/
        │   │   ├── genres.js             ← Genre ID mapping utilities
        │   │   └── movieSlug.js          ← URL slug generator for movies
        │   │
        │   └── footer/
        │       ├── Footer.js             ← Global footer layout
        │       ├── Disclaimer.js         ← Disclaimer notice
        │       ├── Dmca.js               ← DMCA policy
        │       ├── FAQ.js                ← Frequently asked questions
        │       ├── PrivacyPolicy.js      ← Privacy policy statement
        │       ├── Termsofuse.js         ← Terms of use statement
        │       └── CareersPage.js        ← Careers page
```

---

## 🛠️ Technology Stack

### Backend
* **Runtime**: Python 3.10+
* **Framework**: FastAPI (Asynchronous ASGI)
* **ODM / Database**: Beanie (MongoDB) & motor
* **Caching**: Redis (Upstash)
* **Sockets**: python-socketio (ASGI app mount)

### Frontend
* **Core**: React 18 (Vite Bundler)
* **Styling**: Styled-Components (CSS-in-JS)
* **Client Sockets**: socket.io-client
* **Icons**: React-Icons & Bootstrap-Icons

---

## 📦 Getting Started

### 1. Backend Setup
1. Stay in (or navigate to) the project root directory (`project-third-year`).
2. Create and activate a Python virtual environment *(Recommended)*:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # Linux/macOS:
   source .venv/bin/activate
   ```
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up your environment file at `app/.env` (Database URI, TMDB API Key, etc.).
5. Start the FastAPI server (Development mode):
   ```bash
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```
   *To run in production mode with optimized concurrency (4 workers):*
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
   ```

### 2. Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client/recommendation-system
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm start
   ```

---

## 🔗 Developer URLs (Local Environment)

Once both servers are running, you can access the application here:

- **Frontend App**: [http://localhost:5173](http://localhost:5173) (Default Vite port)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **Interactive API Docs (Swagger UI)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Alternative API Docs (ReDoc)**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
