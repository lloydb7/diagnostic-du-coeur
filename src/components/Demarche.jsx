import { CONFIDENTIALITE, TEXTES_DOCUMENT } from '../config/interpretation.js'

export default function Demarche({ questionnaire, onRetour, onDemarrer }) {
  return (
    <section className="ecran" aria-labelledby="titre-demarche">
      <p className="surtitre">Avant de commencer</p>
      <h1 id="titre-demarche">La démarche</h1>

      <article className="carte citation-document">
        <h2 className="h3">Note d'usage du document</h2>
        <p>{TEXTES_DOCUMENT.noteUsage}</p>
      </article>

      <article className="carte">
        <h2 className="h3">Comment ça se passe</h2>
        <ol className="etapes">
          <li>
            Tu réponds aux {questionnaire.questions.length} questions, regroupées en{' '}
            {questionnaire.categories.length} catégories. Chaque question demande une réponse.
          </li>
          <li>Tu peux revenir à une question précédente à tout moment, puis tout relire avant de valider.</li>
          <li>
            Le bilan affiche ton total sur 315, le détail par catégorie, les domaines qui ressortent le
            plus et des pistes pour la suite.
          </li>
        </ol>
        <p className="note">{CONFIDENTIALITE}</p>
      </article>

      <article className="carte">
        <h2 className="h3">L'échelle de réponse</h2>
        <p>Pour chaque question, choisis la note qui décrit le plus honnêtement ta situation :</p>
        <dl className="echelle">
          {questionnaire.echelle.map((niveau) => (
            <div key={niveau.valeur} className="echelle-ligne">
              <dt>
                <span className="pastille-note">{niveau.valeur}</span> {niveau.libelle}
              </dt>
              <dd>{niveau.description}</dd>
            </div>
          ))}
        </dl>
      </article>

      <div className="actions">
        <button type="button" className="bouton principal" onClick={onDemarrer}>
          Commencer le questionnaire
        </button>
        <button type="button" className="bouton discret" onClick={onRetour}>
          Retour
        </button>
      </div>
    </section>
  )
}
