import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import LoginSignup from './login-signup/loginSignup.jsx'
import Dashboard from './Dashboard/dashboard.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
