/// <reference types="Cypress" />

import {
    returnWalletAddress,
    TEST_ADDRESS_NEVER_USE,
} from '../support/commands'

describe('Distributions', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.wait(2000)
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

    it('should check that FLX button is available', () => {
        cy.get('[data-test-id="flx-btn"]').should('be.visible')
    })

    it('should open claim popup', () => {
        cy.get('[data-test-id="flx-btn"]').click()
        cy.get('[data-test-id="distributions-popup"]').should('be.visible')
    })

    it('should calculates balance and claimable amount of FLX', () => {
        let balance: string
        let calaimable: string
        cy.get('[data-test-id="flx-btn"]').click()
        cy.get('[data-test-id="distributions-popup"]').should('be.visible')
        cy.get('[data-test-id="flx-balance"]')
            .invoke('text')
            .then((tx) => {
                balance = tx
            })
        cy.get('[data-test-id="claimable-flx"]')
            .invoke('text')
            .then((tx) => {
                calaimable = tx
            })
        cy.get('[data-test-id="flx-total-balance"]')
            .invoke('text')
            .then((tx) => {
                const total_balance = tx.split(' FLX')[0]
                expect(Number(total_balance)).to.be.equal(
                    Number(balance) + Number(calaimable)
                )
            })
    })
})
