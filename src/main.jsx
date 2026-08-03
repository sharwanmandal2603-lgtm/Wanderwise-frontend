import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <ThemeProvider>
      <AuthProvider>

        <Toaster richColors position='top-right' />
        <App />
      </AuthProvider>
    </ThemeProvider>

  </StrictMode>,
)
