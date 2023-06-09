import {
    formatNumber,
    getCollateralRatio,
    getEtherscanLink,
    getLiquidationPrice,
    isAddress,
    ratioChecker,
    returnTotalValue,
    safeIsSafe,
} from './helper'

describe('utils', () => {
    describe('#getEtherscanLink', () => {
        it('correct for tx', () => {
            expect(getEtherscanLink(1, 'abc', 'transaction')).toEqual(
                'https://etherscan.io/tx/abc'
            )
        })
        it('correct for token', () => {
            expect(getEtherscanLink(1, 'abc', 'token')).toEqual(
                'https://etherscan.io/token/abc'
            )
        })
        it('correct for address', () => {
            expect(getEtherscanLink(1, 'abc', 'address')).toEqual(
                'https://etherscan.io/address/abc'
            )
        })
        it('unrecognized chain id defaults to mainnet', () => {
            expect(getEtherscanLink(2, 'abc', 'address')).toEqual(
                'https://etherscan.io/address/abc'
            )
        })
        it('ropsten', () => {
            expect(getEtherscanLink(3, 'abc', 'address')).toEqual(
                'https://ropsten.etherscan.io/address/abc'
            )
        })
    })

    describe('#isAddress', () => {
        it('returns false if not', () => {
            expect(isAddress('')).toBe(false)
            expect(isAddress('0x0000')).toBe(false)
            expect(isAddress(1)).toBe(false)
            expect(isAddress({})).toBe(false)
            expect(isAddress(undefined)).toBe(false)
        })

        it('returns the checksummed address', () => {
            expect(
                isAddress('0xf164fc0ec4e93095b804a4795bbe1e041497b92a')
            ).toBe('0xf164fC0Ec4E93095b804a4795bBe1e041497b92a')
            expect(
                isAddress('0xf164fC0Ec4E93095b804a4795bBe1e041497b92a')
            ).toBe('0xf164fC0Ec4E93095b804a4795bBe1e041497b92a')
        })

        it('succeeds even without prefix', () => {
            expect(isAddress('f164fc0ec4e93095b804a4795bbe1e041497b92a')).toBe(
                '0xf164fC0Ec4E93095b804a4795bBe1e041497b92a'
            )
        })
        it('fails if too long', () => {
            expect(isAddress('f164fc0ec4e93095b804a4795bbe1e041497b92a0')).toBe(
                false
            )
        })
    })

    describe('#formatNumber', () => {
        it('returns default 4 digits as decimals', () => {
            expect(formatNumber('12.3456789')).toEqual('12.3456')
        })
        it('returns 3 digits as decimals', () => {
            expect(formatNumber('12.3456789', 3)).toEqual('12.345')
        })
        it('returns 3 digits as decimals and rounds up the number', () => {
            expect(formatNumber('12.3456789', 2, true)).toEqual('12.35')
        })
    })

    describe('#formatNumber', () => {
        it('returns default 4 digits as decimals', () => {
            expect(formatNumber('12.3456789')).toEqual('12.3456')
        })
        it('returns 3 digits as decimals', () => {
            expect(formatNumber('12.3456789', 3)).toEqual('12.345')
        })
        it('returns 3 digits as decimals and rounds up the number', () => {
            expect(formatNumber('12.3456789', 2, true)).toEqual('12.35')
        })
    })

    describe('#getLiquidationPrice', () => {
        it('returns 0 if no value in params', () => {
            expect(getLiquidationPrice('', '', '', '')).toEqual('0')
        })
        it('returns 0 if one of the params is empty', () => {
            expect(getLiquidationPrice('', '2', '1', '2')).toEqual('0')
        })
        it('succeeds in returning desired value', () => {
            expect(getLiquidationPrice('2', '2', '1', '2')).toEqual(2)
        })
    })

    describe('#getCollateralRatio', () => {
        it('returns 0 if no value in params', () => {
            expect(getCollateralRatio('', '', '', '')).toEqual('0')
        })
        it('returns 0 if one of the params is empty', () => {
            expect(getCollateralRatio('', '2', '1', '1')).toEqual('0')
        })
        it('succeeds in returning desired value', () => {
            expect(getCollateralRatio('2', '2', '1', '1')).toEqual(100)
        })
    })

    describe('#safeIsSafe', () => {
        it('returns true', () => {
            expect(safeIsSafe('2', '2', '1')).toBe(true)
        })
        it('returns false if not', () => {
            expect(safeIsSafe('1', '2', '1')).toBe(false)
        })
    })

    describe('#ratioChecker', () => {
        it('returns 0', () => {
            expect(ratioChecker(0)).toEqual(0)
        })

        it('returns 1', () => {
            expect(ratioChecker(300)).toEqual(1)
        })
        it('returns 1', () => {
            expect(ratioChecker(301)).toEqual(1)
        })

        it('returns 2', () => {
            expect(ratioChecker(200)).toEqual(2)
        })

        it('returns 2', () => {
            expect(ratioChecker(201)).toEqual(2)
        })
        it('returns 3', () => {
            expect(ratioChecker(199)).toEqual(3)
        })

        it('returns 3', () => {
            expect(ratioChecker(50)).toEqual(3)
        })
    })

    describe('#returnTotalValue', () => {
        it('returns 0 if empty', () => {
            expect(returnTotalValue('', '')).toEqual('0')
        })
        it('returns 2', () => {
            expect(returnTotalValue('2', '')).toEqual('2')
        })
        it('returns 3', () => {
            expect(returnTotalValue('2', '1')).toEqual('3')
        })

        it('returns 3.3567 and rounds up the value', () => {
            expect(returnTotalValue('2', '1.35678')).toEqual('3.3567')
        })
        it('returns 0', () => {
            expect(returnTotalValue('2', '2', true, true)).toEqual('0')
        })
    })
})
