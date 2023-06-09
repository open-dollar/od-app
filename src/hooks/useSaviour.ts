import { Geb, utils as gebUtils } from 'geb.js'
import { ethers, utils as ethersUtils } from 'ethers'
import { useCallback, useMemo, useState, useEffect } from 'react'
import numeral from 'numeral'
import { JsonRpcSigner } from '@ethersproject/providers/lib/json-rpc-provider'
import { useStoreActions, useStoreState } from '../store'
import { TOKENS } from '../utils/tokens'
import { EMPTY_ADDRESS, ETH_NETWORK } from '../utils/constants'
import useGeb, { useProxyAddress } from './useGeb'
import { useActiveWeb3React } from '.'
import { handlePreTxGasEstimate } from './TransactionHooks'
import {
    FetchSaviourPayload,
    GetReservesFromSaviour,
    SaviourDepositPayload,
    SaviourWithdrawPayload,
} from '../utils/interfaces'
import { BigNumber } from '@ethersproject/bignumber'
import { formatNumber, toFixedString } from '../utils/helper'
import { useTranslation } from 'react-i18next'
import { SaviourType } from '../model/safeModel'
import { ETH_A } from 'geb.js/lib/utils'
import { useTokenBalances } from './Wallet'
import { getAddress } from '@ethersproject/address'

export const CURVE_SAVIOUR_LIQUIDATION_POINT = 100 // percent
export const LIQUIDATION_POINT = 125 // percent
export const LIQUIDATION_CRATIO = 135 // percent

export type SaviourData = {
    safeId: string
    hasSaviour: boolean
    saviourAddress: string
    saviourBalance: string
    curvelpTokenAddress: string
    curvePoolTokenAddress: string
    saviourType: string
    coinAddress: string
    wethAddress: string
    saviourRescueRatio: number
    reserve0: BigNumber
    reserve1: BigNumber
    coinTotalSupply: BigNumber
    reserveRAI: BigNumber
    reserveETH: BigNumber
    ethPrice: number
    uniPoolPrice: number
    minCollateralRatio: number
    rescueFee: string
    redemptionPrice: BigNumber
    accumulatedRate: BigNumber
    generatedDebt: BigNumber
    lockedCollateral: BigNumber
    keeperPayOut: BigNumber
    uniswapV2CoinEthAllowance: string
    uniswapV2CoinEthBalance: string
}

export type StatsType = 'data' | 'info'
export type Stats = {
    [K in StatsType]: Array<{
        label: string
        value: string | number
        tip?: string
        plainValue?: string | number
    }>
}

// returns saviour data
export function useSaviourInfo() {
    const { t } = useTranslation()
    const { account } = useActiveWeb3React()
    // get account proxy address
    const proxyAddress = useProxyAddress()
    // get saviour data
    const saviourHook = useSaviourData()
    // get min saviour balance
    const { getMinSaviourBalance } = useMinSaviourBalance()
    // safe data from store
    const { safeModel: safeState } = useStoreState((state) => state)
    const {
        isSaviourDeposit,
        amount,
        targetedCRatio,
        saviourType,
        isMaxWithdraw,
    } = safeState

    const saviourData = useMemo(() => {
        return saviourHook
    }, [saviourHook])

    // checks if its curve saviour or Uniswap
    const isCurveSaviour = useMemo(() => saviourType === 'curve', [saviourType])

    // token label based on saviour type
    const tokenLabel = useMemo(
        () => (isCurveSaviour ? 'RAI3CRV' : 'UNI-V2'),
        [isCurveSaviour]
    )

    // saviour states
    const saviourState = useMemo(() => {
        return {
            isSaviourDeposit,
            amount,
            targetedCRatio,
            saviourType,
            isMaxWithdraw,
        }
    }, [isSaviourDeposit, amount, targetedCRatio, saviourType, isMaxWithdraw])

    // checks if safe has a saviour
    const hasSaviour = saviourData && saviourData.hasSaviour

    // return saviour tokens
    const tokens = useMemo(() => {
        return saviourData
            ? {
                  ...TOKENS,
                  curve: {
                      ...TOKENS.curve,
                      address: saviourData.curvelpTokenAddress,
                  },
              }
            : TOKENS
    }, [saviourData])

    // return token balances
    const tokenBalances = useTokenBalances(account as string, tokens)

    // returns safeId of the saviour data from store
    const safeId = useMemo(() => {
        return saviourData ? saviourData.safeId : ''
    }, [saviourData])

    // available balance to deposit
    const availableDepositBalance = useMemo(() => {
        return saviourData
            ? isCurveSaviour
                ? tokenBalances.curve.balance
                : saviourData.uniswapV2CoinEthBalance
            : '0'
    }, [isCurveSaviour, saviourData, tokenBalances])

    // available saviour balance to withdraw
    const availableWithdrawBalance = useMemo(() => {
        return saviourData ? saviourData.saviourBalance : '0'
    }, [saviourData])

    // account saviour balance
    const mySaviourBalance = useMemo(() => {
        if (!saviourData) return '0'
        const amountBN = amount
            ? ethers.utils.parseEther(amount)
            : BigNumber.from('0')
        const saviourBalanceBN = saviourData
            ? ethers.utils.parseEther(saviourData.saviourBalance)
            : BigNumber.from('0')
        if (isSaviourDeposit) {
            return ethers.utils.formatEther(saviourBalanceBN.add(amountBN))
        }
        return ethers.utils.formatEther(saviourBalanceBN.sub(amountBN))
    }, [amount, isSaviourDeposit, saviourData])

    // min saviour balance to deposit or to save your safe
    const minSaviourBalance = getMinSaviourBalance({
        type: saviourType,
        targetedCRatio,
    })
    // saviour stats used to for display
    const stats: Stats = useMemo(() => {
        return {
            data: [
                {
                    label: 'Minimum Saviour Balance',
                    value: `${minSaviourBalance} ${tokenLabel}`,
                    tip: t('saviour_balance_tip'),
                },
                {
                    label: 'Protected Liquidation Point',
                    value: isCurveSaviour
                        ? CURVE_SAVIOUR_LIQUIDATION_POINT + '%'
                        : LIQUIDATION_POINT + '%',
                    tip: t('liquidation_point_tip', {
                        liquidation_ratio: LIQUIDATION_CRATIO,
                    }),
                },
                {
                    label: 'Rescue Fee',
                    value: `$${saviourData?.rescueFee}`,
                    tip: t('rescue_fee_tip'),
                },
            ],
            info: [
                {
                    label: 'My Saviour Balance',
                    value: `${formatNumber(mySaviourBalance)} ${tokenLabel}`,
                    tip: t('saviour_balance_tip'),
                },
                {
                    label: 'My Target Rescue CRatio',
                    value: targetedCRatio + '%',
                    tip: t('saviour_target_cratio'),
                },
                {
                    label: 'Saviour Type',
                    value: !isCurveSaviour
                        ? 'Uniswap v2 RAI/ETH'
                        : 'Curve RAI/3Pool',
                },
            ],
        }
    }, [
        isCurveSaviour,
        minSaviourBalance,
        mySaviourBalance,
        saviourData,
        t,
        targetedCRatio,
        tokenLabel,
    ])

    let error: string | undefined

    if (!account) {
        error = 'Connect Wallet'
    }

    if (!proxyAddress) {
        error = error ?? 'Create a Reflexer Account to continue'
    }

    const amountBN = amount
        ? ethers.utils.parseEther(amount)
        : BigNumber.from('0')

    const saviourBalanceBN = saviourData
        ? ethers.utils.parseEther(saviourData.saviourBalance)
        : BigNumber.from('0')

    const minBalanceBN = minSaviourBalance
        ? ethers.utils.parseEther(minSaviourBalance as string)
        : BigNumber.from('0')

    const availableDepositBalanceBN = availableDepositBalance
        ? ethers.utils.parseEther(availableDepositBalance)
        : BigNumber.from('0')

    const availableWithdrawBalanceBN = availableWithdrawBalance
        ? ethers.utils.parseEther(availableWithdrawBalance)
        : BigNumber.from('0')

    if (!isCurveSaviour && !targetedCRatio) {
        error = error ?? 'No min CollateralRatio'
    }

    if (
        (!hasSaviour && amountBN.isZero()) ||
        (hasSaviour &&
            amountBN.isZero() &&
            targetedCRatio === saviourData?.saviourRescueRatio)
    ) {
        error =
            error ??
            `You cannot ${isSaviourDeposit ? 'deposit' : 'withdraw'} nothing`
    }

    if (
        !amountBN.isZero() &&
        isSaviourDeposit &&
        amountBN.gt(availableDepositBalanceBN)
    ) {
        error = error ?? `Cannot deposit more than you have in your wallet`
    }

    if (
        !amountBN.isZero() &&
        !isSaviourDeposit &&
        amountBN.gt(availableWithdrawBalanceBN)
    ) {
        error = error ?? `Cannot withdraw less than minimum saviour balance`
    }

    if (isSaviourDeposit) {
        if (!minSaviourBalance) {
            error = error ?? 'Cannot deposit if your Safe does not have debt'
        }
        if (amountBN.add(saviourBalanceBN).lt(minBalanceBN)) {
            error =
                error ??
                `Recommended minimal balance is:  ${minSaviourBalance} ${tokenLabel} and your resulting balance is ${ethers.utils.formatEther(
                    amountBN.add(saviourBalanceBN)
                )} ${tokenLabel}`
        }
    } else {
        if (
            !amountBN.isZero() &&
            saviourBalanceBN.sub(amountBN).lt(minBalanceBN) &&
            !saviourBalanceBN.eq(amountBN)
        ) {
            error =
                error ??
                `Recommended minimal balance is:  ${minSaviourBalance} ${tokenLabel} and your resulting balance is ${ethers.utils.formatEther(
                    saviourBalanceBN.sub(amountBN)
                )} ${tokenLabel}`
        }
    }

    return {
        error,
        saviourState,
        saviourData,
        hasSaviour,
        safeId,
        availableDepositBalance,
        availableWithdrawBalance,
        stats,
        minSaviourBalance,
        mySaviourBalance,
        tokenBalances,
        isCurveSaviour,
        tokenLabel,
    }
}

// handles input handling input amount
export function useInputHandler(): {
    onTypedInput: (typedValue: string) => void
} {
    const { safeModel: safeActions } = useStoreActions((state) => state)

    const onTypedInput = useCallback(
        (typedValue: string) => {
            if (!typedValue || typedValue === '') {
                safeActions.setAmount('')
                return
            }
            safeActions.setAmount(typedValue)
        },
        [safeActions]
    )
    return {
        onTypedInput,
    }
}

// returns saviour address if exists or 0X00000 address
export function useSaviourAddress(safeHandler: string) {
    const [state, setState] = useState(EMPTY_ADDRESS)
    const geb = useGeb()

    const getSaviourAddressCallback = useCallback((saviourAddress) => {
        if (saviourAddress) {
            setState(saviourAddress)
        }
    }, [])

    useEffect(() => {
        if (!geb || !safeHandler) return
        setState(EMPTY_ADDRESS)
        geb.contracts.liquidationEngine
            .chosenSAFESaviour(gebUtils.ETH_A, safeHandler.toLowerCase())
            .then(getSaviourAddressCallback)
            .catch((error) =>
                console.error(`Failed to get saviour address from gebjs`, error)
            )
    }, [geb, getSaviourAddressCallback, safeHandler])

    return useMemo(() => state, [state])
}

// Checks if safe has a saviour
export function useHasSaviour(safeHandler: string) {
    const saviourAddress = useSaviourAddress(safeHandler)
    return useMemo(() => {
        return safeHandler && saviourAddress !== EMPTY_ADDRESS ? true : false
    }, [safeHandler, saviourAddress])
}

// Checks if safe has Left over after saving the safe has been successful
export function useHasLeftOver(safeHandler: string) {
    const [state, setState] = useState(false)
    const geb = useGeb()
    const { saviourData } = useSaviourInfo()
    const saviourAddress = useSaviourAddress(safeHandler)

    const getLeftOverCallback = useCallback((res) => {
        if (res) {
            let hasLeftOver
            if (res.systemCoins && res.collateralCoins) {
                hasLeftOver = res.systemCoins.gt(0) || res.collateralCoins.gt(0)
            } else {
                const [systemCoins, curvePoolCoins] = res
                hasLeftOver = systemCoins.gt(0) || curvePoolCoins.gt(0)
            }
            if (hasLeftOver) {
                setState(hasLeftOver)
            }
        }
    }, [])

    useEffect(() => {
        if (
            !geb ||
            !safeHandler ||
            !saviourData ||
            saviourData.saviourAddress === EMPTY_ADDRESS
        )
            return
        setState(false)
        const { saviourType, curvePoolTokenAddress } = saviourData

        const isCurveSaviour = saviourType === 'curve'

        if (isCurveSaviour) {
            geb.multiCall([
                geb.contracts.yearnCurveMaxSafeSaviour.underlyingReserves(
                    safeHandler.toLowerCase(),
                    curvePoolTokenAddress,
                    true
                ),
                geb.contracts.yearnCurveMaxSafeSaviour.underlyingReserves(
                    safeHandler.toLowerCase(),
                    geb.contracts.coin.address,
                    true
                ),
            ])
                .then(getLeftOverCallback)
                .catch((error) =>
                    console.error(
                        `Failed to get left over for yearn curve saviour from gebjs`,
                        error
                    )
                )
        } else {
            geb.contracts.coinNativeUniswapSaviour
                .underlyingReserves(safeHandler.toLowerCase())
                .then(getLeftOverCallback)
                .catch((error) =>
                    console.error(
                        `Failed to get left over for uniswapv2 from gebjs`,
                        error
                    )
                )
        }
    }, [geb, getLeftOverCallback, safeHandler, saviourData])

    return useMemo(
        () => ({ status: state, saviourAddress }),
        [saviourAddress, state]
    )
}
// Feching saviour data and saving it into store
export async function fetchSaviourData({
    account,
    safeId,
    ethPrice,
    geb,
}: FetchSaviourPayload) {
    if (!account || !safeId || !geb) return

    const [safeHandler, proxyAddress] = await geb.multiCall([
        geb.contracts.safeManager.safes(safeId, true),
        geb.contracts.proxyRegistry.proxies(account.toLowerCase(), true),
    ])
    const multiCallRequest = geb.multiCall([
        geb.contracts.liquidationEngine.chosenSAFESaviour(
            gebUtils.ETH_A,
            safeHandler.toLowerCase(),
            true
        ),
        geb.contracts.coinNativeUniswapSaviour.lpTokenCover(
            safeHandler.toLowerCase(),
            true
        ),
        geb.contracts.saviourCRatioSetter.desiredCollateralizationRatios(
            gebUtils.ETH_A,
            safeHandler.toLowerCase(),
            true
        ),
        geb.contracts.uniswapPairCoinEth.getReserves(true),
        geb.contracts.uniswapPairCoinEth.totalSupply(true),
        geb.contracts.uniswapPairCoinEth.allowance(
            account.toLowerCase(),
            proxyAddress.toLowerCase(),
            true
        ),
        geb.contracts.uniswapPairCoinEth.balanceOf(account.toLowerCase(), true),
    ])
    const multiCallRequest2 = geb.multiCall([
        geb.contracts.saviourCRatioSetter.minDesiredCollateralizationRatios(
            gebUtils.ETH_A,
            true
        ),
        geb.contracts.coinNativeUniswapSaviour.minKeeperPayoutValue(true),
        geb.contracts.oracleRelayer.redemptionPrice_readOnly(true),
        geb.contracts.safeEngine.collateralTypes(gebUtils.ETH_A, true),
        geb.contracts.safeEngine.safes(
            gebUtils.ETH_A,
            safeHandler.toLowerCase(),
            true
        ),
        geb.contracts.coinNativeUniswapSaviour.minKeeperPayoutValue(true),
    ])
    //@ts-ignore
    const curveSaviourAddress = geb.addresses.GEB_YEARN_CURVE_MAX_SAVIOUR
    const emptyRes: [ethers.BigNumber, string, string] = [
        BigNumber.from('0'),
        EMPTY_ADDRESS,
        EMPTY_ADDRESS,
    ]
    const multiCallRequest3 =
        curveSaviourAddress !== EMPTY_ADDRESS
            ? geb.multiCall([
                  geb.contracts.yearnCurveMaxSafeSaviour.yvTokenCover(
                      ETH_A,
                      safeHandler.toLowerCase(),
                      true
                  ),

                  geb.contracts.yearnCurveMaxSafeSaviour.curveLpToken(true),
                  geb.contracts.yearnCurveMaxSafeSaviour.curvePoolTokens(
                      1,
                      true
                  ),
              ])
            : emptyRes

    const [muliCallResponse1, multiCallResponse2, multiCallResponse3] =
        await Promise.all([
            multiCallRequest,
            multiCallRequest2,
            multiCallRequest3,
        ])

    const [
        saviourAddress,
        saviourBalance,
        saviourRescueRatio,
        reserves,
        coinTotalSupply,
        uniswapV2CoinEthAllowance,
        uniswapV2CoinEthBalance,
    ] = muliCallResponse1

    const [
        minCollateralRatio,
        rescueFee,
        redemptionPrice,
        { accumulatedRate },
        { generatedDebt, lockedCollateral },
        keeperPayOut,
    ] = multiCallResponse2

    const [curveSaviourBalance, curvelpTokenAddress, curvePoolTokenAddress] =
        multiCallResponse3

    const wethAddress = geb.contracts.weth.address
    const coinAddress = geb.contracts.coin.address
    const reserve0 = reserves._reserve0
    const reserve1 = reserves._reserve1

    const isCoinLessThanWeth = () => {
        if (!coinAddress || !wethAddress) return false
        return BigNumber.from(coinAddress).lt(BigNumber.from(wethAddress))
    }

    let reserveRAI = BigNumber.from('0')
    let reserveETH = BigNumber.from('0')

    if (isCoinLessThanWeth()) {
        reserveRAI = reserve0
        reserveETH = reserve1
    } else {
        reserveRAI = reserve1
        reserveETH = reserve0
    }

    //
    //                      2 * ethPrice * reserveETH
    // uniPoolPrice = --------------------------------------
    //                            lptotalSupply

    const isCurveSaviour =
        saviourAddress.toLowerCase() === curveSaviourAddress.toLowerCase()

    const formattedSaviourBalance = ethersUtils.formatEther(
        isCurveSaviour ? curveSaviourBalance : saviourBalance
    )

    const formattedCoinTotalSupply = ethersUtils.formatEther(coinTotalSupply)

    const formattedUniswapV2CoinEthAllowance = ethersUtils.formatEther(
        uniswapV2CoinEthAllowance
    )
    const formattedUniswapV2CoinEthBalance = ethersUtils.formatEther(
        uniswapV2CoinEthBalance
    )

    const numerator = numeral(2)
        .multiply(ethPrice)
        .multiply(ethersUtils.formatEther(reserveETH))
        .value()

    const uniPoolPrice = numeral(numerator)
        .divide(formattedCoinTotalSupply)
        .value()
    return {
        safeId,
        hasSaviour: saviourAddress !== EMPTY_ADDRESS,
        curvelpTokenAddress,
        curvePoolTokenAddress,
        saviourType: isCurveSaviour ? 'curve' : 'uniswap',
        coinAddress,
        wethAddress,
        saviourAddress,
        saviourBalance: formattedSaviourBalance,
        saviourRescueRatio: saviourRescueRatio.toNumber(),
        coinTotalSupply,
        minCollateralRatio: minCollateralRatio.toNumber(),
        rescueFee: ethersUtils.formatEther(rescueFee),
        reserve0,
        reserve1,
        reserveRAI,
        reserveETH,
        ethPrice,
        uniPoolPrice: formatNumber(uniPoolPrice.toString(), 2) as number,
        redemptionPrice,
        accumulatedRate,
        generatedDebt,
        lockedCollateral,
        keeperPayOut,
        uniswapV2CoinEthAllowance: formattedUniswapV2CoinEthAllowance,
        uniswapV2CoinEthBalance: formattedUniswapV2CoinEthBalance,
    }
}

export function useSaviourData(): SaviourData | undefined {
    const { safeModel: safeState } = useStoreState((state) => state)
    const { saviourData } = safeState
    if (!saviourData) return
    return saviourData
}

export function useTargetedCRatio(): number {
    const { safeModel: safeState } = useStoreState((state) => state)
    const { targetedCRatio } = safeState
    return targetedCRatio
}

// minSaviourBalance

export function useMinSaviourBalance() {
    const HUNDRED = 100
    const saviourData = useSaviourData()
    const getMinSaviourBalance = useCallback(
        ({
            type = 'uniswap',
            targetedCRatio,
            totalDebt,
            totalCollateral,
        }: {
            type: SaviourType
            targetedCRatio?: number
            totalDebt?: string
            totalCollateral?: string
        }) => {
            const WAD_COMPLEMENT = BigNumber.from(10 ** 9)
            if (!saviourData || !targetedCRatio) return '0'
            const { RAY } = gebUtils
            const {
                redemptionPrice,
                generatedDebt: safeDebt,
                accumulatedRate,
                lockedCollateral: safeCollateral,
                keeperPayOut,
                rescueFee,
            } = saviourData

            const generatedDebt = totalDebt
                ? BigNumber.from(toFixedString(totalDebt, 'WAD'))
                      .mul(RAY)
                      .div(accumulatedRate)
                : safeDebt

            if (type !== 'uniswap') {
                const Rvar = redemptionPrice.mul(2).mul(generatedDebt)
                const Tvar =
                    1 - CURVE_SAVIOUR_LIQUIDATION_POINT / LIQUIDATION_CRATIO

                const minBalance =
                    Number(ethers.utils.formatEther(Rvar.div(RAY))) * Tvar

                const balancePlusFee = minBalance + Number(rescueFee) * 2
                const formattedBalance = formatNumber(
                    balancePlusFee.toString(),
                    4,
                    true
                )

                return isNaN(parseFloat(formattedBalance as string))
                    ? '0.00'
                    : formattedBalance
            }

            const lockedCollateral = totalCollateral
                ? BigNumber.from(toFixedString(totalCollateral, 'WAD'))
                : safeCollateral

            // Liquidation price formula
            //
            //                              debt * accumulatedRate * RP * Liq Point
            // liquidationPrice = -----------------------------------------------
            //                                     collateral
            if (lockedCollateral.isZero() || generatedDebt.isZero()) {
                return '0'
            }
            const liquidationPrice = redemptionPrice
                .mul(generatedDebt.mul(WAD_COMPLEMENT))
                .mul(accumulatedRate)
                .mul(LIQUIDATION_POINT)
                .div(HUNDRED)
                .div(lockedCollateral.mul(WAD_COMPLEMENT))
                .div(RAY)

            // The calculation below refers to the formula described at:
            // https://docs.reflexer.finance/liquidation-protection/uni-v2-rai-eth-savior-math

            const jVar = !liquidationPrice.isZero()
                ? redemptionPrice
                      .mul(accumulatedRate)
                      .div(RAY)
                      .mul(targetedCRatio)
                      .div(HUNDRED)
                      .mul(RAY)
                      .div(liquidationPrice)
                : BigNumber.from('0')

            // TODO: Rai market price as RAY
            // const currentRaiMarketPrice = BigNumber.from(
            //     '3050000000000000000000000000'
            // )

            const pVar = !liquidationPrice.isZero()
                ? redemptionPrice.mul(RAY).div(liquidationPrice)
                : BigNumber.from('0')

            // Leave out sqrt(p) from the minimum bal equation because BignNumber doesn't do square root
            const minSaviorBalanceRayWithoutSqrtP =
                !jVar.isZero() && !pVar.isZero()
                    ? lockedCollateral
                          .mul(WAD_COMPLEMENT)
                          .sub(
                              generatedDebt
                                  .mul(WAD_COMPLEMENT)
                                  .mul(jVar)
                                  .div(RAY)
                          )
                          .div(jVar.add(pVar))
                    : BigNumber.from('0')

            // TODO: Find a better way doing square root if there is
            const minSaviorBalanceNumber =
                Math.sqrt(Number(pVar.toString()) / 1e27) *
                Number(minSaviorBalanceRayWithoutSqrtP.toString())

            const keeperPayoutInLP =
                Number(keeperPayOut.mul(WAD_COMPLEMENT).toString()) /
                (Math.sqrt(
                    Number(liquidationPrice.mul(redemptionPrice).toString())
                ) *
                    2)

            // Add the keeper balance
            const minSaviorBalanceFinal =
                Math.abs(minSaviorBalanceNumber) +
                Number(keeperPayoutInLP.toString())
            const minSavBalance = formatNumber(
                minSaviorBalanceFinal.toString(),
                4,
                true
            )

            return isNaN(parseFloat(minSavBalance as string))
                ? '0.00'
                : minSavBalance
        },
        [saviourData]
    )

    return { getMinSaviourBalance }
}

// deposit LP balance to saviour
export function useSaviourDeposit() {
    const {
        transactionsModel: transactionsActions,
        popupsModel: popupsActions,
    } = useStoreActions((store) => store)

    const { account } = useActiveWeb3React()

    const depositCallback = async function (
        signer: JsonRpcSigner,
        saviourPayload: SaviourDepositPayload
    ) {
        if (!account || !signer || !saviourPayload) {
            return false
        }
        const geb = new Geb(ETH_NETWORK, signer.provider)
        const proxy = await geb.getProxyAction(signer._address)
        const {
            safeId,
            amount,
            targetedCRatio,
            saviourType,
            curvelpTokenAddress,
        } = saviourPayload
        const tokenAmount = ethersUtils.parseEther(amount)

        let txData
        if (saviourType === 'uniswap') {
            txData = proxy.protectSAFESetDesiredCRatioDeposit(
                false,
                geb.contracts.coinNativeUniswapSaviour.address,
                geb.contracts.uniswapPairCoinEth.address,
                safeId,
                tokenAmount,
                targetedCRatio
            )
        } else {
            // @ts-ignore
            const saviourAddress = geb.addresses.GEB_YEARN_CURVE_MAX_SAVIOUR

            const formattedAddresss = getAddress(saviourAddress)
            txData = proxy.protectSAFEDeposit(
                true,
                formattedAddresss,
                curvelpTokenAddress,
                safeId,
                tokenAmount
            )
        }
        if (!txData) throw new Error('No transaction request!')
        const tx = await handlePreTxGasEstimate(signer, txData)
        const txResponse = await signer.sendTransaction(tx)
        if (txResponse) {
            const { hash, chainId } = txResponse
            transactionsActions.addTransaction({
                chainId,
                hash,
                from: txResponse.from,
                summary: 'Safe Saviour Deposit',
                addedTime: new Date().getTime(),
                originalTx: txResponse,
            })
            popupsActions.setIsWaitingModalOpen(true)
            popupsActions.setWaitingPayload({
                title: 'Transaction Submitted',
                hash: txResponse.hash,
                status: 'success',
            })
            await txResponse.wait()
        }
    }

    return { depositCallback }
}

// withdraws balance from saviour
export function useSaviourWithdraw() {
    const {
        transactionsModel: transactionsActions,
        popupsModel: popupsActions,
    } = useStoreActions((store) => store)

    const { account } = useActiveWeb3React()

    const withdrawCallback = async function (
        signer: JsonRpcSigner,
        saviourPayload: SaviourWithdrawPayload
    ) {
        if (!account || !signer || !saviourPayload) {
            return false
        }
        const geb = new Geb(ETH_NETWORK, signer.provider)
        const proxy = await geb.getProxyAction(signer._address)
        const {
            safeId,
            amount,
            isMaxWithdraw,
            targetedCRatio,
            isTargetedCRatioChanged,
            saviourType,
            curvelpTokenAddress,
        } = saviourPayload
        const tokenAmount = ethersUtils.parseEther(amount)

        let txData
        const isCurveSaviour = saviourType === 'curve'
        // @ts-ignore
        const curveSaviourAddress = geb.addresses.GEB_YEARN_CURVE_MAX_SAVIOUR
        if (isMaxWithdraw) {
            txData = proxy.withdrawUncoverSAFE(
                !isCurveSaviour ? false : true,
                !isCurveSaviour
                    ? geb.contracts.coinNativeUniswapSaviour.address
                    : curveSaviourAddress,
                !isCurveSaviour
                    ? geb.contracts.uniswapPairCoinEth.address
                    : curvelpTokenAddress,
                safeId,
                tokenAmount,
                signer._address
            )
        } else if (!isCurveSaviour && isTargetedCRatioChanged) {
            txData = proxy.setDesiredCRatioWithdraw(
                false,
                geb.contracts.coinNativeUniswapSaviour.address,
                safeId,
                tokenAmount,
                targetedCRatio,
                signer._address
            )
        } else {
            txData = proxy.withdraw(
                !isCurveSaviour ? false : true,
                !isCurveSaviour
                    ? geb.contracts.coinNativeUniswapSaviour.address
                    : curveSaviourAddress,
                safeId,
                tokenAmount,
                signer._address
            )
        }
        if (!txData) throw new Error('No transaction request!')
        const tx = await handlePreTxGasEstimate(signer, txData)
        const txResponse = await signer.sendTransaction(tx)
        if (txResponse) {
            const { hash, chainId } = txResponse
            transactionsActions.addTransaction({
                chainId,
                hash,
                from: txResponse.from,
                summary: 'Safe Saviour Withdraw',
                addedTime: new Date().getTime(),
                originalTx: txResponse,
            })
            popupsActions.setIsWaitingModalOpen(true)
            popupsActions.setWaitingPayload({
                title: 'Transaction Submitted',
                hash: txResponse.hash,
                status: 'success',
            })
            await txResponse.wait()
        }
    }

    return { withdrawCallback }
}

// withdraws balance from saviour
export function useSaviourGetReserves() {
    const {
        transactionsModel: transactionsActions,
        popupsModel: popupsActions,
    } = useStoreActions((store) => store)

    const { account } = useActiveWeb3React()

    const getReservesCallback = async function (
        signer: JsonRpcSigner,
        payload: GetReservesFromSaviour
    ) {
        if (!account || !signer || !payload) {
            return false
        }
        const geb = new Geb(ETH_NETWORK, signer.provider)
        const proxy = await geb.getProxyAction(signer._address)
        const { safeId, saviourAddress } = payload

        const txData = proxy.getReservesAndUncover(
            saviourAddress,
            safeId,
            signer._address
        )

        if (!txData) throw new Error('No transaction request!')
        const tx = await handlePreTxGasEstimate(signer, txData)
        const txResponse = await signer.sendTransaction(tx)
        if (txResponse) {
            const { hash, chainId } = txResponse
            transactionsActions.addTransaction({
                chainId,
                hash,
                from: txResponse.from,
                summary: 'Safe Saviour Get Reserves',
                addedTime: new Date().getTime(),
                originalTx: txResponse,
            })
            popupsActions.setIsWaitingModalOpen(true)
            popupsActions.setWaitingPayload({
                title: 'Transaction Submitted',
                hash: txResponse.hash,
                status: 'success',
            })
            await txResponse.wait()
        }
    }

    return { getReservesCallback }
}

// Change saviour target CRatio
export function useChangeTargetedCRatio() {
    const {
        transactionsModel: transactionsActions,
        popupsModel: popupsActions,
    } = useStoreActions((store) => store)

    const { account } = useActiveWeb3React()

    const changeTargetedCRatio = async function (
        signer: JsonRpcSigner,
        payload: SaviourDepositPayload
    ) {
        if (!account || !signer || !payload) {
            return false
        }
        const geb = new Geb(ETH_NETWORK, signer.provider)
        const proxy = await geb.getProxyAction(signer._address)
        const { safeId, targetedCRatio } = payload

        const txData = proxy.setDesiredCollateralizationRatio(
            gebUtils.ETH_A,
            safeId,
            targetedCRatio
        )

        if (!txData) throw new Error('No transaction request!')
        const tx = await handlePreTxGasEstimate(signer, txData)
        const txResponse = await signer.sendTransaction(tx)
        if (txResponse) {
            const { hash, chainId } = txResponse
            transactionsActions.addTransaction({
                chainId,
                hash,
                from: txResponse.from,
                summary: 'Change Collateralization Ratio',
                addedTime: new Date().getTime(),
                originalTx: txResponse,
            })
            popupsActions.setIsWaitingModalOpen(true)
            popupsActions.setWaitingPayload({
                title: 'Transaction Submitted',
                hash: txResponse.hash,
                status: 'success',
            })
            await txResponse.wait()
        }
    }

    return { changeTargetedCRatio }
}

// Disconnect Saviour from Safe
export function useDisconnectSaviour() {
    const {
        transactionsModel: transactionsActions,
        popupsModel: popupsActions,
    } = useStoreActions((store) => store)

    const { account } = useActiveWeb3React()

    const disconnectSaviour = async function (
        signer: JsonRpcSigner,
        payload: GetReservesFromSaviour
    ) {
        if (!account || !signer || !payload) {
            return false
        }
        const geb = new Geb(ETH_NETWORK, signer.provider)
        const proxy = await geb.getProxyAction(signer._address)
        const { safeId, saviourAddress } = payload

        const txData = proxy.protectSAFE(saviourAddress, safeId)

        if (!txData) throw new Error('No transaction request!')
        const tx = await handlePreTxGasEstimate(signer, txData)
        const txResponse = await signer.sendTransaction(tx)
        if (txResponse) {
            const { hash, chainId } = txResponse
            transactionsActions.addTransaction({
                chainId,
                hash,
                from: txResponse.from,
                summary: 'Disconnect Saviour form Safe',
                addedTime: new Date().getTime(),
                originalTx: txResponse,
            })
            popupsActions.setIsWaitingModalOpen(true)
            popupsActions.setWaitingPayload({
                title: 'Transaction Submitted',
                hash: txResponse.hash,
                status: 'success',
            })
            await txResponse.wait()
        }
    }

    return { disconnectSaviour }
}
