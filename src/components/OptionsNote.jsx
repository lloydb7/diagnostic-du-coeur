/** Choix d'une note 0–5 sous forme de tuiles (boutons radio natifs, accessibles au clavier). */
export default function OptionsNote({ nom, echelle, valeur, onChoisir, labelledBy }) {
  return (
    <div className="options-note" role="radiogroup" aria-labelledby={labelledBy}>
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
              onChange={() => onChoisir(niveau.valeur)}
            />
            <span className="option-valeur" aria-hidden="true">
              {niveau.valeur}
            </span>
            <span className="option-texte">
              <span className="option-libelle">
                <span className="sr-only">{niveau.valeur} — </span>
                {niveau.libelle}
              </span>
              <span className="option-description">{niveau.description}</span>
            </span>
          </label>
        )
      })}
    </div>
  )
}
