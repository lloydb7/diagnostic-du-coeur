import { describe, expect, it } from 'vitest'
import { QUESTIONNAIRE } from '../src/data/questionnaire.js'
import {
  calculerBilan,
  classerProportion,
  classerScore,
  estComplet,
  estNoteValide,
  questionsSansReponse,
} from '../src/scoring/scoring.js'

const toutes = (note) => Object.fromEntries(QUESTIONNAIRE.questions.map((q) => [q.id, note]))

/** Réponses dont la somme vaut exactement `total` (remplissage glouton). */
function reponsesPourTotal(total) {
  let reste = total
  return Object.fromEntries(
    QUESTIONNAIRE.questions.map((q) => {
      const note = Math.min(5, reste)
      reste -= note
      return [q.id, note]
    }),
  )
}

/** Réponses à 0 sauf pour la catégorie donnée, fixée à `note`. */
function seulementCategorie(idCategorie, note) {
  return Object.fromEntries(QUESTIONNAIRE.questions.map((q) => [q.id, q.categorie === idCategorie ? note : 0]))
}

describe('Validation des réponses', () => {
  it('accepte uniquement les entiers de 0 à 5', () => {
    for (const note of [0, 1, 2, 3, 4, 5]) expect(estNoteValide(note)).toBe(true)
    for (const note of [-1, 6, 2.5, '3', null, undefined, NaN]) expect(estNoteValide(note)).toBe(false)
  })

  it('signale les questions sans réponse', () => {
    const reponses = toutes(2)
    delete reponses[10]
    reponses[20] = 7
    expect(questionsSansReponse(QUESTIONNAIRE, reponses).map((q) => q.id)).toEqual([10, 20])
    expect(estComplet(QUESTIONNAIRE, reponses)).toBe(false)
  })

  it('refuse de calculer un bilan incomplet ou invalide', () => {
    expect(() => calculerBilan(QUESTIONNAIRE, {})).toThrow()
    expect(() => calculerBilan(QUESTIONNAIRE, { ...toutes(1), 5: 6 })).toThrow()
  })
})

describe('Classification globale', () => {
  const attendus = [
    [0, 'vert'],
    [63, 'vert'],
    [64, 'jaune'],
    [126, 'jaune'],
    [127, 'orange'],
    [189, 'orange'],
    [190, 'rouge'],
    [252, 'rouge'],
    [253, 'noir'],
    [315, 'noir'],
  ]

  it.each(attendus)('score %i → plage %s', (score, plage) => {
    expect(classerScore(score).id).toBe(plage)
  })

  it.each(attendus)('bilan complet avec total %i → plage %s', (score, plage) => {
    const bilan = calculerBilan(QUESTIONNAIRE, reponsesPourTotal(score))
    expect(bilan.total).toBe(score)
    expect(bilan.plage.id).toBe(plage)
  })

  it('rejette les scores hors limites', () => {
    expect(() => classerScore(-1)).toThrow(RangeError)
    expect(() => classerScore(316)).toThrow(RangeError)
    expect(() => classerScore(10.5)).toThrow(RangeError)
  })
})

describe('Calcul du bilan', () => {
  it('donne 0 / 315 quand toutes les réponses valent 0', () => {
    const bilan = calculerBilan(QUESTIONNAIRE, toutes(0))
    expect(bilan.total).toBe(0)
    expect(bilan.pourcentageGlobal).toBe(0)
    expect(bilan.priorites).toEqual([])
    expect(bilan.pointsAttention).toEqual([])
  })

  it('donne 315 / 315 et 100 % quand toutes les réponses valent 5', () => {
    const bilan = calculerBilan(QUESTIONNAIRE, toutes(5))
    expect(bilan.total).toBe(315)
    expect(bilan.maxGlobal).toBe(315)
    expect(bilan.pourcentageGlobal).toBe(100)
    expect(bilan.categories.every((c) => c.score === c.max && c.pourcentage === 100)).toBe(true)
  })

  it('calcule les sous-totaux et les pourcentages par catégorie', () => {
    const bilan = calculerBilan(QUESTIONNAIRE, toutes(3))
    expect(bilan.total).toBe(189)
    const parId = Object.fromEntries(bilan.categories.map((c) => [c.categorie.id, c]))
    expect(parId[1].score).toBe(18)
    expect(parId[4].score).toBe(27)
    expect(parId[9].score).toBe(9)
    for (const resultat of bilan.categories) expect(resultat.pourcentage).toBeCloseTo(60)
  })

  it('classe les priorités par pourcentage et non par score brut', () => {
    // Catégorie 9 : 15/15 (100 %). Catégorie 4 : 9 questions à 2 → 18/45 (40 %).
    const reponses = { ...toutes(0) }
    QUESTIONNAIRE.questions.forEach((q) => {
      if (q.categorie === 9) reponses[q.id] = 5
      if (q.categorie === 4) reponses[q.id] = 2
    })
    const bilan = calculerBilan(QUESTIONNAIRE, reponses)
    expect(bilan.priorites.map((r) => r.categorie.id)).toEqual([9, 4])
    expect(bilan.priorites[0].score).toBeLessThan(bilan.priorites[1].score)
  })

  it('limite les priorités à 3 catégories', () => {
    const bilan = calculerBilan(QUESTIONNAIRE, toutes(2))
    expect(bilan.priorites).toHaveLength(3)
  })

  it("détecte un point d'attention malgré un score global faible", () => {
    const bilan = calculerBilan(QUESTIONNAIRE, seulementCategorie(8, 4))
    expect(bilan.total).toBe(20)
    expect(bilan.plage.id).toBe('vert')
    const attention = bilan.pointsAttention.map((r) => r.categorie.id)
    expect(attention).toEqual([8])
    expect(bilan.pointsAttention[0].motifs).toEqual(['niveau', 'ecart'])
  })

  it('identifie les questions où la note est la plus haute', () => {
    const reponses = seulementCategorie(2, 1)
    reponses[9] = 4
    const bilan = calculerBilan(QUESTIONNAIRE, reponses)
    const cat2 = bilan.categories.find((r) => r.categorie.id === 2)
    expect(cat2.questionsMarquantes.map((q) => q.id)).toEqual([9])
  })
})

describe('Niveau proportionnel des catégories', () => {
  it('applique les paliers de 20 % sans erreur d\'arrondi', () => {
    expect(classerProportion(3, 15)).toBe(0) // 20 % exactement → premier palier
    expect(classerProportion(4, 15)).toBe(1)
    expect(classerProportion(6, 30)).toBe(0)
    expect(classerProportion(7, 30)).toBe(1)
    expect(classerProportion(18, 45)).toBe(1) // 40 %
    expect(classerProportion(19, 45)).toBe(2)
    expect(classerProportion(45, 45)).toBe(4)
    expect(classerProportion(0, 25)).toBe(0)
  })
})
