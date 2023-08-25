import { utils } from 'ethers'
import { BigNumber } from '@ethersproject/bignumber'
import { formatDataNumber } from './formatDataNumber'

export const RAD = BigNumber.from('1000000000000000000000000000000000000000000000')
export const RAY = BigNumber.from('1000000000000000000000000000')
export const WAD = BigNumber.from('1000000000000000000')

export const toPercentage = (value: number, decimals: number, minimumDecimals: number = 0) => {
    return `${formatDataNumber((value * 100).toString(), 0, decimals, false, false, minimumDecimals)}%`
}

export const multiplyRates = (rate1: string, rate2: string) => {
    const result = BigNumber.from(rate1).mul(BigNumber.from(rate2)).div(RAY)

    return result.toString()
}

export const multiplyWad = (wad1: string, wad2: string) => {
    const result = BigNumber.from(wad1).mul(BigNumber.from(wad2)).div(WAD)

    return result.toString()
}

export const transformToWadPercentage = (rate: string, denominator: string, minimumDecimals: number = 0) => {
    if (denominator === '0') return 'NaN'

    const result = BigNumber.from(rate).mul(10000).div(BigNumber.from(denominator)).toString()

    return toPercentage(Number(result) / 10000, 2, minimumDecimals)
}

export const transformToAnnualRate = (rate: string, decimals: number, minimumDecimals: number = 0) => {
    const exponent = 3600 * 24 * 365
    const base = utils.formatUnits(rate, decimals)
    const result = Number(base) ** exponent - 1

    return toPercentage(result, 2, minimumDecimals)
}

export const transformToEightHourlyRate = (rate: string, decimals: number, minimumDecimals: number = 0) => {
    const exponent = 3600 * 8
    const base = utils.formatUnits(rate, decimals)
    const result = Number(base) ** exponent - 1

    return toPercentage(result, 2, minimumDecimals)
}
