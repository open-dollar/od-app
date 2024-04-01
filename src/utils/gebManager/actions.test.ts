import { BigNumber, FixedNumber } from 'ethers'

// Add some custom matchers
expect.extend({
    // Compare numbers as string regardless of things like trailing/leading zeros
    // And work with the gql endpoint way of handling BigDecimals
    fixedNumberMatch(received, other: string) {
        // Use format 45 decimal
        const fixReceived = FixedNumber.from(received, 'fixed256x45')
        const fixOther = FixedNumber.from(other, 'fixed256x45')

        // The GQL endpoint will allow only up to 33-34 digits base 10 for the mantissa
        // So we truncate it
        const gqlMaxMantissaSize = 33
        const mantissaReceived = BigNumber.from(fixReceived.toHexString()).toString()
        const mantissaOther = BigNumber.from(fixOther.toHexString()).toString()
        const truncatedMantissaReceived = mantissaReceived.slice(0, gqlMaxMantissaSize)
        const truncatedMantissaOther = mantissaOther.slice(0, gqlMaxMantissaSize)

        // Compare the mantissa and the decimal place
        if (
            truncatedMantissaReceived === truncatedMantissaOther &&
            fixReceived.format.decimals === fixOther.format.decimals
        ) {
            return { pass: true, message: () => 'Good' }
        } else {
            return {
                pass: false,
                message: () => `Got ${received} not matching ${other}`,
            }
        }
    },
    // Equality with a specified tolerance
    almostEqual(received: string, other: string, maxAbsoluteDeviation: number) {
        const deviation = Math.abs(Number(received) - Number(other))
        if (deviation <= maxAbsoluteDeviation) {
            return { pass: true, message: () => 'Good' }
        } else {
            return {
                pass: false,
                message: () => `Got ${received} not matching ${other} \n Deviation of ${deviation} is too large`,
            }
        }
    },
})

describe('empty', () => {
    it('empty', () => {
        expect(true).toBe(true)
    })
})