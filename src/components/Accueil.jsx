import { CONFIDENTIALITE } from '../config/interpretation.js'
import Icone from './Icone.jsx'

function Illustration() {
  return (
    <svg className="illustration" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <circle cx="100" cy="100" r="92" className="halo halo-1" />
      <circle cx="100" cy="100" r="68" className="halo halo-2" />
      <circle cx="100" cy="100" r="44" className="halo halo-3" />
      <path
        className="trait-coeur"
        d="M100 132s-34-19.5-34-45a19 19 0 0 1 34-11.5A19 19 0 0 1 134 87c0 25.5-34 45-34 45z"
      />
    </svg>
  )
}

export default function Accueil({ enCours, nombreEnregistres, onCommencer, onReprendre, onHistorique }) {
  return (
    <section className="ecran accueil" aria-labelledby="titre-accueil">
      <div className="accueil-hero">
        <div className="accueil-texte">
          <p className="surtitre">Auto-examen spirituel</p>
          <h1 id="titre-accueil">Prendre le temps de regarder son cœur devant Dieu</h1>
          <p className="chapeau">
            Ce questionnaire de 63 questions, réparties en 10 thèmes, t'aide à repérer les domaines de ta
            vie intérieure à travailler. Il ne sert pas à condamner : il sert à éclairer, pour avancer.
          </p>
          <div className="actions">
            {enCours ? (
              <>
                <button type="button" className="bouton dore" onClick={onReprendre}>
                  Reprendre le questionnaire <Icone nom="fleche" taille={20} />
                </button>
                <button type="button" className="bouton" onClick={onCommencer}>
                  Relire la démarche
                </button>
              </>
            ) : (
              <button type="button" className="bouton dore" onClick={onCommencer}>
                Commencer <Icone nom="fleche" taille={20} />
              </button>
            )}
            {nombreEnregistres > 0 && (
              <button type="button" className="bouton discret" onClick={onHistorique}>
                Bilans enregistrés sur cet appareil ({nombreEnregistres})
              </button>
            )}
          </div>
        </div>
        <Illustration />
      </div>

      <ul className="atouts">
        <li>
          <Icone nom="horloge" />
          <div>
            <strong>Environ 15 minutes</strong>
            <span>Une question à la fois, à ton rythme, avec retour possible.</span>
          </div>
        </li>
        <li>
          <Icone nom="personne" />
          <div>
            <strong>Anonyme</strong>
            <span>Aucun compte, aucun nom, aucune adresse demandés.</span>
          </div>
        </li>
        <li>
          <Icone nom="cadenas" />
          <div>
            <strong>Privé</strong>
            <span>Rien n'est envoyé ni conservé par le site.</span>
          </div>
        </li>
      </ul>

      <p className="note">{CONFIDENTIALITE}</p>
      <p className="note">
        Ce questionnaire est un support de réflexion personnelle. Ce n'est ni un diagnostic médical ou
        psychologique, ni un jugement sur ta personne.
      </p>
    </section>
  )
}
