/**
 * Radar des 10 catégories en pourcentage normalisé.
 * Purement illustratif : les valeurs exactes sont toujours affichées dans
 * le tableau voisin (la figure est masquée aux lecteurs d'écran au profit
 * d'un résumé textuel).
 */
const TAILLE = 340
const CENTRE = TAILLE / 2
const RAYON = 120
const PALIERS = [20, 40, 60, 80, 100]

function point(indexAxe, nombreAxes, pourcentage) {
  const angle = (Math.PI * 2 * indexAxe) / nombreAxes - Math.PI / 2
  const r = (RAYON * pourcentage) / 100
  return [CENTRE + r * Math.cos(angle), CENTRE + r * Math.sin(angle)]
}

export default function RadarProfil({ categories, plage }) {
  const n = categories.length
  const sommets = categories.map((resultat, i) => point(i, n, resultat.pourcentage))
  const resume = categories
    .map((r) => `${r.categorie.titreCourt} ${Math.round(r.pourcentage)} %`)
    .join(', ')

  return (
    <figure className="radar">
      <svg viewBox={`0 0 ${TAILLE} ${TAILLE}`} role="img" aria-label={`Profil par catégorie : ${resume}`}>
        {PALIERS.map((palier) => (
          <polygon
            key={palier}
            className="radar-grille"
            points={categories.map((_, i) => point(i, n, palier).join(',')).join(' ')}
          />
        ))}
        {categories.map((resultat, i) => {
          const [x, y] = point(i, n, 100)
          const [lx, ly] = point(i, n, 116)
          return (
            <g key={resultat.categorie.id}>
              <line className="radar-axe" x1={CENTRE} y1={CENTRE} x2={x} y2={y} />
              <text className="radar-etiquette" x={lx} y={ly} textAnchor="middle" dominantBaseline="middle">
                {resultat.categorie.id}
              </text>
            </g>
          )
        })}
        <polygon
          className={`radar-zone plage-${plage.id}`}
          points={sommets.map((s) => s.join(',')).join(' ')}
        />
        {sommets.map(([x, y], i) => (
          <circle
            key={categories[i].categorie.id}
            className={`radar-point plage-${categories[i].niveau.plage.id}`}
            cx={x}
            cy={y}
            r={4.5}
          />
        ))}
        {[40, 80].map((palier) => (
          <text
            key={palier}
            className="radar-palier"
            x={CENTRE + 4}
            y={CENTRE - (RAYON * palier) / 100}
            dominantBaseline="middle"
          >
            {palier} %
          </text>
        ))}
      </svg>
      <figcaption>
        Chaque axe numéroté correspond à une catégorie (voir le tableau). Plus le point est éloigné du
        centre, plus le pourcentage de la catégorie est élevé.
      </figcaption>
    </figure>
  )
}
