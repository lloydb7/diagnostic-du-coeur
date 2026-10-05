import { estNoteValide, questionsSansReponse } from '../scoring/scoring.js'

export default function Revue({ questionnaire, reponses, onModifier, onValider }) {
  const { questions, categories, echelle } = questionnaire
  const manquantes = questionsSansReponse(questionnaire, reponses)
  const complet = manquantes.length === 0
  const libelle = (note) => echelle.find((niveau) => niveau.valeur === note)?.libelle

  return (
    <section className="ecran" aria-labelledby="titre-revue">
      <p className="surtitre">Vérification</p>
      <h1 id="titre-revue">Relire mes réponses</h1>

      {complet ? (
        <p className="chapeau">
          Les {questions.length} questions ont une réponse. Tu peux encore modifier une réponse en la
          touchant, puis afficher ton bilan.
        </p>
      ) : (
        <div className="alerte" role="status">
          <p>
            <strong>
              {manquantes.length} question{manquantes.length > 1 ? 's' : ''} sans réponse.
            </strong>{' '}
            Le bilan s'affichera quand toutes les questions auront une réponse.
          </p>
          <button
            type="button"
            className="bouton principal"
            onClick={() => onModifier(questions.indexOf(manquantes[0]))}
          >
            Aller à la question {manquantes[0].id}
          </button>
        </div>
      )}

      {categories.map((categorie) => {
        const liste = questions.filter((q) => q.categorie === categorie.id)
        const faites = liste.filter((q) => estNoteValide(reponses[q.id])).length
        return (
          <details key={categorie.id} className="carte revue-categorie" open={faites < liste.length}>
            <summary>
              <span>
                {categorie.id}. {categorie.titre}
              </span>
              <span className={`compteur${faites < liste.length ? ' incomplet' : ''}`}>
                {faites}/{liste.length}
              </span>
            </summary>
            <ol className="revue-liste">
              {liste.map((question) => {
                const note = reponses[question.id]
                const repondue = estNoteValide(note)
                return (
                  <li key={question.id}>
                    <button
                      type="button"
                      className={`revue-question${repondue ? '' : ' manquante'}`}
                      onClick={() => onModifier(questions.indexOf(question))}
                    >
                      <span className="revue-numero">{question.id}</span>
                      <span className="revue-intitule">{question.question}</span>
                      <span className="revue-note">
                        {repondue ? `${note} · ${libelle(note)}` : 'Sans réponse'}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </details>
        )
      })}

      <div className="actions">
        <button type="button" className="bouton principal" onClick={onValider} disabled={!complet}>
          Voir mon bilan
        </button>
      </div>
    </section>
  )
}
