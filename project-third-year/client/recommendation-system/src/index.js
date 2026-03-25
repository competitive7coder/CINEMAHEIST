import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Critical CSS only (no JS bloat)
import 'bootstrap/dist/css/bootstrap.min.css';

// 
// Root initialization
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

// StrictMode only in development
const AppRoot =
  process.env.NODE_ENV === 'production'
    ? <App />
    : (
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );

// Render (non-blocking friendly)
root.render(AppRoot);

// Optional: web vitals (dev only)
if (process.env.NODE_ENV !== 'production') {
  import('./reportWebVitals').then(({ default: reportWebVitals }) => {
    reportWebVitals(console.log);
  });
}