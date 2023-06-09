/// <reference types="Cypress" />

import {
    returnWalletAddress,
    TEST_ADDRESS_NEVER_USE,
} from '../support/commands'

describe('App Page - Safe Details', () => {
    const getValue = (val: string) => val.replace(/[^\d.]*/g, '')

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
        cy.contains('✓ Accept').click()
        cy.get('.safeBlock').first().click()
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
        cy.wait(5000)
    })

    it('is connected', () => {
        const shortenedAddress = returnWalletAddress(TEST_ADDRESS_NEVER_USE)
        cy.get('#web3-status-connected').contains(shortenedAddress)
        cy.get('#web3-status-connected').click()
        cy.get('#web3-account-identifier-row').contains(shortenedAddress)
    })

    it('tries max borrow, and checks on CRatio and LiquidationPrice', () => {
        cy.get('#deposit_borrow').click()
        cy.get('[data-test-id="deposit_borrow_left_label"]')
            .invoke('text')
            .then((tx) => {
                cy.get('[data-test-id="deposit_borrow_left"]').type(
                    getValue(tx)
                )
            })
        cy.get('[data-test-id="deposit_borrow_right_label"]')
            .invoke('text')
            .then((tx) => {
                cy.get('[data-test-id="deposit_borrow_right"]').type(
                    getValue(tx)
                )
                cy.wait(5000)
                cy.contains('140.00%')
            })
    })

    it('should show error if no amount to deposit or borrow', () => {
        cy.get('#deposit_borrow').click()
        cy.get('[data-test-id="deposit_borrow_left"]').type('0')
        cy.get('[data-test-id="deposit_borrow_right"]').type('0')
        cy.contains('Please enter the amount')
    })

    it('should show error if not enough Eth to deposit', () => {
        cy.get('#deposit_borrow').click()
        cy.get('[data-test-id="deposit_borrow_left"]').type('50')
        cy.contains('Insufficient balance')
    })

    it('should show error if RAI exceeds available amount to borrow', () => {
        cy.get('#deposit_borrow').click()
        cy.get('[data-test-id="deposit_borrow_right"]').type('3000')
        cy.contains('RAI borrowed cannot exceed available amount')
    })

    it('should show error if no amount to repay or withdraw', () => {
        cy.get('#repay_withdraw').click()
        cy.get('[data-test-id="repay_withdraw_left"]').type('0')
        cy.get('[data-test-id="repay_withdraw_right"]').type('0')
        cy.contains(
            'Please enter the amount of ETH to free or the amount of RAI to repay'
        )
    })

    it('should show error if amount to withdraw exeeds available amount', () => {
        cy.get('#repay_withdraw').click()
        cy.get('[data-test-id="repay_withdraw_left"]').type('1000')
        cy.contains('ETH to unlock cannot exceed available amount')
    })

    it('should show error if amount to repay exeeds owed amount', () => {
        cy.get('#repay_withdraw').click()
        cy.get('[data-test-id="repay_withdraw_right"]').type('1000')
        cy.contains('RAI to repay cannot exceed owed amount')
    })

    it('should show error if too much debt', () => {
        cy.get('#repay_withdraw').click()
        cy.get('[data-test-id="repay_withdraw_left"]').type('1.5')
        cy.contains('Too much debt')
    })

    it('should show error if debt is greater than debt floor', () => {
        cy.get('#repay_withdraw').click()
        cy.get('[data-test-id="repay_withdraw_right"]').type('530')
        cy.contains(`The resulting debt should be at least`)
    })

    it('should perform a successful deposit and borrow transaction', () => {
        cy.get('#deposit_borrow').click()
        cy.get('[data-test-id="deposit_borrow_left"]').type('0.001')
        cy.get('[data-test-id="deposit_borrow_right"]').type('0.001')
        cy.contains('Review Transaction').click()
        cy.get('#confirm_tx').click()
        cy.get('[data-test-id="waiting-modal-title"]')
            .should('be.visible')
            .then((e) =>
                cy.waitUntil(
                    () => Cypress.$(e).text() === 'Transaction Submitted',
                    {
                        timeout: 100000,
                        interval: 5000,
                    }
                )
            )

        cy.contains('Close').click()
        cy.get('#web3-status-connected').click()
        cy.contains('Clear All').click()
    })

    it.only('should perform a successful repay and withdraw transaction', () => {
        cy.get('#repay_withdraw').click()
        cy.get('[data-test-id="repay_withdraw_left"]').type('0.001')
        cy.get('[data-test-id="repay_withdraw_right"]').type('0.001')
        cy.contains('Review Transaction').click()
        cy.get('#confirm_tx').click()
        cy.get('[data-test-id="waiting-modal-title"]')
            .should('be.visible')
            .then((e) =>
                cy.waitUntil(
                    () => Cypress.$(e).text() === 'Transaction Submitted',
                    {
                        timeout: 100000,
                        interval: 5000,
                    }
                )
            )

        cy.contains('Close').click()
        cy.get('#web3-status-connected').click()
        cy.contains('Clear All').click()
    })
})
