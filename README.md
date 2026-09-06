# 🎬 CinemaHeist — Free OTT Movie Streaming Platform

<div align="center">

![CinemaHeist](https://img.shields.io/badge/CinemaHeist-OTT%20Platform-blue?style=for-the-badge&logo=netflix&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![IEEE](https://img.shields.io/badge/IEEE%20Access-Submitted-FF6B00?style=for-the-badge)

**A complete Netflix-style free OTT movie streaming platform with personalized AI recommendations, novel temporal decay, and multi-signal implicit feedback algorithms.**

🌐 **Live Website**: [https://www.cinemaheist.online](https://www.cinemaheist.online)

*Research paper submitted to IEEE Access*

[🚀 Features](#-features) • [🏗️ Architecture](#️-architecture) • [🤖 ML Engine](#-ml-engine) • [📊 Results](#-results) • [⚙️ Setup](#️-setup) • [🔬 Reproduce](#-reproduce-research-results)

</div>

---

## 🌟 Overview

CinemaHeist is a full-stack free OTT movie streaming platform built from scratch with a novel machine learning recommendation engine that goes beyond conventional approaches:

- **Remembers recency** — movies added to your watchlist recently matter more than old ones
- **Understands behavior** — watching a trailer signals different intent than just searching
- **Real system** — not just scripts, a complete working platform with 10,000 movies

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎬 10,000 Movies | Full catalog with posters, ratings, trailers via TMDB API |
| 🔍 Multi-Signal Search | Search with interactive genre filters, rating threshold sliders, and sorting |
| 📋 Watchlist | Personal watchlist with glassmorphic direct-delete hover triggers |
| 🎯 Recommendations | AI-powered hybrid TF-IDF + SVD recommendations |
| 🎞️ Trailers | Watch trailers directly in the app via VideoModal |
| 👤 Session Security | JWT Access/Refresh Token Rotation with silent background refresh |
| ⚡ Progressive Shell | Shimmer skeleton loading cards replacing blocking spinners |
| 🖼️ Avatar Upload | Direct profile picture upload via Cloudinary from settings |
| 👑 Admin Panel | Command center for user directory administration and global real-time event monitoring |
| 📊 Activity Feed | Real-time activity updates via Socket.IO |
| 🌙 Mood Filter | Recommendations by mood (intense, happy, romantic, scary) |
| 🏆 Genre Pages | Browse movies by genre using clean URL slugs (e.g., `/genre/comedy` instead of numeric IDs) with infinite scroll |
| 📊 Advanced Analytics | Personal dashboard with custom responsive SVG donut and trend line charts representing watchlist category distributions and weekly timelines |
| 🔔 Notification Center | Global header notification bell with unread badge count, live WebSockets-backed alerts, dynamic seeder, and administrative delete pathways |
| 📱 Responsive | Works on desktop, tablet, and mobile |
| 🔑 Password Reset | Forgot password with email OTP flow via Brevo |
| 📈 Dashboard | Personal dashboard with recommendations, activity feeds, and analytics modules |
| 🎥 Watch Modal | Watch movies with WatchMovieModal component |
| 📱 PWA Support | Installable mobile/desktop app wrapper with custom logos and offline caching |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        CinemaHeist                               │
│                                                                  │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐  │
│  │   Frontend      │    │    Backend      │    │  ML Engine  │  │
│  │                 │    │                 │    │             │  │
│  │  React.js 18    │◄──►│  FastAPI        │◄──►│  TF-IDF     │  │
│  │  Bootstrap 5    │    │  Python 3.13    │    │  SVD        │  │
│  │  Socket.IO      │    │  MongoDB Atlas  │    │  Temporal   │  │
│  │  React Router   │    │  Beanie ODM     │    │  Decay      │  │
│  │  TMDB Images    │    │  JWT Auth       │    │  OMSIF      │  │
│  └─────────────────┘    └─────────────────┘    └─────────────┘  │
│                                                                  │
│  External Services:                                              │
│  • TMDB API        — movie data, posters, trailers               │
│  • Cloudinary      — user avatar image storage                   │
│  • Brevo           — email OTP for password reset                │
│  • MongoDB Atlas   — cloud database                              │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
streamhub_research/
└── project-third-year/
    ├── README.md
    ├── requirements.txt                  ← Python dependencies
    ├── runtime.txt                       ← Python runtime version
    ├── .gitignore
    ├── LICENSE
    │
    ├── app/                              ← Backend application
    │   ├── main.py                       ← FastAPI entry point
    │   ├── requirements.txt
    │   ├── config.py                     ← App settings
    │   ├── security.py                   ← Password hashing, JWT
    │   ├── socket_manager.py             ← Socket.IO real-time events
    │   │
    │   ├── api/v1/endpoints/
    │   │   ├── auth.py                   ← Login, signup, token refresh
    │   │   ├── movies.py                 ← Search, details, recommendations
    │   │   ├── users.py                  ← Watchlist, profile
    │   │   ├── activity.py               ← Log user interactions
    │   │   ├── profile.py                ← Avatar upload, settings
    │   │   └── feedback.py               ← User feedback
    │   │
    │   ├── models/
    │   │   ├── user.py                   ← User + watchlist_timestamps field
    │   │   ├── activity.py               ← Activity log (4 signal types)
    │   │   └── feedback.py
    │   │
    │   ├── schemas/
    │   │   ├── user.py
    │   │   ├── token.py
    │   │   └── movie.py
    │   │
    │   ├── utils/
    │   │   ├── email.py                  ← Brevo OTP email sender
    │   │   └── cloudinary.py             ← Avatar upload helper
    │   │
    │   └── ml/                           ← Machine learning
    │       ├── engine.py                 ← Core engine (C1 + C2)
    │       ├── ablation_study_v4.py      ← Reproduces Table IV
    │       ├── sensitivity_analysis.py   ← Reproduces Table V
    │       ├── movielens_to_streamhub.py ← Dataset conversion
    │       ├── expand_dataset.py         ← TMDB dataset builder
    │       ├── enrich_movies.py          ← Add metadata to movies
    │       ├── movies.csv                ← Fallback movie list
    │       ├── movies_enriched.csv       ← 10k movies (generated)
    │       └── movielens/
    │           ├── ratings.csv           ← Download separately (623MB)
    │           └── links.csv             ← TMDB-MovieLens ID map
    │
    └── client/recommendation-system/    ← React frontend
        ├── src/
        │   ├── App.js                    ← Routes + layout
        │   ├── services/api.js           ← Axios + interceptors
        │   │
        │   ├── components/
        │   │   ├── auth/                 ← ForgotPassword, ResetPassword
        │   │   ├── common/               ← LoadingSpinner, VideoModal
        │   │   ├── dashboard/            ← ActivityFeed
        │   │   ├── home/                 ← HeroSection, HeroSlider
        │   │   ├── layout/               ← Navbar, Footer, MainLayout
        │   │   └── movie/                ← MovieCard, MovieRow,
        │   │                               MovieDetailModal, WatchMovieModal
        │   │
        │   └── pages/
        │       ├── HomePage.js           ← Authenticated home
        │       ├── PublicHome.js         ← Guest landing page
        │       ├── Dashboard.js          ← User dashboard
        │       ├── SearchPage.js         ← Search + year filter
        │       ├── MovieDetailPage.js    ← Movie details + trailer
        │       ├── GenrePage.js          ← Browse by genre
        │       ├── Login.js / Signup.js
        │       └── ProfileSettings.js
        │
        └── footer/
            ├── FAQ.js
            ├── PrivacyPolicy.js
            ├── TermsOfService.js
            └── CareersPage.js
```

---

## 🤖 ML Engine

The recommendation engine uses a **5-stage hybrid pipeline**:

```
User Watchlist + Interaction History
            │
            ▼
┌───────────────────────────────────────────────┐
│  Stage 1 — TF-IDF Content Scoring             │
│  Features: genre×3, director×3,               │
│            cast×2, keywords×2, overview×1     │
│  + Temporal Decay Weighting ← Contribution 1  │
└───────────────────────────────────────────────┘
            │
            ▼
┌───────────────────────────────────────────────┐
│  Stage 2 — SVD Collaborative Scoring          │
│  162,528 users × 10,000 movies                │
│  k = 50 latent factors                        │
│  + Per-Signal Confidence ← Contribution 2     │
└───────────────────────────────────────────────┘
            │
            ▼
┌───────────────────────────────────────────────┐
│  Stage 3 — Hybrid Blend                       │
│  score = 0.15 × content + 0.85 × collab       │
└───────────────────────────────────────────────┘
            │
            ▼
┌───────────────────────────────────────────────┐
│  Stage 4 — Recency Boost                      │
│  Up to 10% boost for recently released movies │
└───────────────────────────────────────────────┘
            │
            ▼
┌───────────────────────────────────────────────┐
│  Stage 5 — Genre Diversity Re-ranking         │
│  15% penalty per repeated genre in top-60     │
└───────────────────────────────────────────────┘
            │
            ▼
      Top-N Recommendations
```

### 🕐 Contribution 1 — Temporal Watchlist Decay

```
w_i = exp(-0.693 × days_ago / T_half)    T_half = 30 days

Added today    → w = 1.000  (full influence)
Added 7 days   → w = 0.857  (high)
Added 30 days  → w = 0.500  (half-life)
Added 90 days  → w = 0.125  (minimal)
Added 180 days → w = 0.016  (near zero)
```

### 🎯 Contribution 2 — OTT Multi-Signal Implicit Feedback

```
C_ui = 1 + α_k × r_ui
```

| Signal | Weight | Alpha | Confidence | Meaning |
|---|---|---|---|---|
| `added_to_watchlist` | 1.0 | 40 | 41.0 | Strongest intent |
| `trailer_watch` | 0.5 | 20 | 11.0 | Medium interest |
| `search_click` | 0.3 | 10 | 4.0 | Passive interest |
| `removed_from_watchlist` | -0.5 | 0 | -0.5 | Explicit rejection |

---

## 📊 Results

### Ablation Study

| Model | P@10 | R@10 | NDCG@10 |
|---|---|---|---|
| Random Baseline | 0.0061 | 0.0011 | 0.0065 |
| Popularity-Based | 0.0000 | 0.0000 | 0.0000 |
| TF-IDF Content Only | 0.0631 | 0.0196 | 0.0731 |
| **SVD Collaborative Only** | **0.6071** | **0.2059** | **0.6624** |
| Base Hybrid | 0.3154 | 0.1234 | 0.3322 |
| Full System C1+C2 | 0.3148 | 0.1232 | 0.3315 |

### Dataset

| Statistic | Value |
|---|---|
| Total Logs | 21,031,333 |
| Unique Users | 162,528 |
| Movies | 10,000 |
| Source | MovieLens 25M |

---

## ⚙️ Setup

### Prerequisites

```
Python 3.10+        Node.js 18+
MongoDB Atlas       TMDB API key (free)
Cloudinary account  Brevo account (free)
```

### Backend Setup

1. **Clone the repository and enter the project folder**:
   ```bash
   git clone https://github.com/competitive7coder/CINEMAHEIST.git
   cd CINEMAHEIST/project-third-year
   ```

2. **Create and activate a Python virtual environment** *(Recommended)*:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # Linux/macOS:
   source .venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**:
   Create a file named `app/.env` with the following variables:
   ```env
   ALGORITHM=HS256
   JWT_SECRET=your_secret_here
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/cinemaheist
   TMDB_API_KEY=your_tmdb_key
   FRONTEND_URL=http://localhost:5173
   CLIENT_URL=http://localhost:5173
   BACKEND_URL=http://localhost:8000
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   CLOUDINARY_CLOUD_NAME=your_name
   BREVO_API_KEY=your_brevo_key
   SEND_FROM_EMAIL=your@email.com
   PORT=8000
   NODE_ENV=development
   DOCS_ENABLED=true
   SOCKET_DEBUG=false
   ML_SERVICE_URL=http://localhost:8000
   ```

5. **Start the FastAPI Server**:
   ```bash
   # Development mode (auto-reload):
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

   # Production mode (high performance, 4 workers):
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
   ```

   - **Backend API**: `http://localhost:8000`
   - **Interactive API Docs (Swagger)**: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd client/recommendation-system
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm start
   ```

   - **Frontend App**: `http://localhost:5173` (Default Vite port)

### 📱 Progressive Web App (PWA)

CinemaHeist is configured as a fully installable mobile and desktop application featuring:

*   **🖥️ Standalone Interface**: Opens in its own dedicated window without browser toolbars, navigation buttons, or URL bars, functioning exactly like a native app.
*   **⚡ Instant Loading (App Shell)**: Caches static code locally (HTML, CSS, JS) so the application loads instantly, even on slow connections.
*   **🎨 Custom Adaptive Branding**: Implements launch splash screens, theme color matches, and responsive app icons that automatically adapt to mobile grids.
*   **🔄 Auto-Update Sync**: Silently fetches and activates new app updates in the background when code changes are deployed, ensuring you're always running the latest version.


### ML Dataset

```bash
cd app/ml

# 1. Generate movies (30-60 min)
python expand_dataset.py --target 10000

# 2. Download MovieLens 25M → https://grouplens.org/datasets/movielens/25m/
#    Place ratings.csv + links.csv in app/ml/movielens/

# 3. Convert to CinemaHeist format
python movielens_to_streamhub.py
```

---

## 🔬 Reproduce Research Results

```bash
cd app/ml

# Table IV — Ablation Study (~10 min)
python ablation_study_v4.py
# → ablation_results.txt

# Table V — Sensitivity Analysis (~15 min)
python sensitivity_analysis.py
# → sensitivity_results.txt
```

> `movies_enriched.csv` and `ml_activity_logs.csv` are not in the repo (too large).
> Generate them using the ML Dataset setup steps above.

---

## 📚 Research Paper

> **"Temporal Watchlist Decay and OTT-Specific Multi-Signal Implicit Feedback for Hybrid Movie Recommendation in Streaming Platforms"**
> Submitted to **IEEE Access** | Author: Protyush Ghorui, MCKV Institute of Engineering

---

## 👤 Author

**Protyush Ghorui**
Department of Information Technology, MCKV Institute of Engineering, Hooghly, India
<br> ghorui.protyushraj@gmail.com

---

<div align="center">

⭐ Star this repo if it helped you!

</div>