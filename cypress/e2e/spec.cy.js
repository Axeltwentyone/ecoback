const BASE_URL = 'http://localhost:5173'

describe('EcoWork — Parcours utilisateur complet', () => {

  beforeEach(() => {
    cy.visit(`${BASE_URL}/login`)
    cy.get('input[type="email"]').type('jean2@test.com')
    cy.get('#pin-0').type('1')
    cy.get('#pin-1').type('2')
    cy.get('#pin-2').type('3')
    cy.get('#pin-3').type('4')
    cy.get('#pin-4').type('5')
    cy.get('#pin-5').type('6')
    cy.get('button').contains('connecter', { matchCase: false }).click()
    cy.url().should('not.include', '/login')
  })

  it('1 — s\'inscrit avec des données valides', () => {
    cy.clearLocalStorage()
    cy.visit(`${BASE_URL}/inscription`)
    cy.get('[data-cy="field-nom"]').type('Dupont')
    cy.get('[data-cy="field-prenom"]').type('Jean')
    cy.get('[data-cy="field-email"]').type(`test${Date.now()}@ecowork.com`)
    cy.get('[data-cy="field-telephone"]').type('0612345678')
    cy.get('[data-cy="field-adresse"]').type('12 rue de Paris, 75011')
    cy.get('[data-cy="btn-continuer"]').click()
    cy.get('#pin-0').type('1')
    cy.get('#pin-1').type('2')
    cy.get('#pin-2').type('3')
    cy.get('#pin-3').type('4')
    cy.get('#pin-4').type('5')
    cy.get('#pin-5').type('6')
    cy.get('[data-cy="btn-continuer"]').click()
    cy.url().should('include', '/')
  })

  it('2 — se connecte avec son compte', () => {
    cy.url().should('not.include', '/login')
  })

  it('3 — consulte la liste des espaces', () => {
    cy.visit(`${BASE_URL}/espaces`)
    cy.get('[data-cy="espace-card"]').should('have.length.greaterThan', 0)
  })

  it('4 — voit le détail d\'un espace', () => {
    cy.visit(`${BASE_URL}/espaces`)
    cy.get('[data-cy="espace-card"]').first().click()
    cy.url().should('include', '/espaces/')
  })

  it('5 — réserve un espace avec des dates', () => {
    cy.visit(`${BASE_URL}/espaces`)
    cy.get('[data-cy="espace-card"]').first().click()
    cy.url().should('include', '/espaces/')
    cy.get('input[type="date"]').first().type('2026-04-20')
  cy.get('input[type="date"]').last().type('2026-04-29')
    cy.get('button').contains('Réserver', { matchCase: false }).click()
cy.url({ timeout: 10000 }).should('include', '/dashboard')
  })

})