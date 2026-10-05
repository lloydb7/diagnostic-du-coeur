import { describe, expect, it } from 'vitest'
import { QUESTIONNAIRE } from '../src/data/questionnaire.js'
import { calculerBilan } from '../src/scoring/scoring.js'
import {
  effacerHistorique,
  enregistrerBilan,
  lireHistorique,
  stockageDisponible,
  supprimerEntree,
} from '../src/storage/historique.js'

function stockageMemoire() {
  const donnees = new Map()
  return {
    getItem: (cle) => (donnees.has(cle) ? donnees.get(cle) : null),
    setItem: (cle, valeur) => donnees.set(cle, String(valeur)),
    removeItem: (cle) => donnees.delete(cle),
    donnees,
  }
}

const bilan = calculerBilan(
  QUESTIONNAIRE,
  Object.fromEntries(QUESTIONNAIRE.questions.map((q) => [q.id, 1])),
)

describe('Historique local', () => {
  it("n'enregistre que les sous-totaux, sans les réponses détaillées", () => {
    const stockage = stockageMemoire()
    const [entree] = enregistrerBilan(bilan, stockage)
    expect(entree.total).toBe(63)
    expect(Object.keys(entree.categories)).toHaveLength(10)
    expect(entree).not.toHaveProperty('reponses')
    expect(lireHistorique(stockage)).toHaveLength(1)
  })

  it('supprime une entrée puis efface tout', () => {
    const stockage = stockageMemoire()
    enregistrerBilan(bilan, stockage, new Date('2026-01-01'))
    const entrees = enregistrerBilan(bilan, stockage, new Date('2026-02-01'))
    expect(entrees).toHaveLength(2)
    expect(supprimerEntree(entrees[0].id, stockage)).toHaveLength(1)
    effacerHistorique(stockage)
    expect(lireHistorique(stockage)).toEqual([])
  })

  it('résiste à un stockage absent, corrompu ou plein', () => {
    expect(lireHistorique(null)).toEqual([])
    const corrompu = stockageMemoire()
    corrompu.setItem('diagnostic-du-coeur:historique:v1', '{pas du json')
    expect(lireHistorique(corrompu)).toEqual([])
    const plein = { ...stockageMemoire(), setItem: () => { throw new Error('quota') } }
    expect(enregistrerBilan(bilan, plein)).toBeNull()
    expect(stockageDisponible(plein)).toBe(false)
  })
})
