import { useState } from 'react'
import {
  AVERTISSEMENT,
  CONFIDENTIALITE,
  NOTES_CATEGORIES,
  PISTES_APPLICATION,
  PLAGES,
  REGLES_ATTENTION,
  TEXTES_DOCUMENT,
} from '../config/interpretation.js'
import { arrondir } from '../scoring/scoring.js'
import { stockageDisponible } from '../storage/historique.js'
import RadarProfil from './RadarProfil.jsx'
import Comparaison from './Comparaison.jsx'

const pct = (valeur) => `${arrondir(valeur)} %`

export default function Resultats({ bilan, historique, idEnregistre, onEnregistrer, onRecommencer, onRevoir }) {
  const { total, maxGlobal, pourcentageGlobal, plage, categories, priorites, pointsAttention } = bilan
  const [echecEnregistrement, setEchecEnregistrement] = useState(false)
  const plagesElevees = bilan.indexPlage >= 3

  const categoriesCommentees = [...priorites, ...pointsAttention]
    .map((resultat) => resultat.categorie.id)
    .filter((id, i, liste) => liste.indexOf(id) === i && NOTES_CATEGORIES[id])

  const precedent = historique.find((entree) => entree.id !== idEnregistre)

  const enregistrer = () => setEchecEnregistrement(!onEnregistrer())

  const recommencer = () => {
    if (window.confirm('Effacer les réponses actuelles et recommencer l\'évaluation ?')) onRecommencer()
  }

  return (
    <section className="ecran resultats" aria-labelledby="titre-resultats">
      <p className="surtitre">Ton bilan</p>

      {/* Score global */}
      <article className={`carte score-global plage-${plage.id}`}>
        <h1 id="titre-resultats" className="score-titre">
          Ton score : {total} / {maxGlobal} — {pct(pourcentageGlobal)}
        </h1>
        <div className="jauge" aria-hidden="true">
          {PLAGES.map((p) => (
            <span key={p.id} className={`jauge-segment plage-${p.id}`} />
          ))}
          <span className="jauge-curseur" style={{ left: `${(total / maxGlobal) * 100}%` }} />
        </div>
        <p className="score-plage-texte">
          Selon la grille du document, ce total se situe dans la plage {plage.min}–{plage.max}, intitulée :
        </p>
        <p className="badge-plage">
          <span aria-hidden="true">{plage.emoji}</span> <span className="badge-couleur">{plage.couleur}</span>{' '}
          — <strong>{plage.classification}</strong>
          {plage.reference && <span className="reference"> ({plage.reference})</span>}
        </p>
        <div className="citation-document">
          <p className="etiquette-source">Signification donnée par le document</p>
          <p>{plage.signification}</p>
        </div>
        <p className="note">
          Ce repère invite à la réflexion ; il ne dit pas avec certitude l'état de ton cœur et ne remplace
          ni le regard de Dieu, ni un accompagnement humain.
        </p>
      </article>

      <aside className="avertissement" role="note">
        <p>
          <strong>À savoir :</strong> {AVERTISSEMENT}
        </p>
      </aside>

      {/* Profil par catégorie */}
      <article className="carte">
        <h2>Profil des 10 catégories</h2>
        <p className="note">{TEXTES_DOCUMENT.lectureProfil}</p>
        <div className="profil">
          <RadarProfil categories={categories} plage={plage} />
          <table className="tableau-categories">
            <caption className="sr-only">Score et pourcentage par catégorie</caption>
            <thead>
              <tr>
                <th scope="col">Catégorie</th>
                <th scope="col">Score</th>
                <th scope="col">%</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((resultat) => (
                <tr key={resultat.categorie.id}>
                  <th scope="row">
                    <span className="num-categorie">{resultat.categorie.id}</span>
                    <span>
                      {resultat.categorie.titre}
                      <span className="barre" aria-hidden="true">
                        <span
                          className={`plage-${resultat.niveau.plage.id}`}
                          style={{ width: `${resultat.pourcentage}%` }}
                        />
                      </span>
                      <span className={`niveau plage-${resultat.niveau.plage.id}`}>
                        Niveau : {resultat.niveau.libelle}
                      </span>
                    </span>
                  </th>
                  <td>
                    {resultat.score} / {resultat.max}
                  </td>
                  <td>{pct(resultat.pourcentage)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <details className="explication">
          <summary>Comment ces chiffres sont calculés</summary>
          <ul>
            <li>Score global = somme des 63 réponses (0 à 5 chacune), soit un maximum de 315.</li>
            <li>Pourcentage d'une catégorie = score obtenu ÷ maximum de la catégorie × 100.</li>
            <li>
              Le pourcentage permet de comparer des catégories qui n'ont pas le même nombre de questions
              (par exemple 15 points pour la catégorie 9 et 45 pour la catégorie 4).
            </li>
            <li>
              Le niveau d'une catégorie applique la même logique proportionnelle que la grille du
              document (paliers de 20 %). Les libellés « Faible » à « Très élevé » sont propres à
              l'application.
            </li>
          </ul>
        </details>
      </article>

      {/* Priorités */}
      <article className="carte">
        <h2>Les 3 catégories qui ressortent le plus</h2>
        {priorites.length === 0 ? (
          <p>Aucune catégorie ne ressort : toutes tes réponses sont à 0.</p>
        ) : (
          <ol className="priorites">
            {priorites.map((resultat) => (
              <li key={resultat.categorie.id} className={`priorite plage-${resultat.niveau.plage.id}`}>
                <div className="priorite-entete">
                  <h3>
                    {resultat.categorie.id}. {resultat.categorie.titre}
                  </h3>
                  <p className="priorite-chiffres">
                    {resultat.score} / {resultat.max} — {pct(resultat.pourcentage)} · {resultat.niveau.libelle}
                  </p>
                </div>
                {resultat.categorie.references && (
                  <p className="reference">Références de la catégorie : {resultat.categorie.references}</p>
                )}
                {resultat.questionsMarquantes.length > 0 && (
                  <>
                    <p className="etiquette-source">
                      Question{resultat.questionsMarquantes.length > 1 ? 's' : ''} où ta note est la plus haute (
                      {resultat.questionsMarquantes[0].note}/5) :
                    </p>
                    <ul className="questions-marquantes">
                      {resultat.questionsMarquantes.map((question) => (
                        <li key={question.id}>
                          {question.id}. {question.question}{' '}
                          <span className="reference">({question.referenceBiblique})</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </li>
            ))}
          </ol>
        )}
      </article>

      {/* Points d'attention */}
      <article className="carte">
        <h2>Points d'attention</h2>
        <p className="note">
          Une catégorie est signalée lorsque son pourcentage atteint {REGLES_ATTENTION.seuilAbsolu} % ou
          dépasse ton pourcentage global d'au moins {REGLES_ATTENTION.ecartRelatif} points, même si ton
          score global est faible. (Seuils choisis par l'application : le document ne fixe pas de valeur.)
        </p>
        {pointsAttention.length === 0 ? (
          <p>Aucune catégorie ne se détache nettement du reste de ton profil.</p>
        ) : (
          <ul className="attention-liste">
            {pointsAttention.map((resultat) => (
              <li key={resultat.categorie.id}>
                <strong>
                  {resultat.categorie.id}. {resultat.categorie.titre}
                </strong>{' '}
                — {pct(resultat.pourcentage)} ({resultat.niveau.libelle})
                <span className="motifs">
                  {resultat.motifs.includes('niveau') && ` · atteint ${REGLES_ATTENTION.seuilAbsolu} %`}
                  {resultat.motifs.includes('ecart') &&
                    ` · ${arrondir(resultat.pourcentage - pourcentageGlobal)} points au-dessus de ton pourcentage global`}
                </span>
              </li>
            ))}
          </ul>
        )}

        {categoriesCommentees.map((id) => (
          <div key={id} className="citation-document">
            <p className="etiquette-source">Lecture complémentaire du document — catégorie {id}</p>
            <p>{NOTES_CATEGORIES[id].texte}</p>
            {NOTES_CATEGORIES[id].remarque && <p className="note">Remarque : {NOTES_CATEGORIES[id].remarque}</p>}
          </div>
        ))}
      </article>

      {/* Recommandations */}
      <article className="carte">
        <h2>Et maintenant ?</h2>
        <div className="citation-document">
          <p className="etiquette-source">Ce que propose le document, quel que soit le score</p>
          <p>{TEXTES_DOCUMENT.apresDiagnostic}</p>
          {TEXTES_DOCUMENT.versetsRemede.map((verset) => (
            <blockquote key={verset.reference}>
              « {verset.texte} » <cite>— {verset.reference}</cite>
            </blockquote>
          ))}
          <p>{TEXTES_DOCUMENT.demarche}</p>
          <p>{TEXTES_DOCUMENT.rappelFinal}</p>
        </div>

        <div className="pistes">
          <p className="etiquette-source">Pistes proposées par l'application (ne figurent pas dans le document)</p>
          <ul>
            {PISTES_APPLICATION.commun.map((piste) => (
              <li key={piste}>{piste}</li>
            ))}
            {plagesElevees && PISTES_APPLICATION.plagesElevees.map((piste) => <li key={piste}>{piste}</li>)}
          </ul>
        </div>
      </article>

      {/* Références */}
      <article className="carte">
        <h2>Références bibliques à relire</h2>
        <p className="note">Toutes ces références sont celles indiquées dans le document.</p>
        <dl className="references-liste">
          {plage.reference && (
            <div>
              <dt>Ta plage de résultat</dt>
              <dd>{plage.reference}</dd>
            </div>
          )}
          {priorites.map((resultat) => {
            const refs = [
              resultat.categorie.references,
              ...resultat.questionsMarquantes.map((question) => question.referenceBiblique),
              NOTES_CATEGORIES[resultat.categorie.id]?.references,
            ]
              .filter(Boolean)
              .flatMap((texte) => texte.split(';').map((ref) => ref.trim()))
            return (
              <div key={resultat.categorie.id}>
                <dt>{resultat.categorie.titre}</dt>
                <dd>{[...new Set(refs)].join(' ; ')}</dd>
              </div>
            )
          })}
          <div>
            <dt>Le remède annoncé</dt>
            <dd>{TEXTES_DOCUMENT.versetsRemede.map((verset) => verset.reference).join(' ; ')}</dd>
          </div>
        </dl>
      </article>

      {precedent && <Comparaison bilan={bilan} precedent={precedent} />}

      {/* Actions */}
      <article className="carte actions-carte no-print">
        <h2 className="h3">Garder une trace ?</h2>
        <p className="note">{CONFIDENTIALITE}</p>
        {idEnregistre ? (
          <p role="status">✓ Bilan enregistré sur cet appareil (sous-totaux par catégorie uniquement).</p>
        ) : (
          stockageDisponible() && (
            <button type="button" className="bouton" onClick={enregistrer}>
              Enregistrer ce bilan sur cet appareil
            </button>
          )
        )}
        {echecEnregistrement && <p role="alert">L'enregistrement n'a pas pu être effectué sur cet appareil.</p>}
        <div className="actions">
          <button type="button" className="bouton" onClick={() => window.print()}>
            Imprimer le bilan
          </button>
          <button type="button" className="bouton" onClick={onRevoir}>
            Revoir mes réponses
          </button>
          <button type="button" className="bouton principal" onClick={recommencer}>
            Refaire l'évaluation
          </button>
        </div>
      </article>

      <p className="avertissement-final">{AVERTISSEMENT}</p>
    </section>
  )
}
