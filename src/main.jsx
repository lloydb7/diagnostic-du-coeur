import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'
import { QUESTIONNAIRE } from './data/questionnaire.js'
import { PLAGES, SCORE_MAX_GLOBAL } from './config/interpretation.js'
import { verifierPlages, verifierQuestionnaire } from './scoring/validation.js'

if (import.meta.env.DEV) {
  const erreurs = [
    ...verifierQuestionnaire(QUESTIONNAIRE, { scoreMaxGlobal: SCORE_MAX_GLOBAL }),
    ...verifierPlages(PLAGES, SCORE_MAX_GLOBAL),
  ]
  if (erreurs.length > 0) console.error('Données du questionnaire incohérentes :', erreurs)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
