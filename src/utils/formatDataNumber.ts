import { utils } from 'ethers'
import { formatNumber } from './helper'

/**
 * @dev Format a number to a string
 * @param input BigNumber string to format
 * @param decimals Number of BigNumber's decimals
 * @param formatDecimal Number of decimals to format to
 * @param currency Format as currency
 * @param compact Format as compact
 * @returns Formatted number
 */
export function formatDataNumber(
    input: string,
    decimals = 18,
    formatDecimal = 2,
    currency?: boolean,
    compact?: boolean
) {
    let res: number = Number.parseFloat(input)

    if (decimals !== 0) res = Number.parseFloat(utils.formatUnits(input, decimals))

    if (res < 0.01) return `${currency ? '$' : ''}${formatNumber(res.toString(), formatDecimal)}`

    return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: formatDecimal,
        notation: compact ? 'compact' : 'standard',
        style: currency ? 'currency' : 'decimal',
        currency: 'USD',
    }).format(res)
}
