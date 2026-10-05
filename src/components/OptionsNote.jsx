import { useRef } from 'react'
import Icone from './Icone.jsx'

/**
 * Choix d'une note 0–5 sous forme de tuiles (boutons radio natifs, accessibles au clavier).
 * L'intensité est suggérée par des points neutres ; la sélection est signalée par une coche,
 * une bordure épaisse et un fond, jamais par la couleur seule.
 * Un choix fait aux flèches du clavier ne déclenche pas le passage automatique
 * à la question suivante (on explore les réponses sans être emporté).
 */
export default function OptionsNote({ nom, echelle, valeur, onChoisir, labelledBy }) {
  const max = echelle[echelle.length - 1].valeur
  const viaFleches = useRef(false)
  return (
    <div
      className="options-note"
      role="radiogroup"
      aria-labelledby={labelledBy}
      onKeyDown={(evenement) => {
        viaFleches.current = evenement.key.startsWith('Arrow')
      }}
      onPointerDown={() => {
        viaFleches.current = false
      }}
    >
      {echelle.map((niveau) => {
        const id = `${nom}-${niveau.valeur}`
        const choisi = valeur === niveau.valeur
        return (
          <label key={niveau.valeur} htmlFor={id} className={`option${choisi ? ' choisie' : ''}`}>
            <input
              type="radio"
              id={id}
              name={nom}
              value={niveau.valeur}
              checked={choisi}
              onChange={() => onChoisir(niveau.valeur, { avancer: !viaFleches.current })}
            />
            <span className="option-valeur" aria-hidden="true">
              {niveau.valeur}
            </span>
            <span className="option-texte">
              <span className="option-libelle">
                <span className="sr-only">{niveau.valeur} — </span>
                {niveau.libelle}
              </span>
              <span className="option-intensite" aria-hidden="true">
                {Array.from({ length: max }, (_, i) => (
                  <span key={i} className={i < niveau.valeur ? 'plein' : ''} />
                ))}
              </span>
              <span className="option-description">{niveau.description}</span>
            </span>
            <span className="option-coche" aria-hidden="true">
              {choisi && <Icone nom="coche" taille={18} />}
            </span>
          </label>
        )
      })}
    </div>
  )
}
