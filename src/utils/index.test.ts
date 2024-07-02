import { formatDataNumber } from './formatDataNumber'
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
import { ChainId } from './interfaces'

describe('utils', () => {
    describe('#getEtherscanLink', () => {
        it('correct for tx', () => {
            expect(getEtherscanLink(1 as ChainId, 'abc', 'transaction')).toEqual('https://etherscan.io/tx/abc')
        })
        it('correct for token', () => {
            expect(getEtherscanLink(1 as ChainId, 'abc', 'token')).toEqual('https://etherscan.io/token/abc')
        })
        it('correct for address', () => {
            expect(getEtherscanLink(1 as ChainId, 'abc', 'address')).toEqual('https://etherscan.io/address/abc')
        })
        it('unrecognized chain id defaults to mainnet', () => {
            expect(getEtherscanLink(2 as ChainId, 'abc', 'address')).toEqual('https://etherscan.io/address/abc')
        })
        it('goerli optimism', () => {
            expect(getEtherscanLink(420 as ChainId, 'abc', 'address')).toEqual(
                'https://goerli-optimism.etherscan.io/address/abc'
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
            expect(isAddress('0xf164fc0ec4e93095b804a4795bbe1e041497b92a')).toBe(
                '0xf164fC0Ec4E93095b804a4795bBe1e041497b92a'
            )
            expect(isAddress('0xf164fC0Ec4E93095b804a4795bBe1e041497b92a')).toBe(
                '0xf164fC0Ec4E93095b804a4795bBe1e041497b92a'
            )
        })

        it('succeeds even without prefix', () => {
            expect(isAddress('f164fc0ec4e93095b804a4795bbe1e041497b92a')).toBe(
                '0xf164fC0Ec4E93095b804a4795bBe1e041497b92a'
            )
        })
        it('fails if too long', () => {
            expect(isAddress('f164fc0ec4e93095b804a4795bbe1e041497b92a0')).toBe(false)
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
        it('returns 1 when any parameter is null or undefined', () => {
            expect(ratioChecker(0, null as any, 0)).toEqual(1)
            expect(ratioChecker(null as any, 1.2, 1.5)).toEqual(1)
            expect(ratioChecker(150, null as any, 1.5)).toEqual(1)
            expect(ratioChecker(150, 1.2, null as any)).toEqual(1)
        })

        it('returns 0 when currentLiquidationRatio is 0', () => {
            expect(ratioChecker(0, 1.2, 1.5)).toEqual(0)
        })

        it('returns 1 when currentLiquidationRatio is greater than safetyRatio * 1.20', () => {
            expect(ratioChecker(12100, 1.0, 1.0)).toEqual(1)
            expect(ratioChecker(13000, 1.2, 1.5)).toEqual(1)
        })

        it('returns 2 when currentLiquidationRatio is less than or equal to safetyRatio * 1.20 but greater than safetyRatio', () => {
            expect(ratioChecker(110, 1.0, 1.0)).toEqual(2)
            expect(ratioChecker(161, 1.2, 1.5)).toEqual(2)
        })

        it('returns 3 when currentLiquidationRatio is less than or equal to safetyRatio but greater than liqRatio', () => {
            expect(ratioChecker(100, 1.0, 1.0)).toEqual(3)
            expect(ratioChecker(150, 1.2, 1.5)).toEqual(3)
        })

        it('returns 4 when currentLiquidationRatio is less than liqRatio and 3 when equal', () => {
            expect(ratioChecker(100, 1.0, 1.0)).toEqual(3)
            expect(ratioChecker(135, 1.35, 1.35)).toEqual(3)
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

    describe('formatDataNumber', () => {
        it('handles format decimals correctly', () => {
            const input = "2457565485783295579314012"
            expect(formatDataNumber(input, 18, 2)).toEqual('2,457,565.49')
        })

        it('handles dollar currency sign correctly', () => {
            const input = "2457565485783295579314012"
            expect(formatDataNumber(input, 18, 2, true)).toEqual('$2,457,565.49')
        })

        it('handles compact value and currency sign correctly', () => {
            const input = "2457565485783295579314012"
            expect(formatDataNumber(input, 18, 2, true, true)).toEqual('$2.46M')
        })

        it('handles compact format decimals and minimum decimals correctly', () => {
            const input = "1000000000000000000"
            expect(formatDataNumber(input, 18, 3, true, undefined, 4)).toEqual('$1.0000')
        })
    })
})
