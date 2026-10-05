/**
 * Données du questionnaire « Diagnostique du coeur ».
 *
 * Source : document Word « Diagnostique du coeur.docx ».
 * Les intitulés des questions et les références sont repris mot pour mot.
 * Seules modifications (voir README) :
 *  - les mentions éditoriales « (nouvelle rubrique) » et « (enrichie) » ont
 *    été retirées des titres de catégories ;
 *  - la grammaire des questions 58 et 63 a été corrigée (version 1.1.0).
 *
 * Pour publier une nouvelle version du questionnaire, dupliquer ce fichier,
 * incrémenter `version` et adapter les données : la logique de calcul lit
 * tout depuis cette structure.
 */

/** Échelle de notation commune à toutes les questions (document, p. 1). */
export const ECHELLE = [
  { valeur: 0, libelle: 'Jamais', description: "cette réalité n'a pas de place en moi" },
  { valeur: 1, libelle: 'Rarement', description: 'pensée ou tentation isolée, vite rejetée' },
  { valeur: 2, libelle: 'Parfois', description: 'présence occasionnelle, encore maîtrisée' },
  { valeur: 3, libelle: 'Assez souvent', description: 'présence régulière, combat réel' },
  { valeur: 4, libelle: 'Souvent', description: 'tendance installée, difficile à maîtriser' },
  { valeur: 5, libelle: 'Très souvent / dominant', description: 'trait actif et habituel de ma vie' },
]

export const NOTE_MIN = 0
export const NOTE_MAX = 5

export const CATEGORIES = [
  {
    id: 1,
    titre: 'Pensées et motivations intérieures',
    titreCourt: 'Pensées et motivations',
    references: 'Jérémie 17:9 ; Matthieu 15:19',
  },
  {
    id: 2,
    titre: 'Les paroles qui révèlent le cœur',
    titreCourt: 'Paroles',
    references: 'Mt 12:34 ; Mt 15:19',
  },
  {
    id: 3,
    titre: 'Sexualité et pureté',
    titreCourt: 'Sexualité et pureté',
    references: null,
  },
  {
    id: 4,
    titre: 'Relations, conflits et violence',
    titreCourt: 'Relations, conflits, violence',
    references: null,
  },
  {
    id: 5,
    titre: "L'amour",
    titreCourt: "L'amour",
    references: '1 Corinthiens 13:4-7 ; Colossiens 3:23',
    description:
      "Cette catégorie mesure non pas la présence d'un vice, mais l'absence des qualités de l'amour véritable — chaque question évalue à quel point une attitude contraire à l'amour biblique se manifeste chez vous.",
  },
  {
    id: 6,
    titre: 'Relation aux autorités et figures paternelles',
    titreCourt: 'Autorités / figures paternelles',
    references:
      'Romains 13:7 ; Hébreux 13:7,17 ; 1 Timothée 1:2 ; 1 Timothée 5:17 ; Philippiens 2:29',
  },
  {
    id: 7,
    titre: "Rapport aux biens et à l'argent",
    titreCourt: 'Biens et argent',
    references: null,
  },
  {
    id: 8,
    titre: 'Rapport à Dieu et au spirituel',
    titreCourt: 'Rapport à Dieu',
    references: null,
  },
  {
    id: 9,
    titre: 'Excès et dérèglements corporels',
    titreCourt: 'Excès corporels',
    references: null,
  },
  {
    id: 10,
    titre: 'Caractère des « temps difficiles » (égocentrisme)',
    titreCourt: 'Caractère égocentrique',
    references: null,
  },
]

const q = (id, categorie, question, referenceBiblique) => ({
  id,
  categorie,
  question,
  referenceBiblique,
  scoreMax: NOTE_MAX,
})

export const QUESTIONS = [
  // Catégorie 1 — Pensées et motivations intérieures
  q(1, 1, "Mon esprit s'attarde-t-il sur des pensées mauvaises ou perverses ?", 'Mt 15:19'),
  q(2, 1, "Suis-je enflé d'orgueil dans mes pensées sur moi-même ?", '2 Tim 3:2,4'),
  q(3, 1, "Suis-je présomptueux, convaincu d'avoir toujours raison ?", '2 Tim 3:2'),
  q(4, 1, "L'envie du succès ou des biens d'autrui occupe-t-elle mes pensées ?", 'Gal 5:21'),
  q(5, 1, "La jalousie s'installe-t-elle dans mes pensées envers les autres ?", 'Gal 5:20'),
  q(6, 1, 'Est-ce que je nourris intérieurement des désirs que je sais mauvais ?', 'Col 3:5'),

  // Catégorie 2 — Les paroles qui révèlent le cœur
  q(7, 2, 'Me suis-je rendu coupable de faux témoignage ?', 'Mt 15:19'),
  q(8, 2, 'Est-ce que je médis ou calomnie dans mes conversations ?', 'Mt 15:19 ; 1 Cor 6:10'),
  q(9, 2, "Mes paroles contiennent-elles du blasphème ou de l'irrespect envers le sacré ?", '2 Tim 3:2'),
  q(10, 2, 'Est-ce que je mens habituellement, même sur de petites choses ?', 'Apoc 22:15'),

  // Catégorie 3 — Sexualité et pureté
  q(11, 3, "Est-ce que je commets ou désire l'adultère ?", 'Mt 15:19 ; 1 Cor 6:9'),
  q(12, 3, "Ai-je des pratiques d'impudicité hors mariage ?", 'Gal 5:19 ; Apoc 22:15 ; 1 Cor 6:9 ; Col 3:5'),
  q(13, 3, 'Est-ce que je m\'expose volontairement à des contenus impurs ?', 'Gal 5:19 ; Col 3:5'),
  q(14, 3, 'Ma vie est-elle marquée par la dissolution morale ?', 'Gal 5:19'),
  q(15, 3, 'Mes passions sont-elles déréglées, incontrôlées ?', 'Col 3:5'),
  q(16, 3, "Vis-je des relations contraires à l'ordre créationnel de Dieu ?", '1 Cor 6:9'),

  // Catégorie 4 — Relations, conflits et violence
  q(17, 4, "Ai-je de la haine ou de la violence intérieure envers quelqu'un ?", 'Mt 15:19 ; Apoc 22:15'),
  q(18, 4, "Est-ce que j'entretiens des inimitiés non réconciliées ?", 'Gal 5:20'),
  q(19, 4, 'Suis-je souvent entraîné dans des querelles ?', 'Gal 5:20'),
  q(20, 4, 'La colère surgit-elle facilement en moi ?', 'Gal 5:20'),
  q(21, 4, 'Est-ce que je crée ou entretiens des divisions ?', 'Gal 5:20'),
  q(22, 4, 'Suis-je dur, insensible à la souffrance des autres ?', '2 Tim 3:3'),
  q(23, 4, 'Suis-je déloyal, prêt à trahir une confiance ?', '2 Tim 3:3-4'),
  q(24, 4, "Est-ce que je méprise l'autorité légitime au-dessus de moi ?", '2 Tim 3:2'),
  q(25, 4, 'Suis-je ingrat envers ce que Dieu ou les autres font pour moi ?', '2 Tim 3:2'),

  // Catégorie 5 — L'amour
  q(26, 5, "Suis-je impatient et irritable envers les autres, au lieu d'être patient ?", '1 Cor 13:4'),
  q(27, 5, 'Est-ce que je manque de bonté/gentillesse dans mes interactions quotidiennes ?', '1 Cor 13:4'),
  q(28, 5, "Est-ce que je me vante ou cherche à me mettre en valeur plutôt que de m'effacer ?", '1 Cor 13:4'),
  q(29, 5, "Suis-je orgueilleux dans mes relations, incapable de m'abaisser par amour ?", '1 Cor 13:4'),
  q(30, 5, "Est-ce que j'agis de façon inconvenante ou grossière envers les autres ?", '1 Cor 13:5'),
  q(31, 5, 'Suis-je égoïste, cherchant mon intérêt avant celui des autres ?', '1 Cor 13:5'),
  q(32, 5, 'Est-ce que je garde rancune, ressentiment, comptabilisant les torts subis ?', '1 Cor 13:5'),
  q(33, 5, "Me réjouis-je secrètement du mal ou de l'échec d'autrui plutôt que de la vérité ?", '1 Cor 13:6'),
  q(34, 5, 'Est-ce que je sers / travaille sans cœur, comme pour les hommes et non pour le Seigneur ?', 'Col 3:23'),

  // Catégorie 6 — Relation aux autorités et figures paternelles
  q(35, 6, "Est-ce que je conteste ou méprise dans mon cœur l'autorité des dirigeants de mon pays ?", 'Rom 13:7'),
  q(36, 6, 'Est-ce que je refuse de rendre honneur et respect aux autorités civiles légitimes ?', 'Rom 13:7'),
  q(37, 6, 'Est-ce que je méprise ou critique systématiquement mes conducteurs spirituels (pasteurs, anciens) ?', 'Héb 13:17 ; 1 Tim 5:17'),
  q(38, 6, "Est-ce que je refuse de me soumettre à l'autorité spirituelle placée sur moi ?", 'Héb 13:17'),
  q(39, 6, "Est-ce que je néglige d'honorer doublement les anciens qui gouvernent et enseignent bien ?", '1 Tim 5:17'),
  q(40, 6, "Est-ce que j'oublie mes conducteurs spirituels et néglige d'imiter leur foi ?", 'Héb 13:7'),
  q(41, 6, 'Est-ce que je dévalorise ceux qui servent fidèlement le Seigneur ?', 'Phil 2:29'),
  q(42, 6, 'Est-ce que je rejette ou néglige une relation de paternité spirituelle (mentorat, discipulat) dans ma vie de foi ?', '1 Tim 1:2'),
  q(43, 6, "Est-ce que j'honore peu ou mal mon père biologique ou une figure paternelle dans ma vie ?", '1 Tim 1:2 (esprit du texte)'),

  // Catégorie 7 — Rapport aux biens et à l'argent
  q(44, 7, "Est-ce que je vole ou prends ce qui ne m'appartient pas ?", 'Mt 15:19 ; 1 Cor 6:10'),
  q(45, 7, "L'amour de l'argent occupe-t-il une place centrale dans mes priorités ?", '2 Tim 3:2 ; 1 Cor 6:10 ; Col 3:5'),
  q(46, 7, "Suis-je prêt à extorquer ou profiter abusivement d'autrui pour un gain ?", '1 Cor 6:10'),
  q(47, 7, 'Est-ce que je néglige ou refuse de donner la dîme de mes revenus ?', 'Malachie 3:8-10'),
  q(48, 7, 'Est-ce que je donne mes offrandes avec réticence, par contrainte plutôt que par cœur joyeux ?', '2 Cor 9:7'),
  q(49, 7, 'Est-ce que je manque de générosité envers les nécessiteux (pauvres, orphelins, veuves) ?', 'Jacques 2:15-16 ; Prov 19:17'),
  q(50, 7, 'Est-ce que je néglige des actes concrets de compassion (don, partage, aide) envers mon prochain ?', 'Luc 6:38 ; Mt 25:40'),

  // Catégorie 8 — Rapport à Dieu et au spirituel
  q(51, 8, 'Est-ce que je place quelque chose au-dessus de Dieu dans mon cœur ?', 'Gal 5:20 ; Apoc 22:15 ; 1 Cor 6:9 ; Col 3:5'),
  q(52, 8, "Ai-je recours à l'occulte, la magie, la divination ?", 'Gal 5:20 ; Apoc 22:15'),
  q(53, 8, 'Est-ce que je vis sans révérence réelle pour Dieu ?', '2 Tim 3:2'),
  q(54, 8, 'Ai-je une apparence de piété sans puissance réelle ?', '2 Tim 3:5'),
  q(55, 8, "Est-ce que j'aime le plaisir plus que je n'aime Dieu ?", '2 Tim 3:4'),

  // Catégorie 9 — Excès et dérèglements corporels
  q(56, 9, "Est-ce que je consomme l'alcool ou d'autres substances de manière excessive ?", 'Gal 5:21 ; 1 Cor 6:10'),
  q(57, 9, "Mes habitudes relèvent-elles de l'excès incontrôlé ?", 'Gal 5:21'),
  // Document : « Manque-t-il de maîtrise de moi-même dans mes désirs corporels ? »
  q(58, 9, 'Est-ce que je manque de maîtrise de moi-même dans mes désirs corporels ?', '2 Tim 3:3'),

  // Catégorie 10 — Caractère des « temps difficiles » (égocentrisme)
  q(59, 10, 'Suis-je centré sur moi-même avant toute autre considération ?', '2 Tim 3:2'),
  q(60, 10, 'Ai-je tendance à me vanter ou à me mettre en avant ?', '2 Tim 3:2'),
  q(61, 10, 'Est-ce que je méprise ce qui est bon et vertueux ?', '2 Tim 3:3'),
  q(62, 10, "Suis-je impulsif, agissant sous le coup de l'émotion ?", '2 Tim 3:4'),
  // Document : « Me considère-je supérieur aux autres dans mon for intérieur ? »
  q(63, 10, 'Est-ce que je me considère supérieur aux autres dans mon for intérieur ?', '2 Tim 3:4'),
]

export const QUESTIONNAIRE = {
  id: 'diagnostic-du-coeur',
  version: '1.1.0',
  titre: 'Diagnostic du cœur',
  source: '« Diagnostique du coeur » (document Word fourni)',
  echelle: ECHELLE,
  noteMin: NOTE_MIN,
  noteMax: NOTE_MAX,
  categories: CATEGORIES,
  questions: QUESTIONS,
}
