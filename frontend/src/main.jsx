import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initializeGoogleAnalytics } from './utils/analytics.js'
import apiService from './services/api.service.js'

// Inicializa Google Analytics
apiService.getConfig().then(config => {
  if (config.gtagId) {
    initializeGoogleAnalytics(config.gtagId);
  }
}).catch(error => {
  console.warn('Não foi possível carregar configurações:', error);
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
