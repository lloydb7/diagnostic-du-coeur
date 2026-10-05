/**
 * Contrôles d'intégrité du questionnaire et de la configuration.
 * Renvoie la liste des anomalies (tableau vide = données cohérentes).
 * Utilisé par les tests automatisés et vérifié au démarrage en développement.
 */

export function verifierQuestionnaire(questionnaire, attendu = {}) {
  const erreurs = []
  const { questions, categories, noteMin, noteMax } = questionnaire
  const idsCategories = new Set(categories.map((categorie) => categorie.id))

  if (attendu.nombreQuestions !== undefined && questions.length !== attendu.nombreQuestions) {
    erreurs.push(`Nombre de questions : ${questions.length} au lieu de ${attendu.nombreQuestions}`)
  }

  const ids = questions.map((question) => question.id)
  if (new Set(ids).size !== ids.length) {
    erreurs.push('Identifiants de questions en double')
  }
  ids.forEach((id, index) => {
    if (id !== index + 1) erreurs.push(`Numérotation discontinue à la position ${index + 1} (id ${id})`)
  })

  questions.forEach((question) => {
    if (!idsCategories.has(question.categorie)) {
      erreurs.push(`Question ${question.id} : catégorie inconnue ${question.categorie}`)
    }
    if (!question.question?.trim()) erreurs.push(`Question ${question.id} : intitulé vide`)
    if (!question.referenceBiblique?.trim()) erreurs.push(`Question ${question.id} : référence vide`)
    if (question.scoreMax !== noteMax - noteMin) {
      erreurs.push(`Question ${question.id} : scoreMax ${question.scoreMax} incohérent avec l'échelle`)
    }
  })

  if (questionnaire.echelle.length !== noteMax - noteMin + 1) {
    erreurs.push("L'échelle ne couvre pas toutes les notes")
  }

  if (attendu.maximaCategories) {
    categories.forEach((categorie) => {
      const max = questions
        .filter((question) => question.categorie === categorie.id)
        .reduce((somme, question) => somme + question.scoreMax, 0)
      const maxAttendu = attendu.maximaCategories[categorie.id]
      if (max !== maxAttendu) {
        erreurs.push(`Catégorie ${categorie.id} : maximum ${max} au lieu de ${maxAttendu}`)
      }
    })
  }

  if (attendu.scoreMaxGlobal !== undefined) {
    const total = questions.reduce((somme, question) => somme + question.scoreMax, 0)
    if (total !== attendu.scoreMaxGlobal) {
      erreurs.push(`Score maximal global : ${total} au lieu de ${attendu.scoreMaxGlobal}`)
    }
  }

  return erreurs
}

/** Vérifie que les plages couvrent exactement [0, max] sans trou ni chevauchement. */
export function verifierPlages(plages, scoreMax) {
  const erreurs = []
  const triees = [...plages].sort((a, b) => a.min - b.min)
  if (triees[0]?.min !== 0) erreurs.push('La première plage ne commence pas à 0')
  if (triees[triees.length - 1]?.max !== scoreMax) {
    erreurs.push(`La dernière plage ne se termine pas à ${scoreMax}`)
  }
  triees.forEach((plage, index) => {
    if (plage.min > plage.max) erreurs.push(`Plage ${plage.id} : min > max`)
    const suivante = triees[index + 1]
    if (suivante && suivante.min !== plage.max + 1) {
      erreurs.push(
        suivante.min <= plage.max
          ? `Chevauchement entre ${plage.id} et ${suivante.id}`
          : `Trou entre ${plage.id} et ${suivante.id}`,
      )
    }
  })
  return erreurs
}
