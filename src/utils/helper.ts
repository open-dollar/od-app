import numeral from 'numeral'
import { BigNumber, FixedNumber } from 'ethers'
import { utils as gebUtils } from 'geb.js'
import { AbstractConnector } from '@web3-react/abstract-connector'
import {
    ETHERSCAN_PREFIXES,
    floatsTypes,
    SUPPORTED_WALLETS,
    COIN_TICKER,
} from './constants'
import {
    ChainId,
    ILiquidationData,
    ISafe,
    ISafeHistory,
    ITransaction,
} from './interfaces'
import { injected, NETWORK_ID } from '../connectors'
import { getAddress } from '@ethersproject/address'

export const IS_IN_IFRAME = window.parent !== window

export const returnWalletAddress = (walletAddress: string) =>
    `${walletAddress.slice(0, 4 + 2)}...${walletAddress.slice(-4)}`

export const capitalizeName = (name: string) =>
    name.charAt(0).toUpperCase() + name.slice(1)

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
    const prefix = `https://${
        ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]
    }etherscan.io`

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

export const formatNumber = (value: string, digits = 4, round = false) => {
    const nOfDigits = Array.from(Array(digits), (_) => 0).join('')
    if (!value) {
        return '0'
    }
    const n = Number(value)
    if (n < 0) return value
    if (Number.isInteger(n) || value.length < 5) {
        return n
    }
    let val
    if (round) {
        val = numeral(n).format(`0.${nOfDigits}`)
    } else {
        val = numeral(n).format(`0.${nOfDigits}`, Math.floor)
    }

    return isNaN(Number(val)) ? value : val
}

export const getRatePercentage = (
    value: string,
    digits = 4,
    returnRate = false
) => {
    const rate = Number(value)
    let ratePercentage =
        rate < 1
            ? numeral(1).subtract(rate).value() * -1
            : numeral(rate).subtract(1).value()

    if (returnRate) return ratePercentage

    return formatNumber(String(ratePercentage * 100), digits)
}

export const toFixedString = (
    value: string,
    type?: keyof typeof floatsTypes
): string => {
    const n = Number(value)
    const nOfDecimals = Number.isInteger(n)
        ? value.length
        : value.split('.')[1].length

    if (type === 'WAD' || nOfDecimals === floatsTypes.WAD) {
        return FixedNumber.fromString(value, 'fixed256x18').toHexString()
    } else if (
        type === 'RAY' ||
        (nOfDecimals > floatsTypes.WAD && nOfDecimals <= floatsTypes.RAY)
    ) {
        return FixedNumber.fromString(value, 'fixed256x27').toHexString()
    } else if (
        type === 'RAD' ||
        (nOfDecimals > floatsTypes.RAY && nOfDecimals <= floatsTypes.RAD)
    ) {
        return FixedNumber.fromString(value, 'fixed256x45').toHexString()
    }
    return FixedNumber.fromString(value, 'fixed256x18').toHexString()
}

export const formatUserSafe = (
    safes: Array<any>,
    liquidationData: ILiquidationData
): Array<ISafe> => {
    const {
        currentRedemptionPrice,
        currentPrice,
        liquidationCRatio,
        accumulatedRate,
        totalAnnualizedStabilityFee,
        liquidationPenalty,
        currentRedemptionRate,
    } = liquidationData

    return safes
        .map((s) => {
            const availableDebt = returnAvaiableDebt(
                currentPrice?.safetyPrice,
                '0',
                s.collateral,
                s.debt
            )

            const totalDebt = returnTotalValue(
                returnTotalDebt(s.debt, accumulatedRate) as string,
                '0'
            ).toString()

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
                riskState: ratioChecker(Number(collateralRatio)),
                collateral: s.collateral,
                debt: s.debt,
                totalDebt,
                availableDebt,
                accumulatedRate,
                collateralRatio,
                currentRedemptionPrice,
                internalCollateralBalance:
                    s.internalCollateralBalance?.balance || '0',
                currentLiquidationPrice: currentPrice?.liquidationPrice,
                liquidationCRatio: liquidationCRatio || '1',
                liquidationPenalty: liquidationPenalty || '1',
                liquidationPrice,
                totalAnnualizedStabilityFee: totalAnnualizedStabilityFee || '0',
                currentRedemptionRate: currentRedemptionRate || '0',
            } as ISafe
        })
        .sort(
            (a, b) =>
                Number(a.collateral) - Number(b.collateral) &&
                Number(b.riskState) - Number(a.riskState)
        )
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

    const numerator = numeral(totalCollateral)
        .multiply(liquidationPrice)
        .multiply(liquidationCRatio)

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

    return formatNumber(numerator.value().toString(), 2)
}

export const safeIsSafe = (
    totalCollateral: string,
    totalDebt: string,
    safetyPrice: string
): Boolean => {
    if (isNaN(Number(totalDebt))) return true
    const totalDebtBN = BigNumber.from(toFixedString(totalDebt, 'WAD'))
    const totalCollateralBN = BigNumber.from(
        toFixedString(totalCollateral, 'WAD')
    )
    const safetyPriceBN = BigNumber.from(toFixedString(safetyPrice, 'RAY'))
    return totalDebtBN.lte(
        totalCollateralBN.mul(safetyPriceBN).div(gebUtils.RAY)
    )
}

export const ratioChecker = (liquitdationRatio: number) => {
    if (liquitdationRatio >= 300) {
        return 1
    } else if (liquitdationRatio < 300 && liquitdationRatio >= 200) {
        return 2
    } else if (liquitdationRatio < 200 && liquitdationRatio > 0) {
        return 3
    } else {
        return 0
    }
}

export const getInterestOwed = (debt: string, accumulatedRate: string) => {
    const restAcc = numeral(accumulatedRate).subtract(1).value()
    return formatNumber(
        numeral(debt).multiply(restAcc).value().toString(),
        4,
        true
    )
}

export const returnTotalValue = (
    first: string,
    second: string,
    beautify = true,
    isRepay = false,
    type: keyof typeof floatsTypes = 'WAD'
) => {
    const firstBN = first
        ? BigNumber.from(toFixedString(Number(first).toString(), type))
        : BigNumber.from('0')
    const secondBN = second
        ? BigNumber.from(toFixedString(second, type))
        : BigNumber.from('0')

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

    const safetyPriceRay = BigNumber.from(
        BigNumber.from(toFixedString(safetyPrice, 'RAY'))
    )
    const accumulatedRateRay = BigNumber.from(
        BigNumber.from(toFixedString(accumulatedRate, 'RAY'))
    )
    const totalCollateralBN = returnTotalValue(
        currentCollatral,
        prevCollatral,
        false
    ) as BigNumber

    const totalDebtBN = totalCollateralBN.mul(safetyPriceRay).div(gebUtils.RAY)
    const prevDebtBN = BigNumber.from(toFixedString(prevDebt, 'WAD'))
    const totalPrevDebt = prevDebtBN.mul(accumulatedRateRay).div(gebUtils.RAY)
    const availableDebt = totalDebtBN.sub(totalPrevDebt)
    return formatNumber(
        gebUtils.wadToFixed(availableDebt).toString()
    ).toString()
}

export const returnTotalDebt = (
    debt: string,
    accumulatedRate: string,
    beautify = true
) => {
    const debtBN = BigNumber.from(toFixedString(debt, 'WAD'))
    const accumulatedRateBN = BigNumber.from(
        toFixedString(accumulatedRate, 'RAY')
    )

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
    const safetyPriceRay = BigNumber.from(
        BigNumber.from(toFixedString(safetyPrice, 'RAY'))
    )
    const collateralBN = BigNumber.from(toFixedString(collateral, 'WAD'))
    const accumulatedRateBN = BigNumber.from(
        toFixedString(accumulatedRate, 'RAY')
    )
    const owedRAI = collateralBN
        .mul(safetyPriceRay)
        .mul(accumulatedRateBN)
        .div(gebUtils.RAY)
        .div(gebUtils.RAY)

    if (!beautify) return owedRAI
    return formatNumber(gebUtils.wadToFixed(owedRAI).toString()).toString()
}

export const formatHistoryArray = (
    history: Array<any>,
    liquidationItems: Array<any>
): Array<ISafeHistory> => {
    const items: Array<ISafeHistory> = []
    const networkId = NETWORK_ID

    history = history.sort((a, b) => Number(a.createdAt) - Number(b.createdAt))

    if (history.length > 0) {
        items.push({
            title: 'Open Safe',
            txHash: history[0].createdAtTransaction,
            date: Number(history[0].createdAt - 1).toString(),
            amount: 0,
            link: getEtherscanLink(
                networkId,
                history[0].createdAtTransaction,
                'transaction'
            ),
            icon: 'ArrowRightCircle',
            color: '',
        })
    }

    for (let i of liquidationItems) {
        items.push({
            title: 'Liquidated Safe',
            date: i.createdAt,
            amount: parseFloat(i.sellInitialAmount) - parseFloat(i.sellAmount),
            link: getEtherscanLink(
                networkId,
                i.createdAtTransaction,
                'transaction'
            ),
            txHash: i.createdAtTransaction,
            icon: 'XCircle',
            color: 'red',
        })
    }

    for (let item of history) {
        const deltaDebt = numeral(item.deltaDebt).value()
        const deltaCollateral = numeral(item.deltaCollateral).value()

        const sharedObj = {
            date: item.createdAt,
            txHash: item.createdAtTransaction,
            link: getEtherscanLink(
                networkId,
                item.createdAtTransaction,
                'transaction'
            ),
        }
        if (deltaDebt > 0) {
            items.push({
                ...sharedObj,
                title: `Borrowed ${COIN_TICKER}`,
                amount: numeral(deltaDebt)
                    .multiply(item.accumulatedRate)
                    .value(),
                icon: 'ArrowUpCircle',
                color: 'green',
            })
        }
        if (deltaDebt < 0) {
            items.push({
                ...sharedObj,
                title: `Repaid ${COIN_TICKER}`,
                amount: numeral(deltaDebt)
                    .multiply(-1)
                    .multiply(item.accumulatedRate)
                    .value(),
                icon: 'ArrowDownCircle',
                color: 'green',
            })
        }
        if (deltaCollateral > 0) {
            items.push({
                ...sharedObj,
                title: 'Deposited ETH',
                amount: deltaCollateral,
                icon: 'ArrowDownCircle',
                color: 'gray',
            })
        }
        if (deltaCollateral < 0) {
            items.push({
                ...sharedObj,
                title: 'Withdrew ETH',
                amount: -1 * deltaCollateral,
                icon: 'ArrowUpCircle',
                color: 'gray',
            })
        }
    }
    return items.sort((a, b) => Number(b.date) - Number(a.date))
}

export const newTransactionsFirst = (a: ITransaction, b: ITransaction) => {
    return b.addedTime - a.addedTime
}

export const timeout = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export const returnPercentAmount = (
    partialValue: string,
    totalValue: string
) => {
    return numeral(partialValue).divide(totalValue).multiply(100).value()
}

export const returnConnectorName = (
    connector: AbstractConnector | undefined
) => {
    if (!connector || typeof connector === undefined) return null

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
            res[key][temp] = !isNaN(obj[key][temp])
                ? numeral(obj[key][temp]).value()
                : obj[key][temp]
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
        default:
            return ''
    }
}

export const returnFiatValue = (value: string, price: number) => {
    if (!value || !price) return '0.00'
    return formatNumber(numeral(value).multiply(price).value().toString(), 2)
}
