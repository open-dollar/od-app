/// <reference types="Cypress" />

import {
    ADDRESS_NO_PROXY_NEVER_USER,
    ADDRESS_NO_SAFES_NEVER_USER,
    returnWalletAddress,
    TEST_ADDRESS_NEVER_USE,
} from '../support/commands'

describe('App Page - No Proxy', () => {
    beforeEach(() => {
        cy.visit('/', {
            qs: { type: 'no_proxy' },
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
            ADDRESS_NO_PROXY_NEVER_USER
        )
        cy.get('#web3-status-connected').contains(shortenedAddress)
        cy.get('#web3-status-connected').click()
        cy.get('#web3-account-identifier-row').contains(shortenedAddress)
    })

    it('checks if cookie banner is visible', () => {
        cy.get('#cookies-consent')
        cy.contains('✓ Accept').click()
    })

    it('has no proxy', () => {
        cy.get('#step1 > div').contains('Create Account')
        cy.contains('✓ Accept').click()
        cy.get('[data-test-id="steps-btn"]').contains('Create Account').click()
        cy.wait(5000)
        cy.contains('Transaction Failed').should('be.visible')
        cy.contains('Dismiss').should('be.visible')
    })

    it('opens top-up modal', () => {
        cy.contains('✓ Accept').click()
        cy.get('[data-test-id="topup-btn"]').click()
    })

    it('shows error if no address', () => {
        cy.contains('✓ Accept').click()
        cy.get('[data-test-id="topup-btn"]').click()
        cy.get('[data-test-id="topup-manage"]').click()
        cy.contains('Enter a valid ETH address')
    })

    it('shows error if invalid address', () => {
        cy.contains('✓ Accept').click()
        cy.get('[data-test-id="topup-btn"]').click()
        cy.get('#topup_input').type('0x0')
        cy.get('[data-test-id="topup-manage"]').click()
        cy.contains('Enter a valid ETH address')
    })

    it('shows error if same address', () => {
        cy.contains('✓ Accept').click()
        cy.get('[data-test-id="topup-btn"]').click()
        cy.get('#topup_input').type(ADDRESS_NO_PROXY_NEVER_USER)
        cy.get('[data-test-id="topup-manage"]').click()
        cy.contains('Cannot use your own address')
    })

    it('shows error if address is a valid but has no safes', () => {
        cy.contains('✓ Accept').click()
        cy.get('[data-test-id="topup-btn"]').click()
        cy.get('#topup_input').type(ADDRESS_NO_SAFES_NEVER_USER)
        cy.get('[data-test-id="topup-manage"]').click()
        cy.wait(15000)
        cy.contains('Address has no Safes')
    })

    it('should navigate to safe list of the address if user has safes', () => {
        cy.contains('✓ Accept').click()
        cy.get('[data-test-id="topup-btn"]').click()
        cy.get('#topup_input').type(TEST_ADDRESS_NEVER_USE)
        cy.get('[data-test-id="topup-manage"]').click()
        cy.wait(15000)
        cy.url().should('include', TEST_ADDRESS_NEVER_USE)
    })

    it('should navigate to first safe page details', () => {
        cy.contains('✓ Accept').click()
        cy.get('[data-test-id="topup-btn"]').click()
        cy.get('#topup_input').type(TEST_ADDRESS_NEVER_USE)
        cy.get('[data-test-id="topup-manage"]').click()
        cy.wait(15000)
        cy.url().should('include', TEST_ADDRESS_NEVER_USE)
        cy.get('.safeBlock').first().click()
        cy.url().should('include', 'safes/')
    })

    it('should show alert that you are not owner of the safe', () => {
        cy.contains('✓ Accept').click()
        cy.get('[data-test-id="topup-btn"]').click()
        cy.get('#topup_input').type(TEST_ADDRESS_NEVER_USE)
        cy.get('[data-test-id="topup-manage"]').click()
        cy.wait(15000)
        cy.url().should('include', TEST_ADDRESS_NEVER_USE)
        cy.get('.safeBlock').first().click()
        cy.url().should('include', 'safes/')
        cy.contains('CAUTION')
    })

    it('should check if withdraw and borrow inputs are disabled', () => {
        cy.contains('✓ Accept').click()
        cy.get('[data-test-id="topup-btn"]').click()
        cy.get('#topup_input').type(TEST_ADDRESS_NEVER_USE)
        cy.get('[data-test-id="topup-manage"]').click()
        cy.wait(15000)
        cy.url().should('include', TEST_ADDRESS_NEVER_USE)
        cy.get('.safeBlock').first().click()
        cy.url().should('include', 'safes/')
        cy.contains('CAUTION')
        cy.get('#deposit_borrow').click()
        cy.wait(5000)
        cy.get('[data-test-id="deposit_borrow_right"]').should('be.disabled')
        cy.get('[data-test-id="deposit_borrow_left"]').type('0.001')
        cy.contains('Back').click()
        cy.get('#repay_withdraw').click()
        cy.get('[data-test-id="repay_withdraw_left"]').should('be.disabled')
        cy.get('[data-test-id="repay_withdraw_right"]').type('0.001')
    })

    it('should show error if I do not have a proxy address', () => {
        cy.contains('✓ Accept').click()
        cy.get('[data-test-id="topup-btn"]').click()
        cy.get('#topup_input').type(TEST_ADDRESS_NEVER_USE)
        cy.get('[data-test-id="topup-manage"]').click()
        cy.wait(15000)
        cy.url().should('include', TEST_ADDRESS_NEVER_USE)
        cy.get('.safeBlock').first().click()
        cy.url().should('include', 'safes/')
        cy.contains('CAUTION')
        cy.get('#repay_withdraw').click()
        cy.get('[data-test-id="repay_withdraw_left"]').should('be.disabled')
        cy.get('[data-test-id="repay_withdraw_right"]').type('0.001')
        cy.contains('Create a Reflexer Account to continue')
    })
})
