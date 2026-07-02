import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import SaveTheDate from './SaveTheDate.jsx'

const path = window.location.pathname.replace(/\/+$/, '')
const isSaveTheDate = path.includes('/save-the-date')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isSaveTheDate ? <SaveTheDate /> : <App />}
  </StrictMode>,
)
