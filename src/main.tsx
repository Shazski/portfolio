import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './bento.css';
import './modern.css';

// Apply the saved accent before first paint to avoid a color flash.
try {
  const saved = localStorage.getItem('accent');
  document.documentElement.dataset.accent = saved || 'ember';
  document.documentElement.dataset.theme = localStorage.getItem('theme') || 'dark';
} catch {
  /* localStorage unavailable — fall back to the default accent */
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
