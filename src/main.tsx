import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Apply the saved accent before first paint to avoid a color flash.
try {
  const saved = localStorage.getItem('accent');
  if (saved) document.documentElement.dataset.accent = saved;
} catch {
  /* localStorage unavailable — fall back to the default accent */
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
