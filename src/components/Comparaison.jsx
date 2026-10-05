import { arrondir, pourcentage } from '../scoring/scoring.js'

const dateLisible = (iso) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

const ecart = (valeur) => {
  const arrondi = arrondir(valeur)
  if (arrondi === 0) return '='
  return `${arrondi > 0 ? '+' : '−'}${Math.abs(arrondi)}`
}

/** Compare le bilan actuel avec un bilan enregistré précédemment (en points de pourcentage). */
export default function Comparaison({ bilan, precedent }) {
  const pctPrecedent = pourcentage(precedent.total, precedent.maxGlobal ?? bilan.maxGlobal)

  return (
    <article className="carte">
      <h2>Évolution depuis le {dateLisible(precedent.date)}</h2>
      <p className="note">
        Comparaison avec ton dernier bilan enregistré sur cet appareil. Une valeur négative signifie que la
        catégorie est moins présente qu'avant.
      </p>
      <table className="tableau-comparaison">
        <thead>
          <tr>
            <th scope="col">Catégorie</th>
            <th scope="col">Avant</th>
            <th scope="col">Maintenant</th>
            <th scope="col">Écart (points)</th>
          </tr>
        </thead>
        <tbody>
          <tr className="ligne-total">
            <th scope="row">Score global</th>
            <td>{arrondir(pctPrecedent)} %</td>
            <td>{arrondir(bilan.pourcentageGlobal)} %</td>
            <td>{ecart(bilan.pourcentageGlobal - pctPrecedent)}</td>
          </tr>
          {bilan.categories.map((resultat) => {
            const ancien = precedent.categories[resultat.categorie.id]
            if (!ancien) return null
            const pctAncien = pourcentage(ancien.score, ancien.max)
            return (
              <tr key={resultat.categorie.id}>
                <th scope="row">
                  {resultat.categorie.id}. {resultat.categorie.titreCourt}
                </th>
                <td>{arrondir(pctAncien)} %</td>
                <td>{arrondir(resultat.pourcentage)} %</td>
                <td>{ecart(resultat.pourcentage - pctAncien)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </article>
  )
}
