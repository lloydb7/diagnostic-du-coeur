import { describe, expect, it } from 'vitest'
import { QUESTIONNAIRE } from '../src/data/questionnaire.js'
import { PLAGES, SCORE_MAX_GLOBAL } from '../src/config/interpretation.js'
import { verifierPlages, verifierQuestionnaire } from '../src/scoring/validation.js'
import { scoreMaxCategorie, scoreMaxGlobal } from '../src/scoring/scoring.js'

// Valeurs attendues, recopiées du tableau de calcul du document.
const MAXIMA_ATTENDUS = { 1: 30, 2: 20, 3: 30, 4: 45, 5: 45, 6: 45, 7: 35, 8: 25, 9: 15, 10: 25 }

describe('Données du questionnaire', () => {
  it('contient exactement 63 questions numérotées de 1 à 63', () => {
    expect(QUESTIONNAIRE.questions).toHaveLength(63)
    expect(QUESTIONNAIRE.questions.map((q) => q.id)).toEqual(Array.from({ length: 63 }, (_, i) => i + 1))
  })

  it('contient 10 catégories', () => {
    expect(QUESTIONNAIRE.categories.map((c) => c.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  it('chaque question a les champs requis', () => {
    for (const question of QUESTIONNAIRE.questions) {
      expect(question).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          categorie: expect.any(Number),
          question: expect.any(String),
          referenceBiblique: expect.any(String),
          scoreMax: 5,
        }),
      )
      expect(question.question.trim()).not.toBe('')
      expect(question.referenceBiblique.trim()).not.toBe('')
    }
  })

  it('a des maxima de catégories conformes au document', () => {
    for (const [id, max] of Object.entries(MAXIMA_ATTENDUS)) {
      expect(scoreMaxCategorie(QUESTIONNAIRE, Number(id)), `catégorie ${id}`).toBe(max)
    }
  })

  it('a un score maximal global de 315', () => {
    expect(scoreMaxGlobal(QUESTIONNAIRE)).toBe(315)
    expect(SCORE_MAX_GLOBAL).toBe(315)
  })

  it('a une échelle de 0 à 5 avec 6 niveaux', () => {
    expect(QUESTIONNAIRE.echelle.map((n) => n.valeur)).toEqual([0, 1, 2, 3, 4, 5])
  })

  it('passe le contrôle d\'intégrité complet', () => {
    expect(
      verifierQuestionnaire(QUESTIONNAIRE, {
        nombreQuestions: 63,
        maximaCategories: MAXIMA_ATTENDUS,
        scoreMaxGlobal: 315,
      }),
    ).toEqual([])
  })

  it('détecte une anomalie dans des données modifiées', () => {
    const casse = { ...QUESTIONNAIRE, questions: QUESTIONNAIRE.questions.slice(1) }
    expect(verifierQuestionnaire(casse, { nombreQuestions: 63, scoreMaxGlobal: 315 }).length).toBeGreaterThan(0)
  })
})

describe('Plages de classification', () => {
  it('couvrent 0–315 sans trou ni chevauchement', () => {
    expect(verifierPlages(PLAGES, 315)).toEqual([])
  })

  it('sont exactement celles du document', () => {
    expect(PLAGES.map((p) => [p.min, p.max, p.couleur, p.classification])).toEqual([
      [0, 63, 'Vert', 'Cœur selon le cœur de Dieu'],
      [64, 126, 'Jaune', 'Cœur droit en tension'],
      [127, 189, 'Orange', 'Cœur partagé / double'],
      [190, 252, 'Rouge', 'Cœur charnel, dominé par les œuvres de la chair'],
      [253, 315, 'Noir', 'Cœur endurci, de pierre, non circoncis'],
    ])
  })

  it('détecte un trou et un chevauchement', () => {
    const trou = PLAGES.map((p) => (p.id === 'jaune' ? { ...p, min: 65 } : p))
    const chevauchement = PLAGES.map((p) => (p.id === 'jaune' ? { ...p, min: 60 } : p))
    expect(verifierPlages(trou, 315).join()).toMatch(/Trou/)
    expect(verifierPlages(chevauchement, 315).join()).toMatch(/Chevauchement/)
  })
})
