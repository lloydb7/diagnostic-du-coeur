/**
 * Historique facultatif, enregistré uniquement sur l'appareil (localStorage)
 * et seulement à la demande explicite de la personne.
 * Par minimisation, on ne conserve que les sous-totaux par catégorie, pas
 * les réponses question par question.
 */

const CLE = 'diagnostic-du-coeur:historique:v1'

function stockageParDefaut() {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null
  } catch {
    return null
  }
}

export function lireHistorique(stockage = stockageParDefaut()) {
  if (!stockage) return []
  try {
    const brut = JSON.parse(stockage.getItem(CLE) ?? '[]')
    return Array.isArray(brut) ? brut.filter(estEntreeValide) : []
  } catch {
    return []
  }
}

function ecrire(entrees, stockage) {
  if (!stockage) return false
  try {
    stockage.setItem(CLE, JSON.stringify(entrees))
    return true
  } catch {
    return false
  }
}

function estEntreeValide(entree) {
  return (
    entree &&
    typeof entree.id === 'string' &&
    typeof entree.date === 'string' &&
    Number.isInteger(entree.total) &&
    entree.categories &&
    typeof entree.categories === 'object'
  )
}

export function entreeDepuisBilan(bilan, date = new Date()) {
  return {
    id: `${date.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
    date: date.toISOString(),
    versionQuestionnaire: bilan.versionQuestionnaire,
    total: bilan.total,
    maxGlobal: bilan.maxGlobal,
    categories: Object.fromEntries(
      bilan.categories.map((resultat) => [resultat.categorie.id, { score: resultat.score, max: resultat.max }]),
    ),
  }
}

/** Ajoute une entrée ; renvoie la nouvelle liste ou null si l'écriture a échoué. */
export function enregistrerBilan(bilan, stockage = stockageParDefaut(), date = new Date()) {
  const entrees = [entreeDepuisBilan(bilan, date), ...lireHistorique(stockage)]
  return ecrire(entrees, stockage) ? entrees : null
}

export function supprimerEntree(id, stockage = stockageParDefaut()) {
  const entrees = lireHistorique(stockage).filter((entree) => entree.id !== id)
  ecrire(entrees, stockage)
  return entrees
}

export function effacerHistorique(stockage = stockageParDefaut()) {
  if (!stockage) return []
  try {
    stockage.removeItem(CLE)
  } catch {
    // stockage indisponible : rien à effacer
  }
  return []
}

export function stockageDisponible(stockage = stockageParDefaut()) {
  if (!stockage) return false
  try {
    const cle = `${CLE}:test`
    stockage.setItem(cle, '1')
    stockage.removeItem(cle)
    return true
  } catch {
    return false
  }
}
