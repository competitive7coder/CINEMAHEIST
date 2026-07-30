# 🎨 CinemaHeist — Frontend Application

This directory houses the React & Vite frontend code for **CinemaHeist**.

## 🛠️ Tech Stack & Structure
- **Vite**: Ultra-fast build and development tool.
- **Styled-Components**: Scoped, modular CSS styles for high-fidelity interactive UI elements.
- **Service Worker**: Configured in `public/service-worker.js` with a Network-First strategy to ensure page updates are served to users immediately.

## 🚀 Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build the production package:
   ```bash
   npm run build
   ```

## 🌐 Environment Configurations
Configure the backend connection inside your local environment files:
- `.env.development`: Points to local API server (e.g. `http://localhost:8000`).
- `.env.production`: Points to live API server on Render (e.g. `https://streamhub-research.onrender.com`).
