# Diagnostic du cœur — application d'auto-examen spirituel

Application web statique (React + Vite + JavaScript) qui reprend le questionnaire
**« Diagnostique du coeur »** : 63 questions, 10 catégories, une échelle de 0 à 5 et
un score global sur 315.

- **Sans serveur, sans compte, sans statistiques de visite.** Les calculs ont lieu dans le navigateur.
- **Aucune réponse n'est envoyée ni conservée par le site.** Un bilan n'est enregistré
  (dans le `localStorage` de l'appareil, sous forme de sous-totaux par catégorie uniquement) que si
  la personne clique sur « Enregistrer ce bilan sur cet appareil ». Elle peut le supprimer à tout moment.
- Aucune ressource externe (polices, scripts, images) n'est chargée.

> Cet outil est un support personnel de réflexion spirituelle. Ce n'est ni un diagnostic médical,
> psychologique ou psychiatrique, ni une mesure scientifique ou objective de la valeur d'une personne.

---

## 1. Installation et lancement local

Prérequis : [Node.js](https://nodejs.org/) **22.12 ou plus récent** (version 24 recommandée) et npm.

```bash
npm install
npm run dev
```

Ouvrir ensuite l'adresse affichée dans le terminal (par défaut <http://localhost:5173>).

## 2. Vérifications et compilation

| Commande | Rôle |
| --- | --- |
| `npm run lint` | Analyse statique du code (ESLint) |
| `npm test` | Tests automatisés (Vitest) |
| `npm run build` | Compilation de production dans `dist/` |
| `npm run preview` | Sert localement le contenu de `dist/` |
| `npm run check` | Lance les trois premières commandes à la suite |

Les tests vérifient notamment :

- exactement 63 questions, numérotées de 1 à 63, avec intitulé, catégorie, référence et `scoreMax` ;
- l'échelle de 0 à 5, et le rejet de toute réponse hors de 0 à 5 ou non entière ;
- les maxima des 10 catégories (30, 20, 30, 45, 45, 45, 35, 25, 15, 25) et le maximum global de 315 ;
- des plages de classification sans trou ni chevauchement entre 0 et 315 ;
- la classification aux valeurs limites 0, 63, 64, 126, 127, 189, 190, 252, 253 et 315 ;
- le classement des catégories par pourcentage (et non par score brut) ;
- la détection d'un point d'attention même avec un score global faible ;
- l'historique local (aucune réponse détaillée enregistrée, résistance à un stockage plein ou corrompu).

## 3. Créer un dépôt GitHub

Depuis le dossier du projet (`C:\Users\lloyd\diagnostic-du-coeur`) :

```bash
git init
git add .
git commit -m "Première version du diagnostic du cœur"
git branch -M main
```

Sur <https://github.com/new>, crée un dépôt vide (sans README), par exemple `diagnostic-du-coeur`, puis :

```bash
git remote add origin https://github.com/<ton-compte>/diagnostic-du-coeur.git
git push -u origin main
```

Avec l'outil `gh`, une seule commande suffit à la place : `gh repo create diagnostic-du-coeur --public --source . --push`.

## 4. Publication automatique sur GitHub Pages (GitHub Actions)

Le fichier `.github/workflows/deploy.yml` est fourni. À chaque `push` sur `main`, il :

1. installe les dépendances (`npm ci`) ;
2. lance le lint et les tests (la publication est annulée en cas d'échec) ;
3. compile l'application avec le bon chemin de base ;
4. publie le dossier `dist/` sur GitHub Pages.

Activation, une seule fois :

1. Dans le dépôt GitHub : **Settings → Pages**.
2. Sous **Build and deployment → Source**, choisis **GitHub Actions**.
3. Pousse un commit sur `main` (ou lance le workflow à la main depuis l'onglet **Actions → Publier sur GitHub Pages → Run workflow**).
4. L'adresse publique s'affiche dans l'onglet **Actions** et dans **Settings → Pages**,
   par exemple `https://<ton-compte>.github.io/diagnostic-du-coeur/`.

> Le dossier `.github/` doit se trouver à la **racine** du dépôt. Si l'application reste dans un
> sous-dossier d'un dépôt plus grand, déplace le workflow à la racine et ajoute
> `defaults: run: working-directory: diagnostic-du-coeur` ainsi que `path: diagnostic-du-coeur/dist`.

## 5. Chemin de base Vite et nom du dépôt

Sur GitHub Pages, un site de projet est servi sous `https://<compte>.github.io/<nom-du-depot>/`.
Vite doit donc connaître ce préfixe. Dans `vite.config.js` :

```js
base: process.env.BASE_PATH || './',
```

- **Automatique (par défaut)** : le workflow définit `BASE_PATH=/${{ github.event.repository.name }}/`.
  Si le dépôt est renommé, rien à changer.
- **Valeur fixe** : remplace la ligne par `base: '/nom-exact-du-depot/'` (avec les deux barres obliques).
- **Site utilisateur** (dépôt nommé `<compte>.github.io`) ou domaine personnalisé : utilise `base: '/'`
  et supprime la variable `BASE_PATH` du workflow.
- Compilation locale avec le préfixe, pour tester : `BASE_PATH=/diagnostic-du-coeur/ npm run build`
  (PowerShell : `$env:BASE_PATH='/diagnostic-du-coeur/'; npm run build`).

L'application n'a pas de routes d'URL : la valeur `./` fonctionne aussi dans n'importe quel sous-dossier.

---

## Architecture

```
src/
├── data/questionnaire.js      Questions, catégories et échelle (données pures, versionnées)
├── config/interpretation.js   Plages, textes du document, règles des points d'attention, avertissements
├── scoring/scoring.js         Moteur de calcul (fonctions pures, testées)
├── scoring/validation.js      Contrôles d'intégrité des données et des plages
├── storage/historique.js      Historique local facultatif (localStorage)
├── components/                Écrans et composants d'interface
│   ├── Accueil.jsx, Demarche.jsx, Questionnaire.jsx, OptionsNote.jsx, Revue.jsx
│   ├── Resultats.jsx, RadarProfil.jsx, Comparaison.jsx, Historique.jsx
├── App.jsx                    Enchaînement des écrans et état
├── main.jsx                   Point d'entrée (contrôle d'intégrité en développement)
└── styles.css                 Thème, responsive, mode sombre, impression
tests/                         Tests Vitest
```

### Modifier le questionnaire

- **Questions** : `src/data/questionnaire.js`. Chaque question a `id`, `categorie`, `question`,
  `referenceBiblique` et `scoreMax`. Pour une nouvelle version, incrémenter `version` : elle est
  enregistrée avec chaque bilan.
- **Plages, significations, textes et seuils** : `src/config/interpretation.js`. Les textes repris du
  document et ceux qui sont propres à l'application sont séparés (`TEXTES_DOCUMENT`, `NOTES_CATEGORIES`
  ou `PISTES_APPLICATION`), et l'interface les signale comme tels.
- Lancer `npm test` après toute modification : les tests vérifient la cohérence des données.

### Calcul (transparent)

- Score global = somme des 63 réponses (0 à 5) → entre 0 et 315.
- Pourcentage global = score ÷ 315 × 100.
- Pourcentage d'une catégorie = score ÷ maximum de la catégorie × 100 (permet de comparer des catégories de tailles différentes).
- Classification globale : plages du document, bornes incluses.
- Niveau d'une catégorie : même logique proportionnelle que le document (paliers de 20 %), avec les
  libellés « Faible / Modéré / Marqué / Élevé / Très élevé » propres à l'application.
- Priorités : les 3 catégories non nulles au pourcentage le plus élevé (à égalité : score brut, puis ordre).
- Points d'attention : catégorie ≥ 40 % **ou** au moins 15 points au-dessus du pourcentage global
  (seuils réglables dans `REGLES_ATTENTION`).

### Évolutions prévues par l'architecture

Le calcul, les données et l'affichage sont séparés. On peut donc ajouter des comptes, un historique
côté serveur, un espace pastoral ou une nouvelle version du questionnaire en remplaçant
`storage/historique.js` ou en ajoutant un fichier de données, sans toucher au moteur de calcul.

---

## Fidélité au document et points à valider

### Choix effectués lors de la transcription

1. **Erreur de numéro dans le document** : la « Lecture complémentaire — Le profil par catégorie »
   parle d'un « score de 20/25 en Catégorie 6 (Rapport à Dieu) ». « Rapport à Dieu » est la
   **catégorie 8** (sur 25) ; la catégorie 6 (Autorités) est sur 45. L'application rattache ce
   commentaire à la catégorie 8 et l'indique à l'écran.
2. Les mentions éditoriales « (nouvelle rubrique) », « (enrichie) » et « (nouveau) » ont été retirées des titres.
3. Les titres courts du radar viennent du tableau de calcul du document (« Pensées et motivations », « Paroles »…).
4. Les citations bibliques affichées sont **uniquement** celles qui figurent dans le document, mot pour mot
   (Hébreux 4:12 abrégé, Ézéchiel 36:26, Psaumes 51:10, 1 Jean 1:9, 2 Timothée 3:5, Éphésiens 6:2-3).
   Aucun autre verset n'a été ajouté.
5. Le document utilise le vouvoiement ; l'interface tutoie (« Ton score »), comme demandé. Les citations du document restent inchangées.
6. **Grammaire corrigée (version 1.1.0 du questionnaire)** — le sens et la référence sont inchangés :
   - **Q58** : « Manque-t-il de maîtrise de moi-même dans mes désirs corporels ? » devient
     « Est-ce que je manque de maîtrise de moi-même dans mes désirs corporels ? »
   - **Q63** : « Me considère-je supérieur aux autres dans mon for intérieur ? » devient
     « Est-ce que je me considère supérieur aux autres dans mon for intérieur ? »

### Questions à faire valider par un pasteur

- **Q24** (« méprise l'autorité légitime », catégorie 4) recoupe la catégorie 6 (Autorités).
- **Q28** (« me vante… », catégorie 5) et **Q60** (« me vanter… », catégorie 10) sont presque identiques ;
  **Q2**, **Q29** et **Q63** portent toutes sur l'orgueil. Certains traits comptent donc plusieurs fois.
- **Q7, Q14, Q16, Q52** sont formulées en oui/non (« Me suis-je rendu coupable… », « Ai-je recours… »)
  alors que l'échelle mesure une fréquence.
- **Q10** « mens *habituellement* » : l'adverbe fait double emploi avec l'échelle de fréquence.
- **Q16** (« relations contraires à l'ordre créationnel ») touche un sujet sensible : la formulation et
  l'accompagnement proposé méritent une attention pastorale.
- **Q43** : référence « 1 Tim 1:2 (esprit du texte) » (référence indirecte) ; **Q42** et **Q43** utilisent
  1 Tim 1:2 pour la paternité spirituelle et biologique.
- **Q47** (dîme, Malachie 3:8-10) : le sujet est propre à certaines traditions d'Église.
- Les catégories 3, 4, 7, 8, 9 et 10 n'ont pas de référence globale dans le document (seulement par question).

### Classifications à faire valider

- **Rouge** et **Noir** : les intitulés (« Cœur charnel », « Cœur endurci, de pierre, non circoncis ») et la
  signification du rouge (« exclut de l'héritage du Royaume ») sont forts. L'application les reprend
  fidèlement, mais les présente comme « la plage que le document intitule… ». Elle ajoute aussi un rappel
  que le score ne dit pas avec certitude l'état du cœur, et une invitation à se faire accompagner.
- La signification du **jaune** cite « notamment Amour et Autorités » quel que soit le profil réel de la personne.
- Les seuils des **points d'attention** (40 % ; +15 points) et les libellés de niveau par catégorie ont été
  choisis par l'application. Le document n'en fixe pas.
- Les « pistes proposées par l'application » (prière, accompagnement pastoral, proche ou professionnel de
  santé en cas de détresse) ne figurent pas dans le document et sont présentées comme telles.
