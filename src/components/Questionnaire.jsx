import { useEffect, useRef } from 'react'
import { estNoteValide } from '../scoring/scoring.js'
import OptionsNote from './OptionsNote.jsx'
import Icone from './Icone.jsx'

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
    const titre = titreRef.current
    if (titre && titre.getBoundingClientRect().top < 80) window.scrollTo({ top: 0 })
    titre?.focus({ preventScroll: true })
    return () => clearTimeout(minuterie.current)
  }, [index])

  const choisir = (valeur, { avancer = true } = {}) => {
    const premiereReponse = !repondue
    onRepondre(question.id, valeur)
    clearTimeout(minuterie.current)
    if (avancer && premiereReponse && !derniere) {
      minuterie.current = setTimeout(() => onAller(index + 1), DELAI_AVANCE_AUTO)
    }
  }

  // Raccourcis clavier : touches 0 à 5.
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

  const etatCategories = categories.map((c) => {
    const liste = questions.filter((q) => q.categorie === c.id)
    const faites = liste.filter((q) => estNoteValide(reponses[q.id])).length
    const premiere = liste.find((q) => !estNoteValide(reponses[q.id])) ?? liste[0]
    return { categorie: c, liste, faites, cible: questions.indexOf(premiere) }
  })

  return (
    <section className="ecran questionnaire" aria-labelledby="titre-question">
      <div className="progression">
        <div className="progression-texte" aria-live="polite">
          <span>
            Question <strong>{question.id}</strong> / {questions.length}
          </span>
          <span>{pourcentage} % complété</span>
        </div>
        <ol className="segments" aria-label="Progression par catégorie">
          {etatCategories.map(({ categorie: c, liste, faites, cible }) => (
            <li key={c.id}>
              <button
                type="button"
                className={`segment${c.id === categorie.id ? ' actif' : ''}${faites === liste.length ? ' complet' : ''}`}
                aria-current={c.id === categorie.id ? 'step' : undefined}
                aria-label={`Catégorie ${c.id} : ${c.titre} — ${faites} réponse${faites > 1 ? 's' : ''} sur ${liste.length}`}
                title={`${c.id}. ${c.titre} (${faites}/${liste.length})`}
                onClick={() => onAller(cible)}
              >
                <span className="segment-piste">
                  <span style={{ width: `${(faites / liste.length) * 100}%` }} />
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <header className="categorie-entete">
        <p className="surtitre">
          Catégorie {categorie.id} sur {categories.length} · question {rangDansCategorie} sur{' '}
          {questionsCategorie.length}
        </p>
        <h2 className="categorie-titre">{categorie.titre}</h2>
        {categorie.references && <p className="reference">{categorie.references}</p>}
        {categorie.description && rangDansCategorie === 1 && (
          <p className="note">{categorie.description}</p>
        )}
      </header>

      <article className="carte carte-question">
        <p className="question-numero" aria-hidden="true">
          {question.id}
        </p>
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
        <p className="note aide">
          {repondue
            ? 'Tu peux changer ta réponse à tout moment.'
            : 'Choisis une réponse pour continuer (touches 0 à 5 au clavier).'}
        </p>
      </article>

      {nombreReponses === questions.length && !derniere && (
        <button type="button" className="bouton discret" onClick={onTerminer}>
          Toutes les questions ont une réponse — retour au récapitulatif
        </button>
      )}

      <details className="sommaire">
        <summary>Voir les 10 catégories</summary>
        <ul>
          {etatCategories.map(({ categorie: c, liste, faites, cible }) => (
            <li key={c.id}>
              <button
                type="button"
                className="lien-categorie"
                aria-current={c.id === categorie.id ? 'step' : undefined}
                onClick={() => onAller(cible)}
              >
                <span>
                  {c.id}. {c.titre}
                </span>
                <span className={`compteur${faites === liste.length ? ' fait' : ''}`}>
                  {faites === liste.length && <Icone nom="coche" taille={16} />}
                  {faites}/{liste.length}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className="bouton discret" onClick={onTerminer}>
          Relire toutes mes réponses
        </button>
      </details>

      <nav className="navigation-questions" aria-label="Navigation entre les questions">
        <button
          type="button"
          className="bouton"
          onClick={() => onAller(index - 1)}
          disabled={index === 0}
        >
          <Icone nom="retour" taille={20} /> Précédente
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
            Suivante <Icone nom="fleche" taille={20} />
          </button>
        )}
      </nav>
    </section>
  )
}
