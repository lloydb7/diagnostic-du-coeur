/** Petites icônes décoratives en SVG (traits fins, couleur héritée du texte). */
const TRACES = {
  horloge: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  personne: (
    <>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 19.5c1.2-3.3 3.9-5 7-5s5.8 1.7 7 5" />
    </>
  ),
  cadenas: (
    <>
      <rect x="5.5" y="10.5" width="13" height="9" rx="2" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </>
  ),
  coche: <path d="M5.5 12.5l4 4 9-9" />,
  fleche: <path d="M5 12h14M13 6l6 6-6 6" />,
  retour: <path d="M19 12H5M11 6l-6 6 6 6" />,
  livre: (
    <>
      <path d="M12 6.5C10 5 7.5 4.5 4.5 4.5v13c3 0 5.5.5 7.5 2 2-1.5 4.5-2 7.5-2v-13c-3 0-5.5.5-7.5 2z" />
      <path d="M12 6.5v13" />
    </>
  ),
  colombe: (
    <path d="M4 14c3 .5 5-1 6-3.5C11 8 13 6 16 6c1.6 0 2.7.8 3.5 2l1.5.5-1.5.8c0 4.4-3.6 8-8 8H8l-3 2 1-3c-1-.5-1.7-1.3-2-2.3z" />
  ),
}

export default function Icone({ nom, taille = 22 }) {
  return (
    <svg
      className="icone"
      width={taille}
      height={taille}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {TRACES[nom]}
    </svg>
  )
}
