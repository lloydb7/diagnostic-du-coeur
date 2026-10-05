/**
 * Moteur de calcul : fonctions pures, sans dépendance à l'interface.
 * `reponses` est un objet { [idQuestion]: note }.
 */

import {
  NIVEAUX_CATEGORIE,
  PLAGES,
  REGLES_ATTENTION,
  SCORE_MAX_GLOBAL,
} from '../config/interpretation.js'

export function estNoteValide(note, min = 0, max = 5) {
  return Number.isInteger(note) && note >= min && note <= max
}

export function questionsSansReponse(questionnaire, reponses) {
  return questionnaire.questions.filter(
    (question) => !estNoteValide(reponses[question.id], questionnaire.noteMin, questionnaire.noteMax),
  )
}

export function estComplet(questionnaire, reponses) {
  return questionsSansReponse(questionnaire, reponses).length === 0
}

export function scoreMaxGlobal(questionnaire) {
  return questionnaire.questions.reduce((somme, question) => somme + question.scoreMax, 0)
}

export function scoreMaxCategorie(questionnaire, idCategorie) {
  return questionnaire.questions
    .filter((question) => question.categorie === idCategorie)
    .reduce((somme, question) => somme + question.scoreMax, 0)
}

/** Classe un score global selon les plages configurées (bornes incluses). */
export function classerScore(score, plages = PLAGES) {
  if (!Number.isInteger(score) || score < plages[0].min || score > plages[plages.length - 1].max) {
    throw new RangeError(`Score global hors limites : ${score}`)
  }
  return plages.find((plage) => score >= plage.min && score <= plage.max)
}

/**
 * Classe un score partiel (catégorie) par proportion, avec la même logique
 * que les plages globales : score / max ≤ plage.max / scoreMaxGlobal.
 * Comparaison en nombres entiers pour éviter les erreurs d'arrondi.
 */
export function classerProportion(score, max, plages = PLAGES, maxGlobal = SCORE_MAX_GLOBAL) {
  if (max <= 0) throw new RangeError('Maximum de catégorie invalide')
  const index = plages.findIndex((plage) => score * maxGlobal <= plage.max * max)
  return index === -1 ? plages.length - 1 : index
}

export function pourcentage(score, max) {
  return max === 0 ? 0 : (score / max) * 100
}

export function arrondir(valeur, decimales = 0) {
  const facteur = 10 ** decimales
  return Math.round(valeur * facteur) / facteur
}

/**
 * Calcule le bilan complet. Lève une erreur si une réponse manque ou est
 * invalide : aucun résultat partiel n'est produit.
 */
export function calculerBilan(questionnaire, reponses, regles = REGLES_ATTENTION) {
  const manquantes = questionsSansReponse(questionnaire, reponses)
  if (manquantes.length > 0) {
    throw new Error(`${manquantes.length} question(s) sans réponse valide`)
  }

  const maxGlobal = scoreMaxGlobal(questionnaire)
  const total = questionnaire.questions.reduce((somme, question) => somme + reponses[question.id], 0)
  const pourcentageGlobal = pourcentage(total, maxGlobal)
  const plage = classerScore(total)
  const indexPlage = PLAGES.indexOf(plage)

  const categories = questionnaire.categories.map((categorie) => {
    const questions = questionnaire.questions.filter((question) => question.categorie === categorie.id)
    const score = questions.reduce((somme, question) => somme + reponses[question.id], 0)
    const max = questions.reduce((somme, question) => somme + question.scoreMax, 0)
    const pct = pourcentage(score, max)
    const indexNiveau = classerProportion(score, max, PLAGES, maxGlobal)
    const noteHaute = Math.max(...questions.map((question) => reponses[question.id]))
    return {
      categorie,
      score,
      max,
      pourcentage: pct,
      indexNiveau,
      niveau: { ...NIVEAUX_CATEGORIE[indexNiveau], plage: PLAGES[indexNiveau] },
      questionsMarquantes:
        noteHaute > 0
          ? questions
              .filter((question) => reponses[question.id] === noteHaute)
              .map((question) => ({ ...question, note: noteHaute }))
          : [],
    }
  })

  const priorites = classerCategories(categories)
    .filter((resultat) => resultat.score > 0)
    .slice(0, regles.nombrePriorites)

  const pointsAttention = classerCategories(categories)
    .filter((resultat) => resultat.score > 0)
    .map((resultat) => ({ ...resultat, motifs: motifsAttention(resultat, pourcentageGlobal, regles) }))
    .filter((resultat) => resultat.motifs.length > 0)

  return {
    versionQuestionnaire: questionnaire.version,
    total,
    maxGlobal,
    pourcentageGlobal,
    plage,
    indexPlage,
    categories,
    priorites,
    pointsAttention,
  }
}

/** Tri par pourcentage décroissant, puis score brut, puis ordre du questionnaire. */
export function classerCategories(categories) {
  return [...categories].sort(
    (a, b) =>
      b.pourcentage - a.pourcentage || b.score - a.score || a.categorie.id - b.categorie.id,
  )
}

export function motifsAttention(resultat, pourcentageGlobal, regles = REGLES_ATTENTION) {
  const motifs = []
  if (resultat.pourcentage >= regles.seuilAbsolu) {
    motifs.push('niveau')
  }
  if (resultat.pourcentage - pourcentageGlobal >= regles.ecartRelatif) {
    motifs.push('ecart')
  }
  return motifs
}
