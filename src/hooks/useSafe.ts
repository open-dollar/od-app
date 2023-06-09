import { BigNumber, ethers } from 'ethers'
import { useCallback, useMemo } from 'react'
import { useActiveWeb3React } from '.'
import numeral from 'numeral'
import { useStoreActions, useStoreState } from '../store'
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
} from '../utils/helper'
import { useProxyAddress } from './useGeb'
import { useTranslation } from 'react-i18next'
import { DEFAULT_SAFE_STATE } from '../utils/constants'
import { useTokenBalances } from './Wallet'

export const LIQUIDATION_RATIO = 135 // percent
export const ONE_DAY_WORTH_SF = ethers.utils.parseEther('0.00001')
export type SafeTypes = 'deposit_borrow' | 'repay_withdraw' | 'create'
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
    } = useStoreState((state) => state)

    // parsed amounts of deposit/repay withdraw/borrow as in left input and right input, they get switched based on if its Deposit & Borrow or Repay & Withdraw
    const parsedAmounts = useMemo(() => {
        const { leftInput, rightInput } = safeData
        return { leftInput, rightInput }
    }, [safeData])

    const { leftInput, rightInput } = parsedAmounts

    // get eth and rai balances
    const { eth, rai } = useTokenBalances(account as string)

    const balances = useMemo(() => {
        return {
            eth: eth.balance,
            rai: rai.balance,
        }
    }, [eth, rai])

    const { eth: ethBalance, rai: raiBalance } = balances

    // returns collateral amount and takes into consideration if its a new safe or not
    const collateral = useTotalCollateral(leftInput, type)
    // returns debt amount and takes into consideration if its a new safe or not
    const debt = useTotalDebt(rightInput, type)

    const totalCollateral = useMemo(() => collateral, [collateral])
    const totalDebt = useMemo(() => debt, [debt])

    // Checks if for collateralRatio safety if its safe or not
    const isSafe = useSafeIsSafe(totalCollateral, totalDebt)
    // returns collateral ratio
    const collateralRatio = useCollateralRatio(totalCollateral, totalDebt)
    // returns liquidation price
    const liquidationPrice = useLiquidationPrice(totalCollateral, totalDebt)

    // returns available ETH (collateral)
    // singleSafe means already a deployed safe
    const availableEth = useMemo(() => {
        if (type === 'deposit_borrow') {
            return formatNumber(ethBalance)
        } else {
            if (singleSafe) {
                return singleSafe.collateral
            }
        }
        return '0.00'
    }, [ethBalance, singleSafe, type])

    // returns available RAI (debt)
    // singleSafe means already a deployed safe
    const availableRai = useMemo(() => {
        if (type === 'create') {
            return returnAvaiableDebt(
                liquidationData.currentPrice.safetyPrice,
                liquidationData.accumulatedRate,
                leftInput
            )
        } else if (type === 'deposit_borrow') {
            if (singleSafe) {
                return returnAvaiableDebt(
                    liquidationData.currentPrice.safetyPrice,
                    liquidationData.accumulatedRate,
                    leftInput,
                    singleSafe.collateral,
                    singleSafe.debt
                )
            }
        } else {
            if (singleSafe) {
                return returnTotalDebt(
                    singleSafe.debt,
                    liquidationData.accumulatedRate
                ) as string
            }
        }
        return '0.00'
    }, [leftInput, liquidationData, singleSafe, type])

    const liquidationPenaltyPercentage = '18-20'

    const stabilityFeePercentage = useMemo(() => {
        return liquidationData.totalAnnualizedStabilityFee
            ? getRatePercentage(liquidationData.totalAnnualizedStabilityFee, 2)
            : '-'
    }, [liquidationData])

    const availableEthBN = BigNumber.from(
        toFixedString(availableEth.toString(), 'WAD')
    )
    const availableRaiBN = BigNumber.from(
        toFixedString(availableRai.toString(), 'WAD')
    )
    // account's RAI balance into BigNumber
    const raiBalanceBN = raiBalance
        ? BigNumber.from(toFixedString(raiBalance.toString(), 'WAD'))
        : BigNumber.from('0')

    const leftInputBN = leftInput
        ? BigNumber.from(toFixedString(leftInput, 'WAD'))
        : BigNumber.from('0')

    const rightInputBN = rightInput
        ? BigNumber.from(toFixedString(rightInput, 'WAD'))
        : BigNumber.from('0')
    // returns debtFloor from liquidation data from store
    const debtFloorBN = BigNumber.from(
        toFixedString(liquidationData.debtFloor, 'WAD')
    )
    const totalDebtBN = BigNumber.from(toFixedString(totalDebt, 'WAD'))

    // returns stats data used into stats display of the safe
    const stats: Stats = useMemo(() => {
        return {
            data: [
                {
                    label: 'Total ETH Collateral',
                    value: totalCollateral === '0' ? '-' : totalCollateral,
                    plainValue: totalCollateral,
                },
                {
                    label: 'Total RAI Debt',
                    value: totalDebt === '0' ? '-' : totalDebt,
                    plainValue: totalDebt,
                },
                {
                    label: 'Collateral Ratio',
                    value: (collateralRatio > 0 ? collateralRatio : '∞') + '%',
                    plainValue: collateralRatio,
                },
                {
                    label: 'Collateral Type',
                    value: 'ETH-A',
                },
            ],
            prices: [
                {
                    label: 'ETH Price (OSM)',
                    value:
                        '$' +
                        formatNumber(
                            liquidationData.currentPrice.value.toString(),
                            2
                        ),
                    tip: t('eth_osm_tip'),
                },
                {
                    label: 'RAI Redemption Price',
                    value:
                        '$' +
                        formatNumber(liquidationData.currentRedemptionPrice, 3),
                    tip: t('redemption_price_tip'),
                },
                {
                    label: 'Liquidation Price',
                    value:
                        liquidationPrice > 0
                            ? (liquidationPrice as number) >
                              Number(liquidationData.currentPrice.value)
                                ? 'Invalid'
                                : '$' + liquidationPrice
                            : '$' + 0,
                    tip: t('liquidation_price_tip', {
                        lr: LIQUIDATION_RATIO + '%',
                    }),
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
        collateralRatio,
        liquidationData,
        liquidationPenaltyPercentage,
        stabilityFeePercentage,
        liquidationPrice,
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
        if (leftInputBN.gt(availableEthBN)) {
            error = error ?? 'Insufficient balance'
        }
        if (rightInputBN.gt(availableRaiBN)) {
            error = error ?? `RAI borrowed cannot exceed available amount`
        }
        if (leftInputBN.isZero() && rightInputBN.isZero()) {
            error =
                error ??
                `Please enter the amount of ETH to be deposited or amount of RAI to be borrowed`
        }
    }

    if (type === 'repay_withdraw') {
        if (leftInputBN.isZero() && rightInputBN.isZero()) {
            error =
                error ??
                `Please enter the amount of ETH to free or the amount of RAI to repay`
        }
        if (leftInputBN.gt(availableEthBN)) {
            error = error ?? 'ETH to unlock cannot exceed available amount'
        }

        if (rightInputBN.gt(availableRaiBN)) {
            error = error ?? `RAI to repay cannot exceed owed amount`
        }

        if (!rightInputBN.isZero()) {
            const repayPercent = returnPercentAmount(
                rightInput,
                availableRai as string
            )

            if (
                rightInputBN
                    .add(ONE_DAY_WORTH_SF)
                    .lt(BigNumber.from(availableRaiBN)) &&
                repayPercent > 95
            ) {
                error =
                    error ??
                    `You can only repay a minimum of ${availableRai} RAI to avoid leaving residual values`
            }
        }

        if (!rightInputBN.isZero() && rightInputBN.gt(raiBalanceBN)) {
            error = error ?? `balance_issue`
        }
    }

    if (!totalDebtBN.isZero() && totalDebtBN.lt(debtFloorBN)) {
        error =
            error ??
            `The resulting debt should be at least ${Math.ceil(
                Number(formatNumber(liquidationData.debtFloor))
            )} RAI or zero`
    }

    if (!isSafe && (collateralRatio as number) >= 0) {
        error =
            error ??
            `Too much debt, below ${
                Number(liquidationData.safetyCRatio) * 100
            }% collateralization ratio`
    }

    if (
        numeral(totalDebt).value() >
        numeral(liquidationData.globalDebtCeiling).value()
    ) {
        error = error ?? 'Cannot exceed global debt ceiling'
    }

    if (
        numeral(totalDebt).value() >
        numeral(liquidationData.debtCeiling).value()
    ) {
        error = error ?? `Cannot exceed RAI debt ceiling`
    }

    if (type === 'create') {
        if (leftInputBN.isZero()) {
            error = error ?? 'Enter ETH Amount'
        }
    }

    if (type !== 'create') {
        const perSafeDebtCeilingBN = BigNumber.from(
            toFixedString(liquidationData.perSafeDebtCeiling, 'WAD')
        )

        if (totalDebtBN.gte(perSafeDebtCeilingBN)) {
            error =
                error ??
                `Individual safe can't have more than ${liquidationData.perSafeDebtCeiling} RAI of debt`
        }
    }

    return {
        error,
        parsedAmounts,
        totalCollateral,
        totalDebt,
        collateralRatio,
        liquidationPrice,
        availableEth,
        availableRai,
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
                return returnTotalValue(
                    singleSafe.collateral,
                    leftInput,
                    true,
                    true
                ).toString()
            }
            return returnTotalValue(singleSafe.collateral, leftInput).toString()
        }
        return leftInput
    }, [singleSafe, leftInput, type])

    return totalCollateral || '0'
}
// returns total debt
export function useTotalDebt(rightInput: string, type: SafeTypes) {
    const {
        singleSafe,
        liquidationData: { accumulatedRate },
    } = useSafeState()
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
            return returnTotalValue(
                returnTotalDebt(singleSafe.debt, accumulatedRate) as string,
                rightInput
            ).toString()
        }
        return rightInput
    }, [singleSafe, rightInput, type, accumulatedRate])

    return totalDebt && Number(totalDebt) > 0.00001 ? totalDebt : '0'
}
// returns collateral Ratio
export function useCollateralRatio(totalCollateral: string, totalDebt: string) {
    const {
        liquidationData: { currentPrice, liquidationCRatio },
    } = useSafeState()

    return useMemo(() => {
        return getCollateralRatio(
            totalCollateral,
            totalDebt,
            currentPrice.liquidationPrice,
            liquidationCRatio
        )
    }, [
        currentPrice.liquidationPrice,
        liquidationCRatio,
        totalCollateral,
        totalDebt,
    ])
}
// returns liquidation price
export function useLiquidationPrice(
    totalCollateral: string,
    totalDebt: string
) {
    const {
        liquidationData: { currentRedemptionPrice, liquidationCRatio },
    } = useSafeState()

    return useMemo(() => {
        return getLiquidationPrice(
            totalCollateral,
            totalDebt,
            liquidationCRatio,
            currentRedemptionPrice
        )
    }, [currentRedemptionPrice, liquidationCRatio, totalCollateral, totalDebt])
}
// checks for safe safety of collateral ratio
export function useSafeIsSafe(totalCollateral: string, totalDebt: string) {
    const {
        liquidationData: { currentPrice },
    } = useSafeState()
    return useMemo(() => {
        if (!currentPrice.safetyPrice) return true
        return safeIsSafe(totalCollateral, totalDebt, currentPrice.safetyPrice)
    }, [currentPrice.safetyPrice, totalCollateral, totalDebt])
}
// handles input data validation and storing them into store
export function useInputsHandlers(): {
    onLeftInput: (typedValue: string) => void
    onRightInput: (typedValue: string) => void
} {
    const { safeModel: safeActions } = useStoreActions((state) => state)
    const { safeModel: safeState } = useStoreState((state) => state)
    const { safeData } = safeState

    const onLeftInput = useCallback(
        (typedValue: string) => {
            if (!typedValue || typedValue === '' || Number(typedValue) < 0) {
                safeActions.setSafeData(DEFAULT_SAFE_STATE)
                return
            }
            safeActions.setSafeData({
                ...safeData,
                leftInput: typedValue,
            })
        },
        [safeActions, safeData]
    )
    const onRightInput = useCallback(
        (typedValue: string) => {
            if (!typedValue || typedValue === '' || Number(typedValue) < 0) {
                safeActions.setSafeData(DEFAULT_SAFE_STATE)
                return
            }
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
    }
}
