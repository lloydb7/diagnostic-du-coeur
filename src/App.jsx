import { useEffect, useMemo, useState } from 'react'
import { QUESTIONNAIRE } from './data/questionnaire.js'
import { calculerBilan, estComplet } from './scoring/scoring.js'
import { effacerHistorique, enregistrerBilan, lireHistorique, supprimerEntree } from './storage/historique.js'
import Accueil from './components/Accueil.jsx'
import Demarche from './components/Demarche.jsx'
import Questionnaire from './components/Questionnaire.jsx'
import Revue from './components/Revue.jsx'
import Resultats from './components/Resultats.jsx'
import Historique from './components/Historique.jsx'

export default function App() {
  const [ecran, setEcran] = useState('accueil')
  const [reponses, setReponses] = useState({})
  const [index, setIndex] = useState(0)
  const [historique, setHistorique] = useState(() => lireHistorique())
  const [idEnregistre, setIdEnregistre] = useState(null)

  const complet = estComplet(QUESTIONNAIRE, reponses)
  const bilan = useMemo(
    () => (complet ? calculerBilan(QUESTIONNAIRE, reponses) : null),
    [complet, reponses],
  )

  // Les réponses ne vivent qu'en mémoire : prévenir avant de quitter la page.
  const enCours = Object.keys(reponses).length > 0 && ecran !== 'resultats'
  useEffect(() => {
    if (!enCours) return undefined
    const avertir = (evenement) => {
      evenement.preventDefault()
      evenement.returnValue = ''
    }
    window.addEventListener('beforeunload', avertir)
    return () => window.removeEventListener('beforeunload', avertir)
  }, [enCours])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [ecran])

  const repondre = (idQuestion, note) => {
    setReponses((precedentes) => ({ ...precedentes, [idQuestion]: note }))
    setIdEnregistre(null)
  }

  const allerAQuestion = (nouvelIndex) => {
    setIndex(nouvelIndex)
    setEcran('questionnaire')
  }

  const recommencer = () => {
    setReponses({})
    setIndex(0)
    setIdEnregistre(null)
    setEcran('demarche')
  }

  const enregistrer = () => {
    const entrees = enregistrerBilan(bilan)
    if (entrees) {
      setHistorique(entrees)
      setIdEnregistre(entrees[0].id)
    }
    return Boolean(entrees)
  }

  return (
    <div className="app">
      <a className="lien-evitement" href="#contenu">
        Aller au contenu
      </a>
      <header className="entete">
        <button type="button" className="entete-titre" onClick={() => setEcran('accueil')}>
          <span aria-hidden="true">♡</span> {QUESTIONNAIRE.titre}
        </button>
      </header>

      <main className={`contenu contenu-${ecran}`} id="contenu" tabIndex={-1}>
        {ecran === 'accueil' && (
          <Accueil
            enCours={Object.keys(reponses).length > 0}
            nombreEnregistres={historique.length}
            onCommencer={() => setEcran('demarche')}
            onReprendre={() => setEcran('questionnaire')}
            onHistorique={() => setEcran('historique')}
          />
        )}
        {ecran === 'demarche' && (
          <Demarche
            questionnaire={QUESTIONNAIRE}
            onRetour={() => setEcran('accueil')}
            onDemarrer={() => setEcran('questionnaire')}
          />
        )}
        {ecran === 'questionnaire' && (
          <Questionnaire
            questionnaire={QUESTIONNAIRE}
            reponses={reponses}
            index={index}
            onRepondre={repondre}
            onAller={setIndex}
            onTerminer={() => setEcran('revue')}
          />
        )}
        {ecran === 'revue' && (
          <Revue
            questionnaire={QUESTIONNAIRE}
            reponses={reponses}
            onModifier={allerAQuestion}
            onValider={() => complet && setEcran('resultats')}
          />
        )}
        {ecran === 'resultats' && bilan && (
          <Resultats
            bilan={bilan}
            historique={historique}
            idEnregistre={idEnregistre}
            onEnregistrer={enregistrer}
            onRecommencer={recommencer}
            onRevoir={() => setEcran('revue')}
          />
        )}
        {ecran === 'historique' && (
          <Historique
            questionnaire={QUESTIONNAIRE}
            entrees={historique}
            onSupprimer={(id) => setHistorique(supprimerEntree(id))}
            onEffacer={() => setHistorique(effacerHistorique())}
            onRetour={() => setEcran('accueil')}
          />
        )}
      </main>

      <footer className="pied">
        <p>
          Outil d'auto-examen spirituel — aucune réponse n'est envoyée ni conservée par le site.
        </p>
      </footer>
    </div>
  )
}
