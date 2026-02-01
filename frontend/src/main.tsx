import './polyfills';
import './i18n';

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App.tsx'
import { reportWebVitals, formatMetricForConsole } from '@utils/reportWebVitals';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Track Web Vitals metrics
reportWebVitals((metric) => {
  formatMetricForConsole(metric);
});