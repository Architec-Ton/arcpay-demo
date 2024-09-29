import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ArcpayProvider } from './components/ArcpayProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ArcpayProvider>
      <App />
    </ArcpayProvider>
  </StrictMode>
);
