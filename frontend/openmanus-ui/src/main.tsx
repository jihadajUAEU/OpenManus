import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import './index.css';

// Handle API requests
const API_BASE_URL = 'http://localhost:8003'; // Change this to match your OpenManus backend

// Global error handling
window.onerror = (message, source, lineno, colno, error) => {
  console.error('Global error:', { message, source, lineno, colno, error });
  // You could dispatch an action here to show an error notification
};

// Create root and render app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// Export API_BASE_URL for use in other files
export { API_BASE_URL };
