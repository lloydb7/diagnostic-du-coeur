import { CONFIDENTIALITE } from '../config/interpretation.js'

export default function Accueil({ enCours, nombreEnregistres, onCommencer, onReprendre, onHistorique }) {
  return (
    <section className="ecran accueil" aria-labelledby="titre-accueil">
      <p className="surtitre">Auto-examen spirituel</p>
      <h1 id="titre-accueil">Prendre le temps de regarder son cœur devant Dieu</h1>
      <p className="chapeau">
        Ce questionnaire de 63 questions, réparties en 10 thèmes, t'aide à repérer les domaines de ta
        vie intérieure à travailler. Il ne sert pas à condamner : il sert à éclairer, pour avancer.
      </p>

      <ul className="atouts">
        <li>
          <strong>Environ 15 minutes</strong>
          <span>Une question à la fois, avec la possibilité de revenir en arrière.</span>
        </li>
        <li>
          <strong>Anonyme</strong>
          <span>Aucun compte, aucun nom, aucune adresse demandés.</span>
        </li>
        <li>
          <strong>Privé</strong>
          <span>{CONFIDENTIALITE}</span>
        </li>
      </ul>

      <div className="actions">
        {enCours ? (
          <>
            <button type="button" className="bouton principal" onClick={onReprendre}>
              Reprendre le questionnaire
            </button>
            <button type="button" className="bouton" onClick={onCommencer}>
              Relire la démarche
            </button>
          </>
        ) : (
          <button type="button" className="bouton principal" onClick={onCommencer}>
            Commencer
          </button>
        )}
        {nombreEnregistres > 0 && (
          <button type="button" className="bouton discret" onClick={onHistorique}>
            Bilans enregistrés sur cet appareil ({nombreEnregistres})
          </button>
        )}
      </div>

      <p className="note">
        Ce questionnaire est un support de réflexion personnelle. Ce n'est ni un diagnostic médical ou
        psychologique, ni un jugement sur ta personne.
      </p>
    </section>
  )
}
