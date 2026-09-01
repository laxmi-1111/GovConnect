import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { AppDataProvider } from './context/AppDataContext.tsx'
import { LanguageProvider } from './context/LanguageContext.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AppDataProvider>
          <App />
        </AppDataProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)
