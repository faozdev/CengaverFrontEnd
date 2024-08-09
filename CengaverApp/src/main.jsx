import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import LoginSignup from './login-signup/loginSignup.jsx'

import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoginSignup />
  </StrictMode>,
)
