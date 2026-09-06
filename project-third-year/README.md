# CinemaHeist 🎬

CinemaHeist is a high-tech, responsive Movie Streaming & Personalized Recommendation Platform built with a modern ASGI asynchronous backend and a clean, responsive React frontend client.

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
1. Navigate to the backend directory:
   ```bash
   cd app
   ```
2. Install Python dependencies:
   ```bash
   pip install -r ../requirements.txt
   ```
3. Set up your `.env` file (Database URI, TMDB API Key, etc.).
4. Start the FastAPI server (Development):
   ```bash
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```
   *To run in production with optimized concurrency (4 workers):*
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
