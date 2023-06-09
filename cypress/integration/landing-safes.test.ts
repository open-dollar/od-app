/// <reference types="Cypress" />

import {
    returnWalletAddress,
    TEST_ADDRESS_NEVER_USE,
} from '../support/commands'

describe('App Page - Has Safes', () => {
    beforeEach(() => {
        cy.visit('/')
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
        const shortenedAddress = returnWalletAddress(TEST_ADDRESS_NEVER_USE)
        cy.get('#web3-status-connected').contains(shortenedAddress)
        cy.get('#web3-status-connected').click()
        cy.get('#web3-account-identifier-row').contains(shortenedAddress)
    })

    it('checks if cookie banner is visible', () => {
        cy.get('#cookies-consent')
        cy.contains('✓ Accept').click()
    })

    it('has safes', () => {
        cy.contains('Accounts')
        cy.contains('New Safe')
    })

    it('is a safeBlock', () => {
        cy.get('.safeBlock').each(($el: any) => {
            cy.get($el).contains('Safe #')
            cy.get($el).contains('ETH Deposited')
            cy.get($el).contains('RAI Borrowed')
            cy.get($el).contains('Collateralization Ratio')
            cy.get($el).contains('Liquidation Price')
        })
    })
})
