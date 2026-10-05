/**
 * Configuration de l'interprétation : plages de classification, textes
 * repris du document et règles propres à l'application.
 *
 * Convention : tout texte dont `source` vaut 'document' est repris du
 * document « Diagnostique du coeur ». Tout texte dont `source` vaut
 * 'application' est rédigé par l'application et doit être affiché comme tel.
 */

export const SCORE_MAX_GLOBAL = 315

/**
 * Plages de classification globale (document : « Grille de classification
 * de l'état du cœur (recalibrée sur 315 points) »). Bornes incluses.
 */
export const PLAGES = [
  {
    id: 'vert',
    min: 0,
    max: 63,
    couleur: 'Vert',
    emoji: '🟢',
    classification: 'Cœur selon le cœur de Dieu',
    reference: '1 Sam 13:14',
    signification:
      "Vie alignée sur l'Esprit, l'amour et la soumission à l'autorité légitime ; rester vigilant (Prov 4:23)",
  },
  {
    id: 'jaune',
    min: 64,
    max: 126,
    couleur: 'Jaune',
    emoji: '🟡',
    classification: 'Cœur droit en tension',
    reference: null,
    signification:
      'Base saine, combats ponctuels ; vigilance ciblée sur les catégories les plus élevées, notamment Amour et Autorités',
  },
  {
    id: 'orange',
    min: 127,
    max: 189,
    couleur: 'Orange',
    emoji: '🟠',
    classification: 'Cœur partagé / double',
    reference: 'Osée 10:2 ; Jacques 1:8',
    signification:
      "Compromis significatifs, souvent visibles dans le rapport à l'argent, à l'amour ou à l'autorité ; décision claire nécessaire (Josué 24:15)",
  },
  {
    id: 'rouge',
    min: 190,
    max: 252,
    couleur: 'Rouge',
    emoji: '🔴',
    classification: 'Cœur charnel, dominé par les œuvres de la chair',
    reference: 'Gal 5:19-21',
    signification:
      "Les œuvres de la chair dominent ; Galatiens 5:21 avertit que cet état, non traité, exclut de l'héritage du Royaume",
  },
  {
    id: 'noir',
    min: 253,
    max: 315,
    couleur: 'Noir',
    emoji: '⚫',
    classification: 'Cœur endurci, de pierre, non circoncis',
    reference: 'Jér 17:9 ; 2 Tim 3:1-7',
    signification:
      'État critique correspondant au portrait des "derniers jours" ; besoin urgent d\'une œuvre radicale de régénération',
  },
]

/**
 * Niveaux relatifs utilisés pour colorer chaque catégorie.
 * Règle : on applique à chaque catégorie la même logique proportionnelle que
 * le document (paliers de 20 %). Les libellés sont propres à l'application :
 * les noms des plages globales (« Cœur endurci »...) ne s'appliquent pas à
 * une catégorie isolée.
 */
export const NIVEAUX_CATEGORIE = [
  { plage: 'vert', libelle: 'Faible' },
  { plage: 'jaune', libelle: 'Modéré' },
  { plage: 'orange', libelle: 'Marqué' },
  { plage: 'rouge', libelle: 'Élevé' },
  { plage: 'noir', libelle: 'Très élevé' },
]

/**
 * Règles des « points d'attention » (choix de l'application, le document ne
 * fixe pas de seuil chiffré). Une catégorie devient un point d'attention si :
 *  - son pourcentage atteint `seuilAbsolu` (niveau « Marqué » ou plus), ou
 *  - son pourcentage dépasse le pourcentage global d'au moins `ecartRelatif`
 *    points (catégorie qui ressort nettement du reste du profil).
 */
export const REGLES_ATTENTION = {
  seuilAbsolu: 40,
  ecartRelatif: 15,
  nombrePriorites: 3,
}

/** Textes repris du document. */
export const TEXTES_DOCUMENT = {
  noteUsage:
    "Ce diagnostic n'a pas pour but de condamner, mais de révéler avec précision — à l'image de ce que fait la Parole elle-même (Hébreux 4:12 : « La parole de Dieu... juge les sentiments et les pensées du cœur »). Jérémie 17:9 pose la prémisse : le cœur, laissé à lui-même, est insondable et trompeur. Ce test est donc un outil de mise à nu volontaire devant Dieu, pas un jugement humain. Soyez honnête, pas complaisant ni excessivement sévère envers vous-même.",
  lectureProfil:
    "Au-delà du score global, il est essentiel d'observer quelle catégorie concentre le score le plus élevé, car un cœur peut être globalement sain mais présenter une zone de compromis spécifique et cachée.",
  apresDiagnostic: "Ce test révèle — il ne guérit pas. La bonne nouvelle, c'est que l'Écriture qui diagnostique le mal (Jérémie 17:9) est la même qui annonce le remède :",
  versetsRemede: [
    {
      reference: 'Ézéchiel 36:26',
      texte:
        'Je vous donnerai un cœur nouveau, et je mettrai en vous un esprit nouveau ; j\'enlèverai de votre corps le cœur de pierre, et je vous donnerai un cœur de chair.',
    },
    {
      reference: 'Psaumes 51:10',
      texte: 'Ô Dieu, crée en moi un cœur pur, et renouvelle en moi un esprit bien disposé.',
    },
    {
      reference: '1 Jean 1:9',
      texte:
        'Si nous confessons nos péchés, il est fidèle et juste pour nous les pardonner, et pour nous purifier de toute iniquité.',
    },
  ],
  demarche:
    "Quel que soit le score obtenu, la démarche suivante reste la même : nommer précisément devant Dieu ce que le diagnostic a révélé, et Lui demander ce cœur nouveau — pas une amélioration de l'ancien, mais un remplacement complet.",
  rappelFinal:
    "Quel que soit le score obtenu dans chaque catégorie, l'étape suivante reste identique : nommer précisément devant Dieu ce que chaque rubrique a révélé — y compris, cette fois, dans l'amour concret envers les autres et le respect des autorités qu'Il a établies.",
}

/**
 * Lectures complémentaires du document propres à certaines catégories.
 * Affichées lorsqu'une de ces catégories fait partie des priorités ou des
 * points d'attention.
 */
export const NOTES_CATEGORIES = {
  5: {
    texte:
      'Un score élevé en Catégorie 5 (Amour) malgré un score global modéré révèle un cœur orthodoxe en apparence, mais froid dans sa relation aux autres — exactement l\'avertissement de 1 Corinthiens 13:1-3 : sans l\'amour, tout le reste "n\'est rien".',
    references: '1 Corinthiens 13:1-3',
  },
  6: {
    texte:
      'Un score élevé en Catégorie 6 (Autorités) révèle souvent un esprit d\'indépendance ou de rébellion non traité, qui mine la bénédiction promise à ceux qui honorent (Éphésiens 6:2-3 : « Honore ton père et ta mère... afin que tu sois heureux et que tu vives longtemps »).',
    references: 'Éphésiens 6:2-3',
  },
  8: {
    texte:
      "Une personne au score global modéré mais avec un score élevé en « Rapport à Dieu » révèle une religiosité de façade — exactement le portrait de 2 Timothée 3:5 : « ayant l'apparence de la piété, mais reniant ce qui en fait la force ». Ce signal doit être traité en priorité, indépendamment du score global.",
    references: '2 Timothée 3:5',
    remarque:
      "Le document cite cet exemple sous « Catégorie 6 (Rapport à Dieu) » avec un score sur 25 ; il correspond à la catégorie 8 du questionnaire.",
  },
}

/**
 * Pistes rédigées par l'application (non issues du document), affichées
 * sous un intitulé qui le précise.
 */
export const PISTES_APPLICATION = {
  commun: [
    'Relire calmement les questions des catégories prioritaires et les passages cités en référence.',
    'Noter par écrit, pour toi seul, un ou deux points précis à présenter à Dieu dans la prière.',
    "Si tu le souhaites, en parler avec un pasteur, un ancien ou une personne de confiance qui t'accompagne dans la foi.",
  ],
  plagesElevees: [
    "Ne reste pas seul avec ce résultat : un accompagnement pastoral peut t'aider à le relire avec recul et bienveillance.",
    "Si tu traverses une détresse importante, parles-en aussi à un proche ou à un professionnel de santé : ce questionnaire n'en tient pas lieu.",
  ],
}

export const AVERTISSEMENT =
  "Cet outil est un support personnel d'auto-examen spirituel fondé sur le questionnaire « Diagnostique du coeur ». Il ne constitue ni un diagnostic médical, psychologique ou psychiatrique, ni une mesure scientifique ou objective, ni un jugement sur la valeur d'une personne. Ton score reflète tes propres réponses à un moment donné."

export const CONFIDENTIALITE =
  "Tes réponses restent dans ton navigateur : elles ne sont envoyées à aucun serveur et ne sont pas conservées par le site. Rien n'est enregistré, sauf si tu choisis toi-même d'enregistrer un bilan sur cet appareil."
