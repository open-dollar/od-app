import { utils } from 'ethers'
import { formatDataNumber } from './formatDataNumber'

export const toPercentage = (value: number, decimals: number) => {
    return `${formatDataNumber((value * 100).toString(), 0, decimals, false, false)}%`
}

export const transformToAnualRate = (rate: string, decimals: number) => {
    const exponent = 3600 * 24 * 365
    const base = utils.formatUnits(rate, decimals)
    const result = Number(base) ** exponent - 1

    return toPercentage(result, 2)
}

export const transformToEightHourlyRate = (rate: string, decimals: number) => {
    const exponent = 3600 * 8
    const base = utils.formatUnits(rate, decimals)
    const result = Number(base) ** exponent - 1

    return toPercentage(result, 2)
}
