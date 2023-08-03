import numeral from 'numeral'
import { BigNumber, FixedNumber } from 'ethers'
import { utils as gebUtils } from '@hai-on-op/sdk'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { getAddress } from '@ethersproject/address'
import { TokenData } from '@hai-on-op/sdk/lib/contracts/addreses'

import { ETHERSCAN_PREFIXES, floatsTypes, SUPPORTED_WALLETS } from './constants'
import { ChainId, ILiquidationData, ISafe, ITransaction } from './interfaces'
import { injected } from '~/connectors'

export const IS_IN_IFRAME = window.parent !== window

export const returnWalletAddress = (walletAddress: string) => {
    if (!walletAddress) return 'undefined'
    return `${walletAddress.slice(0, 4 + 2)}...${walletAddress.slice(-4)}`
}

export const capitalizeName = (name: string) => name.charAt(0).toUpperCase() + name.slice(1)

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
    const prefix = `https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]}etherscan.io`

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

export const getRatePercentage = (value: string, digits = 4, returnRate = false) => {
    const rate = Number(value)
    let ratePercentage = rate < 1 ? numeral(1).subtract(rate).value() * -1 : numeral(rate).subtract(1).value()

    if (returnRate) return ratePercentage

    return formatNumber(String(ratePercentage * 100), digits)
}

export const toFixedString = (value: string, type?: keyof typeof floatsTypes): string => {
    try {
        const n = Number(value)
        const nOfDecimals = Number.isInteger(n) ? value.length : value.split('.')[1].length

        if (type === 'WAD' || nOfDecimals === floatsTypes.WAD) {
            return FixedNumber.fromString(value, 'fixed256x18').toHexString()
        } else if (type === 'RAY' || (nOfDecimals > floatsTypes.WAD && nOfDecimals <= floatsTypes.RAY)) {
            return FixedNumber.fromString(value, 'fixed256x27').toHexString()
        } else if (type === 'RAD' || (nOfDecimals > floatsTypes.RAY && nOfDecimals <= floatsTypes.RAD)) {
            return FixedNumber.fromString(value, 'fixed256x45').toHexString()
        }
        return FixedNumber.fromString(value, 'fixed256x18').toHexString()
    } catch (error) {
        console.error('toFixedString error:', error)
        return '0'
    }
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
        .filter((s) => s.collateralType in collateralBytes32)
        .map((s) => {
            const token = collateralBytes32[s.collateralType]
            const accumulatedRate = collateralLiquidationData[token]?.accumulatedRate
            const currentPrice = collateralLiquidationData[token]?.currentPrice
            const liquidationCRatio = collateralLiquidationData[token]?.liquidationCRatio
            const safetyCRatio = collateralLiquidationData[token]?.safetyCRatio
            const liquidationPenalty = collateralLiquidationData[token]?.liquidationPenalty
            const totalAnnualizedStabilityFee = collateralLiquidationData[token]?.totalAnnualizedStabilityFee

            const availableDebt = returnAvaiableDebt(currentPrice?.safetyPrice, '0', s.collateral, s.debt)

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
                safeHandler: s.safeHandler,
                date: s.createdAt,
                riskState: ratioChecker(Number(collateralRatio), Number(safetyCRatio)),
                collateral: s.collateral,
                collateralType: s.collateralType,
                collateralName: collateralBytes32[s.collateralType],
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
    const totalCollateralBN = BigNumber.from(toFixedString(totalCollateral, 'WAD'))
    const safetyPriceBN = BigNumber.from(toFixedString(safetyPrice, 'RAY'))
    return totalDebtBN.lte(totalCollateralBN.mul(safetyPriceBN).div(gebUtils.RAY))
}

export const ratioChecker = (currentLiquitdationRatio: number, minLiquidationRatio: number) => {
    const minLiquidationRatioPercent = minLiquidationRatio * 100
    const safestRatio = minLiquidationRatioPercent * 2.2
    const midSafeRatio = minLiquidationRatioPercent * 1.5

    if (currentLiquitdationRatio < minLiquidationRatioPercent && currentLiquitdationRatio > 0) {
        return 4
    } else if (currentLiquitdationRatio >= safestRatio) {
        return 1
    } else if (currentLiquitdationRatio < safestRatio && currentLiquitdationRatio >= midSafeRatio) {
        return 2
    } else if (currentLiquitdationRatio < midSafeRatio && currentLiquitdationRatio > 0) {
        return 3
    } else {
        return 0
    }
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

export const returnAvaiableDebt = (
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
    const owedHAI = collateralBN.mul(safetyPriceRay).mul(accumulatedRateBN).div(gebUtils.RAY).div(gebUtils.RAY)

    if (!beautify) return owedHAI
    return formatNumber(gebUtils.wadToFixed(owedHAI).toString()).toString()
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
            return 'Medium'
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
