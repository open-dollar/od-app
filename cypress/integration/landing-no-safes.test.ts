/// <reference types="Cypress" />

import {
    ADDRESS_NO_SAFES_NEVER_USER,
    returnWalletAddress,
    TEST_ADDRESS_NEVER_USE,
} from '../support/commands'

describe('App Page - No Safes', () => {
    beforeEach(() => {
        cy.visit('/', {
            qs: { type: 'no_safes' },
        })
        cy.wait(5000)
        cy.get('body').then((body) => {
            if (body.find('[data-test-id="waiting-modal"]').length > 0) {
                cy.get('[data-test-id="waiting-modal"]').then((e) => {
                    if (e.is(':visible')) {
                        cy.waitUntil(() => Cypress.$(e).is(':hidden'), {
                            timeout: 100000,
                        })
                    }
                })
            }
        })
    })
    it('loads App page', () => {
        cy.get('#app-page')
    })

    it('is connected', () => {
        const shortenedAddress = returnWalletAddress(
            ADDRESS_NO_SAFES_NEVER_USER
        )
        cy.get('#web3-status-connected').contains(shortenedAddress)
        cy.get('#web3-status-connected').click()
        cy.get('#web3-account-identifier-row').contains(shortenedAddress)
    })

    it('is has a create safe', () => {
        cy.contains('✓ Accept').click()
        cy.get('#step2 > div').contains('Create a Safe')
        cy.get('[data-test-id="steps-btn"]').contains('Create a Safe').click()
        cy.wait(5000)
        cy.url().should('include', 'create')
    })

    it('creates a new safe', () => {
        cy.contains('✓ Accept').click()
        cy.get('[data-test-id="steps-btn"]').contains('Create a Safe').click()
        cy.wait(5000)
        cy.url().should('include', 'create')
        cy.get('[data-test-id="deposit_borrow"]').type('4')
        cy.get('[data-test-id="repay_withdraw"]').type('1000')
        cy.contains('Review Transaction').click()
        cy.get('#create_confirm').click()
        cy.contains('Transaction Failed')
    })

    it('should shows RAI Allowance unlock if I have a proxy', () => {
        cy.contains('✓ Accept').click()
        cy.get('[data-test-id="topup-btn"]').click()
        cy.get('#topup_input').type(TEST_ADDRESS_NEVER_USE)
        cy.get('[data-test-id="topup-manage"]').click()
        cy.url().should('include', TEST_ADDRESS_NEVER_USE)
        cy.wait(10000)
        cy.get('.safeBlock').first().click()
        cy.url().should('include', 'safes/')
        cy.contains('CAUTION')
        cy.get('#repay_withdraw').click()
        cy.url().should('include', 'withdraw')
        cy.get('[data-test-id="repay_withdraw_left"]').should('be.disabled')
        cy.get('[data-test-id="repay_withdraw_right"]').type('0.001')
        cy.wait(10000)
        cy.contains('Unlock RAI')
    })
})
