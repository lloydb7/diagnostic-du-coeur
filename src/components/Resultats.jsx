import { useEffect, useState } from 'react'
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
import Icone from './Icone.jsx'

const pct = (valeur) => `${arrondir(valeur)} %`
const QUESTIONS_VISIBLES = 3

const SECTIONS = [
  { id: 'profil', titre: 'Profil' },
  { id: 'priorites', titre: 'Priorités' },
  { id: 'attention', titre: "Points d'attention" },
  { id: 'suite', titre: 'Et maintenant ?' },
  { id: 'references', titre: 'Références' },
]

function QuestionsMarquantes({ questions }) {
  const ligne = (question) => (
    <li key={question.id}>
      <span className="qm-numero">{question.id}.</span> {question.question}{' '}
      <span className="reference">({question.referenceBiblique})</span>
    </li>
  )
  const visibles = questions.slice(0, QUESTIONS_VISIBLES)
  const autres = questions.slice(QUESTIONS_VISIBLES)
  return (
    <>
      <ul className="questions-marquantes">{visibles.map(ligne)}</ul>
      {autres.length > 0 && (
        <details className="plus">
          <summary>
            Voir {autres.length === 1 ? "l'autre question" : `les ${autres.length} autres questions`}
          </summary>
          <ul className="questions-marquantes">{autres.map(ligne)}</ul>
        </details>
      )}
    </>
  )
}

export default function Resultats({ bilan, historique, idEnregistre, onEnregistrer, onRecommencer, onRevoir }) {
  const { total, maxGlobal, pourcentageGlobal, plage, categories, priorites, pointsAttention } = bilan
  const [echecEnregistrement, setEchecEnregistrement] = useState(false)
  const plagesElevees = bilan.indexPlage >= 3

  const categoriesCommentees = [...priorites, ...pointsAttention]
    .map((resultat) => resultat.categorie.id)
    .filter((id, i, liste) => liste.indexOf(id) === i && NOTES_CATEGORIES[id])

  const precedent = historique.find((entree) => entree.id !== idEnregistre)

  // À l'impression, déplier les listes de questions repliées.
  useEffect(() => {
    const deplier = () => document.querySelectorAll('.resultats details.plus').forEach((d) => (d.open = true))
    window.addEventListener('beforeprint', deplier)
    return () => window.removeEventListener('beforeprint', deplier)
  }, [])

  const enregistrer = () => setEchecEnregistrement(!onEnregistrer())

  const recommencer = () => {
    if (window.confirm('Effacer les réponses actuelles et recommencer l\'évaluation ?')) onRecommencer()
  }

  return (
    <section className="ecran resultats" aria-labelledby="titre-resultats">
      {/* Synthèse */}
      <article className={`carte score-global plage-${plage.id}`}>
        <div className="score-grille">
          <div className="score-chiffres">
            <p className="surtitre">Ton bilan</p>
            <h1 id="titre-resultats" className="score-titre">
              <span className="score-libelle">Ton score : </span>
              <span className="score-nombre">{total}</span>
              <span className="score-max"> / {maxGlobal}</span>
              <span className="score-pct"> — {pct(pourcentageGlobal)}</span>
            </h1>
          </div>
          <div className="score-plage">
            <p className="score-plage-texte">
              Selon la grille du document, ce total se situe dans la plage {plage.min}–{plage.max}, intitulée :
            </p>
            <p className="badge-plage">
              <span aria-hidden="true">{plage.emoji}</span>{' '}
              <span className="badge-couleur">{plage.couleur}</span> — <strong>{plage.classification}</strong>
              {plage.reference && <span className="reference"> ({plage.reference})</span>}
            </p>
          </div>
        </div>

        <div className="jauge" aria-hidden="true">
          <div className="jauge-barre">
            {PLAGES.map((p) => (
              <span key={p.id} className={`jauge-segment plage-${p.id}${p.id === plage.id ? ' actuel' : ''}`} />
            ))}
            <span className="jauge-curseur" style={{ left: `${(total / maxGlobal) * 100}%` }} />
          </div>
          <div className="jauge-graduations">
            {PLAGES.map((p) => (
              <span key={p.id} className={p.id === plage.id ? 'actuel' : ''}>
                {p.min}–{p.max}
              </span>
            ))}
          </div>
        </div>

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

      <nav className="sommaire-resultats no-print" aria-label="Sections du bilan">
        {SECTIONS.map((section) => (
          <a key={section.id} href={`#${section.id}`}>
            {section.titre}
          </a>
        ))}
      </nav>

      {/* Profil par catégorie */}
      <article className="carte" id="profil">
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
      <article className="carte" id="priorites">
        <h2>Les 3 catégories qui ressortent le plus</h2>
        {priorites.length === 0 ? (
          <p>Aucune catégorie ne ressort : toutes tes réponses sont à 0.</p>
        ) : (
          <ol className="priorites">
            {priorites.map((resultat, rang) => (
              <li key={resultat.categorie.id} className={`priorite plage-${resultat.niveau.plage.id}`}>
                <p className="priorite-rang" aria-hidden="true">
                  {rang + 1}
                </p>
                <h3>
                  {resultat.categorie.id}. {resultat.categorie.titre}
                </h3>
                <p className="priorite-chiffres">
                  {resultat.score} / {resultat.max} — {pct(resultat.pourcentage)}{' '}
                  <span className={`niveau plage-${resultat.niveau.plage.id}`}>· {resultat.niveau.libelle}</span>
                </p>
                <span className="barre" aria-hidden="true">
                  <span
                    className={`plage-${resultat.niveau.plage.id}`}
                    style={{ width: `${resultat.pourcentage}%` }}
                  />
                </span>
                {resultat.categorie.references && (
                  <p className="reference">{resultat.categorie.references}</p>
                )}
                {resultat.questionsMarquantes.length > 0 && (
                  <>
                    <p className="etiquette-source">
                      Ta note la plus haute ({resultat.questionsMarquantes[0].note}/5) :
                    </p>
                    <QuestionsMarquantes questions={resultat.questionsMarquantes} />
                  </>
                )}
              </li>
            ))}
          </ol>
        )}
      </article>

      {/* Points d'attention */}
      <article className="carte" id="attention">
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
              <li key={resultat.categorie.id} className={`plage-${resultat.niveau.plage.id}`}>
                <strong>
                  {resultat.categorie.id}. {resultat.categorie.titre}
                </strong>
                <span className="attention-chiffres">
                  {pct(resultat.pourcentage)} · {resultat.niveau.libelle}
                </span>
                <span className="motifs">
                  {[
                    resultat.motifs.includes('niveau') && `atteint ${REGLES_ATTENTION.seuilAbsolu} %`,
                    resultat.motifs.includes('ecart') &&
                      `${arrondir(resultat.pourcentage - pourcentageGlobal)} points au-dessus de ton pourcentage global`,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
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
      <article className="carte" id="suite">
        <h2>Et maintenant ?</h2>
        <div className="suite-grille">
          <div className="versets">
            <p className="etiquette-source">
              <Icone nom="colombe" taille={18} /> Ce que propose le document, quel que soit le score
            </p>
            <p>{TEXTES_DOCUMENT.apresDiagnostic}</p>
            {TEXTES_DOCUMENT.versetsRemede.map((verset) => (
              <blockquote key={verset.reference}>
                <p>« {verset.texte} »</p>
                <cite>{verset.reference}</cite>
              </blockquote>
            ))}
          </div>
          <div className="demarche">
            <p>{TEXTES_DOCUMENT.demarche}</p>
            <p>{TEXTES_DOCUMENT.rappelFinal}</p>
            <div className="pistes">
              <p className="etiquette-source">Pistes proposées par l'application (ne figurent pas dans le document)</p>
              <ul>
                {PISTES_APPLICATION.commun.map((piste) => (
                  <li key={piste}>{piste}</li>
                ))}
                {plagesElevees && PISTES_APPLICATION.plagesElevees.map((piste) => <li key={piste}>{piste}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </article>

      {/* Références */}
      <article className="carte" id="references">
        <h2>
          <Icone nom="livre" /> Références bibliques à relire
        </h2>
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
          <p role="status" className="confirmation">
            <Icone nom="coche" taille={18} /> Bilan enregistré sur cet appareil (sous-totaux par catégorie
            uniquement).
          </p>
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

      <p className="avertissement-final">
        Rappel : ce bilan est un outil d'auto-examen spirituel fondé sur le questionnaire « Diagnostique du
        coeur ». Ce n'est pas un diagnostic médical, psychologique ou psychiatrique.
      </p>
    </section>
  )
}
