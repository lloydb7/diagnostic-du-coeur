import { useEffect, useRef } from 'react'
import { estNoteValide } from '../scoring/scoring.js'
import OptionsNote from './OptionsNote.jsx'

const DELAI_AVANCE_AUTO = 300

export default function Questionnaire({ questionnaire, reponses, index, onRepondre, onAller, onTerminer }) {
  const { questions, categories } = questionnaire
  const question = questions[index]
  const categorie = categories.find((c) => c.id === question.categorie)
  const questionsCategorie = questions.filter((q) => q.categorie === categorie.id)
  const rangDansCategorie = questionsCategorie.indexOf(question) + 1
  const nombreReponses = questions.filter((q) => estNoteValide(reponses[q.id])).length
  const pourcentage = Math.round((nombreReponses / questions.length) * 100)
  const note = reponses[question.id]
  const repondue = estNoteValide(note)
  const derniere = index === questions.length - 1

  const titreRef = useRef(null)
  const minuterie = useRef(null)

  useEffect(() => {
    titreRef.current?.focus({ preventScroll: true })
    return () => clearTimeout(minuterie.current)
  }, [index])

  const choisir = (valeur) => {
    const premiereReponse = !repondue
    onRepondre(question.id, valeur)
    clearTimeout(minuterie.current)
    if (premiereReponse && !derniere) {
      minuterie.current = setTimeout(() => onAller(index + 1), DELAI_AVANCE_AUTO)
    }
  }

  // Raccourcis clavier : touches 0 à 5, flèches gauche/droite pour naviguer.
  useEffect(() => {
    const surTouche = (evenement) => {
      if (evenement.altKey || evenement.ctrlKey || evenement.metaKey) return
      if (/^[0-5]$/.test(evenement.key)) {
        evenement.preventDefault()
        choisir(Number(evenement.key))
      }
    }
    window.addEventListener('keydown', surTouche)
    return () => window.removeEventListener('keydown', surTouche)
  })

  return (
    <section className="ecran questionnaire" aria-labelledby="titre-question">
      <div className="progression" aria-live="polite">
        <div className="progression-texte">
          <span>
            Question <strong>{question.id}</strong> / {questions.length}
          </span>
          <span>{pourcentage} % complété</span>
        </div>
        <div
          className="progression-barre"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={questions.length}
          aria-valuenow={nombreReponses}
          aria-valuetext={`${nombreReponses} réponses sur ${questions.length}`}
        >
          <span style={{ width: `${pourcentage}%` }} />
        </div>
      </div>

      <header className="categorie-entete">
        <p className="surtitre">
          Catégorie {categorie.id} / {categories.length} · question {rangDansCategorie} sur{' '}
          {questionsCategorie.length}
        </p>
        <h2 className="h3">{categorie.titre}</h2>
        {categorie.references && <p className="reference">{categorie.references}</p>}
        {categorie.description && rangDansCategorie === 1 && (
          <p className="note">{categorie.description}</p>
        )}
      </header>

      <article className="carte carte-question">
        <h1 id="titre-question" className="question-texte" tabIndex={-1} ref={titreRef}>
          {question.question}
        </h1>
        <p className="reference">Référence : {question.referenceBiblique}</p>

        <OptionsNote
          nom={`q${question.id}`}
          echelle={questionnaire.echelle}
          valeur={note}
          onChoisir={choisir}
          labelledBy="titre-question"
        />
        {!repondue && <p className="note aide">Une réponse est nécessaire pour continuer.</p>}
      </article>

      <nav className="navigation-questions" aria-label="Navigation entre les questions">
        <button
          type="button"
          className="bouton"
          onClick={() => onAller(index - 1)}
          disabled={index === 0}
        >
          ← Précédente
        </button>
        {derniere ? (
          <button type="button" className="bouton principal" onClick={onTerminer} disabled={!repondue}>
            Relire mes réponses
          </button>
        ) : (
          <button
            type="button"
            className="bouton principal"
            onClick={() => onAller(index + 1)}
            disabled={!repondue}
          >
            Suivante →
          </button>
        )}
      </nav>

      {nombreReponses === questions.length && !derniere && (
        <button type="button" className="bouton discret" onClick={onTerminer}>
          Toutes les questions ont une réponse — retour au récapitulatif
        </button>
      )}

      <details className="sommaire">
        <summary>Aller à une catégorie</summary>
        <ul>
          {categories.map((c) => {
            const liste = questions.filter((q) => q.categorie === c.id)
            const faites = liste.filter((q) => estNoteValide(reponses[q.id])).length
            const premiere = liste.find((q) => !estNoteValide(reponses[q.id])) ?? liste[0]
            return (
              <li key={c.id}>
                <button
                  type="button"
                  className="lien-categorie"
                  aria-current={c.id === categorie.id ? 'step' : undefined}
                  onClick={() => onAller(questions.indexOf(premiere))}
                >
                  <span>
                    {c.id}. {c.titre}
                  </span>
                  <span className="compteur">
                    {faites}/{liste.length}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
        <button type="button" className="bouton discret" onClick={onTerminer}>
          Relire toutes mes réponses
        </button>
      </details>
    </section>
  )
}
