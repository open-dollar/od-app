import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { BigNumber, ethers } from 'ethers'
import numeral from 'numeral'

import { useActiveWeb3React, useProxyAddress } from '~/hooks'
import { useStoreActions, useStoreState } from '~/store'
import { DEFAULT_SAFE_STATE } from '~/utils/constants'
import {
    formatNumber,
    getCollateralRatio,
    getLiquidationPrice,
    getRatePercentage,
    returnAvaiableDebt,
    returnPercentAmount,
    returnTotalDebt,
    returnTotalValue,
    safeIsSafe,
    toFixedString,
} from '~/utils/helper'

export const LIQUIDATION_RATIO = 135 // percent
export const ONE_DAY_WORTH_SF = ethers.utils.parseEther('0.00001')
export type SafeTypes = 'deposit_borrow' | 'repay_withdraw' | 'create' | 'info'
export type StatsType = 'data' | 'prices' | 'info'
export type Stats = {
    [K in StatsType]: Array<{
        label: string
        value: string | number
        tip?: string
        plainValue?: string | number
    }>
}

// returns safe model state from store
export function useSafeState() {
    const { safeModel: safeState } = useStoreState((state) => state)
    return useMemo(() => safeState, [safeState])
}

// returns all safe info from amounts, debt, collateral and other helper attributes
export function useSafeInfo(type: SafeTypes = 'create') {
    const { account } = useActiveWeb3React()
    const proxyAddress = useProxyAddress()
    const { t } = useTranslation()
    const {
        safeModel: { safeData, singleSafe, liquidationData },
        connectWalletModel: { tokensFetchedData },
    } = useStoreState((state) => state)

    // parsed amounts of deposit/repay withdraw/borrow as in left input and right input, they get switched based on if its Deposit & Borrow or Repay & Withdraw
    const parsedAmounts = useMemo(() => {
        const { leftInput, rightInput } = safeData
        return { leftInput, rightInput }
    }, [safeData])

    const { leftInput, rightInput } = parsedAmounts

    const balances = useMemo(() => {
        return {
            weth: tokensFetchedData.WETH?.balanceE18,
            hai: tokensFetchedData.HAI?.balanceE18,
        }
    }, [tokensFetchedData])

    const { hai: haiBalance } = balances

    // returns collateral amount and takes into consideration if its a new safe or not
    const collateral = useTotalCollateral(leftInput, type)
    // returns debt amount and takes into consideration if its a new safe or not
    const debt = useTotalDebt(rightInput, type)

    const totalCollateral = useMemo(() => collateral, [collateral])
    const totalDebt = useMemo(() => debt, [debt])
    const collateralName = safeData.collateral ? safeData.collateral : singleSafe!.collateralName

    const collateralLiquidationData = liquidationData!.collateralLiquidationData[collateralName]
    const safetyPrice = collateralLiquidationData.currentPrice.safetyPrice

    // Checks if for collateralRatio safety if its safe or not
    const isSafe = safeIsSafe(totalCollateral, totalDebt, safetyPrice)

    const fetchedLiquidationPrice = collateralLiquidationData.currentPrice.liquidationPrice
    const liquidationCRatio = collateralLiquidationData.liquidationCRatio
    const currentRedemptionPrice = liquidationData!.currentRedemptionPrice

    // returns collateral ratio
    const collateralRatio = useCollateralRatio(totalCollateral, totalDebt, fetchedLiquidationPrice, liquidationCRatio)
    // returns liquidation price
    const liquidationPrice = useLiquidationPrice(totalCollateral, totalDebt, currentRedemptionPrice, liquidationCRatio)

    // returns available ETH (collateral)
    // singleSafe means already a deployed safe
    const availableCollateral = useMemo(() => {
        if (singleSafe) {
            if (type === 'deposit_borrow' && singleSafe.collateralName !== '') {
                const value = ethers.utils.formatEther(tokensFetchedData[singleSafe.collateralName].balanceE18)
                return formatNumber(value, 2)
            } else {
                return singleSafe.collateral
            }
        }
        return '0.00'
    }, [singleSafe, tokensFetchedData, type])

    // returns available HAI (debt)
    // singleSafe means already a deployed safe
    const availableHai = useMemo(() => {
        if (!collateralLiquidationData) return '0.00'
        if (type === 'create') {
            return returnAvaiableDebt(
                collateralLiquidationData.currentPrice.safetyPrice,
                collateralLiquidationData.accumulatedRate,
                leftInput
            )
        } else if (type === 'deposit_borrow') {
            if (singleSafe) {
                return returnAvaiableDebt(
                    collateralLiquidationData.currentPrice.safetyPrice,
                    collateralLiquidationData.accumulatedRate,
                    leftInput,
                    singleSafe.collateral,
                    singleSafe.debt
                )
            }
        } else {
            if (singleSafe) {
                return returnTotalDebt(singleSafe.debt, collateralLiquidationData.accumulatedRate) as string
            }
        }
        return '0.00'
    }, [collateralLiquidationData, leftInput, singleSafe, type])

    const liquidationPenaltyPercentage = '18-20'

    const stabilityFeePercentage = useMemo(() => {
        return collateralLiquidationData
            ? getRatePercentage(collateralLiquidationData.totalAnnualizedStabilityFee, 2)
            : '-'
    }, [collateralLiquidationData])

    const availableCollateralBN = BigNumber.from(toFixedString(availableCollateral.toString(), 'WAD'))
    const availableHaiBN = BigNumber.from(toFixedString(availableHai.toString(), 'WAD'))
    // account's HAI balance into BigNumber
    const haiBalanceBN = haiBalance ? BigNumber.from(toFixedString(haiBalance.toString(), 'WAD')) : BigNumber.from('0')

    const leftInputBN = leftInput ? BigNumber.from(toFixedString(leftInput, 'WAD')) : BigNumber.from('0')

    const rightInputBN = rightInput ? BigNumber.from(toFixedString(rightInput, 'WAD')) : BigNumber.from('0')
    // returns debtFloor from liquidation data from store
    const debtFloorBN = BigNumber.from(
        toFixedString(collateralLiquidationData ? collateralLiquidationData.debtFloor : '0', 'WAD')
    )
    const totalDebtBN = BigNumber.from(toFixedString(totalDebt, 'WAD'))

    // returns stats data used into stats display of the safe
    const stats: Stats = useMemo(() => {
        return {
            data: [
                {
                    label: `Total ${collateralName} Collateral`,
                    value: totalCollateral === '0' ? '-' : totalCollateral,
                    plainValue: totalCollateral,
                },
                {
                    label: 'Total HAI Debt',
                    value: totalDebt === '0' ? '-' : totalDebt,
                    plainValue: totalDebt,
                },
                {
                    label: 'Collateral Ratio',
                    value: (Number(collateralRatio) > 0 ? collateralRatio : '∞') + '%',
                    plainValue: collateralRatio,
                },
                {
                    label: 'Collateral Type',
                    value: collateralName,
                },
            ],
            prices: [
                {
                    label: `${collateralName} Price (Delayed)`,
                    value: '$' + formatNumber(collateralLiquidationData!.currentPrice.value.toString()),
                    tip: t('eth_osm_tip'),
                },
                {
                    label: 'HAI Redemption Price',
                    value: '$' + formatNumber(liquidationData!.currentRedemptionPrice, 3),
                    tip: t('redemption_price_tip'),
                },
                {
                    label: 'Liquidation Price',
                    value:
                        Number(liquidationPrice) > 0
                            ? (liquidationPrice as number) > Number(collateralLiquidationData!.currentPrice.value)
                                ? 'Invalid'
                                : '$' + liquidationPrice
                            : '$' + 0,
                    tip: t('liquidation_price_tip'),
                },
            ],
            info: [
                {
                    label: 'Total Liquidation Penalty',
                    value: liquidationPenaltyPercentage + '%',
                    tip: t('liquidation_penalty_tip'),
                },
                {
                    label: 'Stability Fee',
                    value: stabilityFeePercentage + '%',
                    tip: t('stability_fee_tip'),
                },
            ],
        }
    }, [
        collateralLiquidationData,
        collateralName,
        collateralRatio,
        liquidationData,
        liquidationPrice,
        stabilityFeePercentage,
        t,
        totalCollateral,
        totalDebt,
    ])

    let error: string | undefined

    if (!account) {
        error = 'Connect Wallet'
    }

    if (!proxyAddress) {
        error = error ?? 'Create a Reflexer Account to continue'
    }

    if (type === 'deposit_borrow') {
        if (leftInputBN.gt(availableCollateralBN)) {
            error = error ?? 'Insufficient balance'
        }
        if (rightInputBN.gt(availableHaiBN)) {
            error = error ?? `HAI borrowed cannot exceed available amount`
        }
        if (leftInputBN.isZero() && rightInputBN.isZero()) {
            error =
                error ?? `Please enter the amount of ${collateralName} to be deposited or amount of HAI to be borrowed`
        }
    }

    if (type === 'repay_withdraw') {
        if (leftInputBN.isZero() && rightInputBN.isZero()) {
            error = error ?? `Please enter the amount of ${collateralName} to free or the amount of HAI to repay`
        }
        if (leftInputBN.gt(availableCollateralBN)) {
            error = error ?? `${collateralName} to unlock cannot exceed available amount`
        }

        if (rightInputBN.gt(availableHaiBN)) {
            error = error ?? `HAI to repay cannot exceed owed amount`
        }

        if (!rightInputBN.isZero()) {
            const repayPercent = returnPercentAmount(rightInput, availableHai as string)

            if (rightInputBN.add(ONE_DAY_WORTH_SF).lt(BigNumber.from(availableHaiBN)) && repayPercent > 95) {
                error = error ?? `You can only repay a minimum of ${availableHai} HAI to avoid leaving residual values`
            }
        }

        if (!rightInputBN.isZero() && rightInputBN.gt(haiBalanceBN)) {
            error = error ?? `balance_issue`
        }
    }

    if (!totalDebtBN.isZero() && totalDebtBN.lt(debtFloorBN)) {
        error =
            error ??
            `The resulting debt should be at least ${Math.ceil(
                Number(formatNumber(collateralLiquidationData.debtFloor))
            )} HAI or zero`
    }

    if (!isSafe && (collateralRatio as number) >= 0) {
        error =
            error ??
            `Too much debt, below ${Number(collateralLiquidationData.safetyCRatio) * 100}% collateralization ratio`
    }

    if (numeral(totalDebt).value() > numeral(liquidationData!.globalDebtCeiling).value()) {
        error = error ?? 'Cannot exceed global debt ceiling'
    }

    if (numeral(totalDebt).value() > numeral(liquidationData!.perSafeDebtCeiling).value()) {
        error = error ?? `Cannot exceed HAI debt ceiling`
    }

    if (type === 'create') {
        if (leftInputBN.isZero()) {
            error = error ?? `Enter ${collateralName} Amount`
        }
    }

    if (type !== 'create') {
        const perSafeDebtCeilingBN = BigNumber.from(toFixedString(liquidationData!.perSafeDebtCeiling, 'WAD'))

        if (totalDebtBN.gte(perSafeDebtCeilingBN)) {
            error = error ?? `Individual safe can't have more than ${liquidationData!.perSafeDebtCeiling} HAI of debt`
        }
    }

    return {
        error,
        parsedAmounts,
        totalCollateral,
        totalDebt,
        collateralRatio,
        liquidationPrice,
        availableCollateral,
        availableHai,
        liquidationData,
        liquidationPenaltyPercentage,
        stats,
        balances,
    }
}
// returns totalCollateral
export function useTotalCollateral(leftInput: string, type: SafeTypes) {
    const { singleSafe } = useSafeState()
    const totalCollateral = useMemo(() => {
        if (singleSafe) {
            if (type === 'repay_withdraw') {
                return returnTotalValue(singleSafe.collateral, leftInput, true, true).toString()
            }
            return returnTotalValue(singleSafe.collateral, leftInput).toString()
        }
        return leftInput
    }, [singleSafe, leftInput, type])

    return totalCollateral || '0'
}
// returns total debt
export function useTotalDebt(rightInput: string, type: SafeTypes) {
    const { singleSafe, liquidationData } = useSafeState()

    const collateralLiquidationData = liquidationData!.collateralLiquidationData
    const accumulatedRate = singleSafe?.collateralName
        ? collateralLiquidationData[singleSafe?.collateralName]?.accumulatedRate
        : '0'
    const totalDebt = useMemo(() => {
        if (singleSafe) {
            if (type === 'repay_withdraw') {
                return returnTotalValue(
                    returnTotalDebt(singleSafe.debt, accumulatedRate) as string,
                    rightInput,
                    true,
                    true
                ).toString()
            }
            return returnTotalValue(returnTotalDebt(singleSafe.debt, accumulatedRate) as string, rightInput).toString()
        }
        return rightInput
    }, [singleSafe, rightInput, type, accumulatedRate])

    return totalDebt && Number(totalDebt) > 0.00001 ? totalDebt : '0'
}
// returns collateral Ratio
export function useCollateralRatio(
    totalCollateral: string,
    totalDebt: string,
    liquidationPrice: string,
    liquidationCRatio: string
) {
    return useMemo(() => {
        return getCollateralRatio(totalCollateral, totalDebt, liquidationPrice, liquidationCRatio)
    }, [liquidationPrice, liquidationCRatio, totalCollateral, totalDebt])
}
// returns liquidation price
export function useLiquidationPrice(
    totalCollateral: string,
    totalDebt: string,
    currentRedemptionPrice: string,
    liquidationCRatio: string
) {
    return useMemo(() => {
        return getLiquidationPrice(totalCollateral, totalDebt, liquidationCRatio, currentRedemptionPrice)
    }, [currentRedemptionPrice, liquidationCRatio, totalCollateral, totalDebt])
}
// handles input data validation and storing them into store
export function useInputsHandlers(): {
    onLeftInput: (typedValue: string) => void
    onRightInput: (typedValue: string) => void
    onClearAll: () => void
} {
    const { safeModel: safeActions } = useStoreActions((state) => state)
    const {
        safeModel: { safeData },
    } = useStoreState((state) => state)

    const onClearAll = useCallback(() => {
        safeActions.setSafeData({
            ...DEFAULT_SAFE_STATE,
            collateral: safeData.collateral,
        })
    }, [safeActions, safeData])

    const onLeftInput = useCallback(
        (typedValue: string) => {
            safeActions.setSafeData({
                ...safeData,
                leftInput: typedValue,
            })
        },
        [safeActions, safeData]
    )
    const onRightInput = useCallback(
        (typedValue: string) => {
            safeActions.setSafeData({
                ...safeData,
                rightInput: typedValue,
            })
        },
        [safeActions, safeData]
    )
    return {
        onLeftInput,
        onRightInput,
        onClearAll,
    }
}
