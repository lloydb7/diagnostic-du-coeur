import { arrondir, classerScore, pourcentage } from '../scoring/scoring.js'

const dateLisible = (iso) =>
  new Date(iso).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })

function plageOuNull(total) {
  try {
    return classerScore(total)
  } catch {
    return null
  }
}

export default function Historique({ questionnaire, entrees, onSupprimer, onEffacer, onRetour }) {
  const effacer = () => {
    if (window.confirm('Supprimer définitivement tous les bilans enregistrés sur cet appareil ?')) onEffacer()
  }

  return (
    <section className="ecran" aria-labelledby="titre-historique">
      <p className="surtitre">Sur cet appareil uniquement</p>
      <h1 id="titre-historique">Bilans enregistrés</h1>
      <p className="note">
        Ces bilans sont conservés dans le stockage local de ce navigateur, à ta demande. Ils ne contiennent
        que les sous-totaux par catégorie, jamais tes réponses détaillées, et ne sont envoyés nulle part.
      </p>

      {entrees.length === 0 ? (
        <p>Aucun bilan enregistré.</p>
      ) : (
        <ul className="historique-liste">
          {entrees.map((entree) => {
            const plage = plageOuNull(entree.total)
            return (
              <li key={entree.id} className={`carte historique-entree${plage ? ` plage-${plage.id}` : ''}`}>
                <div>
                  <p className="historique-date">{dateLisible(entree.date)}</p>
                  <p className="historique-score">
                    {entree.total} / {entree.maxGlobal ?? 315} —{' '}
                    {arrondir(pourcentage(entree.total, entree.maxGlobal ?? 315))} %
                  </p>
                  {plage && (
                    <p>
                      <span aria-hidden="true">{plage.emoji}</span> {plage.couleur} — {plage.classification}
                    </p>
                  )}
                  <details>
                    <summary>Détail par catégorie</summary>
                    <ul className="historique-categories">
                      {questionnaire.categories.map((categorie) => {
                        const valeur = entree.categories[categorie.id]
                        if (!valeur) return null
                        return (
                          <li key={categorie.id}>
                            {categorie.id}. {categorie.titreCourt} : {valeur.score} / {valeur.max} (
                            {arrondir(pourcentage(valeur.score, valeur.max))} %)
                          </li>
                        )
                      })}
                    </ul>
                  </details>
                </div>
                <button type="button" className="bouton discret" onClick={() => onSupprimer(entree.id)}>
                  Supprimer
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <div className="actions">
        <button type="button" className="bouton" onClick={onRetour}>
          Retour
        </button>
        {entrees.length > 0 && (
          <button type="button" className="bouton danger" onClick={effacer}>
            Tout supprimer
          </button>
        )}
      </div>
    </section>
  )
}
