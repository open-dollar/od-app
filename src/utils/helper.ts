import numeral from 'numeral'
import { BigNumber, FixedNumber } from 'ethers'
import { utils as gebUtils } from '@opendollar/sdk'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { getAddress } from '@ethersproject/address'
import { TokenData } from '@opendollar/sdk/lib/contracts/addreses'

import { floatsTypes, SUPPORTED_WALLETS } from './constants'
import { ChainId, ILiquidationData, ISafe, ITransaction } from './interfaces'
import { injected } from '~/connectors'

export const IS_IN_IFRAME = window.parent !== window

export const returnWalletAddress = (walletAddress: string, startingIndex: number = 0) => {
    if (!walletAddress) return 'undefined'
    return `${walletAddress.slice(startingIndex, 4 + 2)}...${walletAddress.slice(-4)}`
}

export const capitalizeName = (name: string) => name?.charAt(0).toUpperCase() + name?.slice(1)

export const isAddress = (value: any): string | false => {
    try {
        return getAddress(value)
    } catch {
        return false
    }
}
export const getEtherscanLink = (
    chainId: ChainId,
    data: string,
    type: 'transaction' | 'token' | 'address' | 'block'
): string => {
    let blockExplorerPrefix
    // No special prefix for Arbitrum One's block explorer. Otherwise, use Arbitrum Sepolia's block explorer
    if (chainId.toString() === '42161') {
        blockExplorerPrefix = ''
    } else {
        blockExplorerPrefix = 'sepolia.'
    }
    const prefix = `https://${blockExplorerPrefix}arbiscan.io`

    switch (type) {
        case 'transaction': {
            return `${prefix}/tx/${data}`
        }
        case 'token': {
            return `${prefix}/token/${data}`
        }
        case 'block': {
            return `${prefix}/block/${data}`
        }
        case 'address':
        default: {
            return `${prefix}/address/${data}`
        }
    }
}

export const amountToFiat = (balance: number, fiatPrice: number) => {
    return (balance * fiatPrice).toFixed(4)
}

export const formatNumber = (value: string, digits = 6, round = false) => {
    if (!value) {
        return '0'
    }

    const n = Number(value)
    if (Number.isInteger(n) || value.length < 5) {
        return n
    }

    const nOfWholeDigits = value.split('.')[0].length
    const nOfDigits = nOfWholeDigits > digits - 1 ? '00' : Array.from(Array(digits - nOfWholeDigits), (_) => 0).join('')
    let val
    if (round) {
        val = numeral(n).format(`0.${nOfDigits}`)
    } else {
        val = numeral(n).format(`0.${nOfDigits}`, Math.floor)
    }

    return isNaN(Number(val)) ? value : val
}

export const formatWithCommas = (value: string | number, digits = 8, minDecimals = 0) => {
    let val = Number(value)

    if (isNaN(val) || val < 0.00000001) {
        return String(value)
    }

    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: minDecimals,
        maximumFractionDigits: digits,
    }).format(Number(value))
}

export const getRatePercentage = (value: string, digits = 4, returnRate = false) => {
    const rate = Number(value)
    let ratePercentage = rate < 1 ? numeral(1).subtract(rate).value() * -1 : numeral(rate).subtract(1).value()

    if (returnRate) return ratePercentage

    return formatNumber(String(ratePercentage * 100), digits)
}

export const toFixedString = (value: string, type: keyof typeof floatsTypes = 'WAD'): string => {
    try {
        let scale
        switch (type) {
            case 'WAD':
                scale = 'fixed256x18'
                break
            case 'RAY':
                scale = 'fixed256x27'
                break
            case 'RAD':
                scale = 'fixed256x45'
                break
            default:
                scale = 'fixed256x18'
        }
        return FixedNumber.fromString(value, scale).toHexString()
    } catch (error) {
        console.debug('toFixedString error:', error)
        return '0'
    }
}

export const getBytes32String = (collateralType: string, tokensData: { [key: string]: TokenData }): string | null => {
    const token = Object.values(tokensData).find(
        (token) => token.symbol === collateralType || token.bytes32String === collateralType
    )
    return token ? token.bytes32String : null
}

export const formatUserSafe = (
    safes: Array<any>,
    liquidationData: ILiquidationData,
    tokensData: { [key: string]: TokenData }
): Array<ISafe> => {
    const collateralBytes32: { [key: string]: string } = Object.values(tokensData)
        .filter((token) => token.isCollateral)
        .reduce((accum, token) => {
            return { ...accum, [token.bytes32String]: token.symbol }
        }, {})

    const { currentRedemptionPrice, currentRedemptionRate, collateralLiquidationData } = liquidationData

    return safes
        .map((s) => {
            const bytes32String = getBytes32String(s.collateralType, tokensData)
            if (!bytes32String || !(bytes32String in collateralBytes32)) return null

            const token = collateralBytes32[bytes32String]
            const accumulatedRate = collateralLiquidationData[token]?.accumulatedRate
            const currentPrice = collateralLiquidationData[token]?.currentPrice
            const availableDebt = returnAvailableDebt(currentPrice?.safetyPrice, '0', s.collateral, s.debt)
            const liquidationCRatio = collateralLiquidationData[token]?.liquidationCRatio
            const safetyCRatio = collateralLiquidationData[token]?.safetyCRatio
            const liquidationPenalty = collateralLiquidationData[token]?.liquidationPenalty
            const totalAnnualizedStabilityFee = collateralLiquidationData[token]?.totalAnnualizedStabilityFee

            const totalDebt = returnTotalValue(returnTotalDebt(s.debt, accumulatedRate) as string, '0').toString()

            const liquidationPrice = getLiquidationPrice(
                s.collateral,
                totalDebt as string,
                liquidationCRatio,
                currentRedemptionPrice
            )

            const collateralRatio = getCollateralRatio(
                s.collateral,
                totalDebt as string,
                currentPrice?.liquidationPrice,
                liquidationCRatio
            )

            return {
                id: s.safeId,
                ownerAddress: s.ownerAddress,
                safeHandler: s.safeHandler,
                date: s.createdAt,
                riskState: ratioChecker(Number(collateralRatio), Number(liquidationCRatio), Number(safetyCRatio)),
                collateral: s.collateral,
                collateralType: s.collateralType,
                collateralName: collateralBytes32[bytes32String],
                debt: s.debt,
                totalDebt,
                availableDebt,
                accumulatedRate,
                collateralRatio,
                currentRedemptionPrice,
                internalCollateralBalance: s.internalCollateralBalance?.balance || '0',
                currentLiquidationPrice: currentPrice?.liquidationPrice,
                liquidationCRatio: liquidationCRatio || '1',
                liquidationPenalty: liquidationPenalty || '1',
                liquidationPrice,
                totalAnnualizedStabilityFee: totalAnnualizedStabilityFee || '0',
                currentRedemptionRate: currentRedemptionRate || '0',
            } as ISafe
        })
        .filter((s): s is ISafe => s !== null)
        .sort((a, b) => Number(b.riskState) - Number(a.riskState) || Number(b.debt) - Number(a.debt))
}

export const getCollateralRatio = (
    totalCollateral: string,
    totalDebt: string,
    liquidationPrice: string,
    liquidationCRatio: string
) => {
    if (Number(totalCollateral) === 0) {
        return '0'
    } else if (Number(totalDebt) === 0) {
        return '∞'
    }
    const denominator = numeral(totalDebt).value()

    const numerator = numeral(totalCollateral).multiply(liquidationPrice).multiply(liquidationCRatio)

    const value = numerator.divide(denominator).multiply(100)

    return formatNumber(value.value().toString(), 2, true)
}

export const getLiquidationPrice = (
    totalCollateral: string,
    totalDebt: string,
    liquidationCRatio: string,
    currentRedemptionPrice: string
) => {
    if (Number(totalCollateral) === 0) {
        return '0'
    } else if (Number(totalDebt) === 0) {
        return '0'
    }

    const numerator = numeral(totalDebt)
        .multiply(liquidationCRatio)
        .multiply(currentRedemptionPrice)
        .divide(totalCollateral)

    return formatNumber(numerator.value().toString())
}

export const safeIsSafe = (totalCollateral: string, totalDebt: string, safetyPrice: string): Boolean => {
    if (isNaN(Number(totalDebt))) return true
    const totalDebtBN = BigNumber.from(toFixedString(totalDebt, 'WAD'))
    // We cannot withdraw more than the total collateral
    if (Number(totalCollateral) < 0) return false
    const totalCollateralBN = BigNumber.from(toFixedString(totalCollateral, 'WAD'))
    const safetyPriceBN = BigNumber.from(toFixedString(safetyPrice, 'RAY'))
    return totalDebtBN.lte(totalCollateralBN.mul(safetyPriceBN).div(gebUtils.RAY))
}

/**
 * Removes commas from a formatted number
 * @param value
 */
export const parseFormattedNumber = (value: string): number => {
    return parseFloat(value.replace(/,/g, ''))
}

/**
 * Calculate the risk status text given a numeric risk status
 * @param riskStatusNumeric
 */
export const calculateRiskStatusText = (riskStatusNumeric: Number) => {
    switch (riskStatusNumeric) {
        case 0:
            return 'NO'
        case 1:
            return 'LOW'
        case 2:
            return 'ELEVATED'
        case 3:
            return 'HIGH'
        case 4:
            return 'LIQUIDATION'
        default:
            return 'LOW'
    }
}

/**
 * Check the risk state of the current liquidation ratio given a fixed minLiquidationRatio
 * @param currentLiquidationRatio
 * @param liqRatio
 * @param safetyRatio
 */
export const ratioChecker = (currentLiquidationRatio: number, liqRatio: number, safetyRatio: number) => {
    if (currentLiquidationRatio == null || Number.isNaN(currentLiquidationRatio) || !liqRatio || !safetyRatio) {
        console.debug('Error calculating risk state')
        return 1
    }
    const currentLiquidationRatioAsDecimal = currentLiquidationRatio / 100

    if (currentLiquidationRatioAsDecimal === 0) return 0
    if (currentLiquidationRatioAsDecimal === liqRatio) return 3
    if (currentLiquidationRatioAsDecimal < liqRatio) return 4
    if (currentLiquidationRatioAsDecimal > liqRatio && currentLiquidationRatioAsDecimal <= safetyRatio) return 3
    if (currentLiquidationRatioAsDecimal > safetyRatio && currentLiquidationRatioAsDecimal <= safetyRatio * 1.2)
        return 2
    return 1
}

export const getInterestOwed = (debt: string, accumulatedRate: string) => {
    const restAcc = numeral(accumulatedRate).subtract(1).value()
    return formatNumber(numeral(debt).multiply(restAcc).value().toString(), 4, true)
}

export const returnTotalValue = (
    first: string,
    second: string,
    beautify = true,
    isRepay = false,
    type: keyof typeof floatsTypes = 'WAD'
) => {
    const firstBN = first ? BigNumber.from(toFixedString(Number(first).toString(), type)) : BigNumber.from('0')
    const secondBN = second ? BigNumber.from(toFixedString(second, type)) : BigNumber.from('0')

    const totalBN = isRepay ? firstBN.sub(secondBN) : firstBN.add(secondBN)

    if (!beautify) return totalBN
    return formatNumber(gebUtils.wadToFixed(totalBN).toString()).toString()
}

export const returnAvailableDebt = (
    safetyPrice: string,
    accumulatedRate: string,
    currentCollatral = '0',
    prevCollatral = '0',
    prevDebt = '0'
) => {
    if (!safetyPrice || accumulatedRate === '0') {
        return '0'
    }

    const safetyPriceRay = BigNumber.from(BigNumber.from(toFixedString(safetyPrice, 'RAY')))
    const accumulatedRateRay = BigNumber.from(BigNumber.from(toFixedString(accumulatedRate, 'RAY')))
    const totalCollateralBN = returnTotalValue(currentCollatral, prevCollatral, false) as BigNumber

    const totalDebtBN = totalCollateralBN.mul(safetyPriceRay).div(gebUtils.RAY)
    const prevDebtBN = BigNumber.from(toFixedString(prevDebt, 'WAD'))
    const totalPrevDebt = prevDebtBN.mul(accumulatedRateRay).div(gebUtils.RAY)
    const availableDebt = totalDebtBN.sub(totalPrevDebt)
    return formatNumber(
        gebUtils.wadToFixed(availableDebt.lt(0) ? BigNumber.from('0') : availableDebt).toString()
    ).toString()
}

export const returnTotalDebt = (debt: string, accumulatedRate: string, beautify = true) => {
    const debtBN = BigNumber.from(toFixedString(debt, 'WAD'))
    const accumulatedRateBN = BigNumber.from(toFixedString(accumulatedRate, 'RAY'))

    const totalDebtBN = debtBN.mul(accumulatedRateBN).div(gebUtils.RAY)

    if (!beautify) return totalDebtBN
    return gebUtils.wadToFixed(totalDebtBN).toString()
}

/**
 * Returns the available debt with a 0.1% buffer to avoid exceeding the safety ratio
 * @param safetyPrice
 * @param accumulatedRate
 * @param currentCollatral
 * @param prevCollatral
 * @param prevDebt
 */
export const returnAvailableDebtWithBuffer = (
    safetyPrice: string,
    accumulatedRate: string,
    currentCollatral = '0',
    prevCollatral = '0',
    prevDebt = '0'
) => {
    const availableDebt = returnAvailableDebt(safetyPrice, accumulatedRate, currentCollatral, prevCollatral, prevDebt)
    const availableDebtBN = BigNumber.from(toFixedString(availableDebt, 'WAD'))
    const availableDebtWithBufferBN = availableDebtBN.mul(999).div(1000)
    return formatNumber(gebUtils.wadToFixed(availableDebtWithBufferBN).toString()).toString()
}

export const returnTotalDebtPlusInterest = (
    safetyPrice: string,
    collateral: string,
    accumulatedRate: string,
    beautify = true
) => {
    if (!safetyPrice || !collateral || !accumulatedRate) {
        return '0'
    }
    const safetyPriceRay = BigNumber.from(BigNumber.from(toFixedString(safetyPrice, 'RAY')))
    const collateralBN = BigNumber.from(toFixedString(collateral, 'WAD'))
    const accumulatedRateBN = BigNumber.from(toFixedString(accumulatedRate, 'RAY'))
    const owedOD = collateralBN.mul(safetyPriceRay).mul(accumulatedRateBN).div(gebUtils.RAY).div(gebUtils.RAY)

    if (!beautify) return owedOD
    return formatNumber(gebUtils.wadToFixed(owedOD).toString()).toString()
}

export const newTransactionsFirst = (a: ITransaction, b: ITransaction) => {
    return b.addedTime - a.addedTime
}

export const timeout = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export const returnPercentAmount = (partialValue: string, totalValue: string) => {
    return numeral(partialValue).divide(totalValue).multiply(100).value()
}

export const returnConnectorName = (connector: AbstractConnector | undefined) => {
    if (!connector || typeof connector === 'undefined') return null

    const isMetamask = window?.ethereum?.isMetaMask
    return Object.keys(SUPPORTED_WALLETS)
        .map((key) => {
            const option = SUPPORTED_WALLETS[key]
            if (option.connector === connector) {
                if (option.connector === injected) {
                    if (isMetamask && option.name !== 'MetaMask') {
                        return null
                    }
                    if (!isMetamask && option.name === 'MetaMask') {
                        return null
                    }
                }
                return option.name !== 'Injected' ? option.name : null
            }
            return null
        })
        .filter((x: string | null) => x !== null)[0]
}

export const numberizeString = (obj: any) => {
    const res: any = {}
    Object.keys(obj).forEach((key) => {
        res[key] = {}
        Object.keys(obj[key]).forEach((temp) => {
            res[key][temp] = !isNaN(obj[key][temp]) ? numeral(obj[key][temp]).value() : obj[key][temp]
        })
        return res
    })

    return res
}

export const returnTimeOffset = () => {
    const a = new Date().getTimezoneOffset()
    const res = -Math.round(a / 60)
    return res < 0 ? res : '+' + res
}

export const returnState = (state: number) => {
    switch (state) {
        case 1:
            return 'Low'
        case 2:
            return 'Elevated'
        case 3:
            return 'High'
        case 4:
            return 'Liquidation'
        default:
            return ''
    }
}

export const returnFiatValue = (value: string, price: number) => {
    if (!value || !price) return '0.00'
    return formatNumber(numeral(value).multiply(price).value().toString(), 2)
}

export const shortStringDate = (date: string | number | Date): string => {
    const d = new Date(date)

    const unPaddedDay = d.getDate()
    const unPaddedMonth = d.getMonth() + 1

    const day = unPaddedDay < 10 ? `0${unPaddedDay}` : unPaddedDay
    const month = unPaddedMonth < 10 ? `0${unPaddedMonth}` : unPaddedMonth

    return `${day}.${month}.${d.getFullYear()}`
}

export const isEmptyObject = <T extends {}>(obj: T) => {
    if (obj === null || obj === undefined) return true
    return Object.keys(obj).length === 0
}
