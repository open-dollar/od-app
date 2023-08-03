import { useEffect, useMemo, useState } from 'react'
import { useStoreActions, useStoreState } from '~/store'
import { BigNumber, utils } from 'ethers'
import _ from '~/utils/lodash'

import { useActiveWeb3React } from '~/hooks'
import { AuctionEventType, IAuction, IAuctionBidder, ICollateralAuction } from '~/types'
import { AuctionData } from '~/utils/virtual/virtualAuctionData'
import { radToFixed, wadToFixed } from '@hai-on-op/sdk/lib/utils'
import useGeb from './useGeb'
import { utils as gebUtils } from '@hai-on-op/sdk'

// temporary cast
import {
    ICollateralAuction as SDKCollateralAuction,
    ISurplusAuction as SDKAuction,
} from '@hai-on-op/sdk/lib/schema/auction'
import { floatsTypes, parseWad } from '~/utils'

export function useGetAuctions(type: AuctionEventType, tokenSymbol?: string) {
    const { auctionModel } = useStoreState((state) => state)
    const auctionsList = (function () {
        switch (type) {
            case 'SURPLUS':
                return auctionModel.surplusAuctions
            case 'DEBT':
                return auctionModel.debtAuctions
            case 'COLLATERAL':
                return auctionModel.collateralAuctions[tokenSymbol || 'WETH']
            default:
                return null
        }
    })()

    return auctionsList
}

// list auctions data
export function useAuctions(type: AuctionEventType, tokenSymbol?: string) {
    const [state, setState] = useState<Array<IAuction> | null>(null)
    const { connectWalletModel: connectWalletState } = useStoreState((state) => state)

    // Temporary casting. We need to know how to manage the collateralAuctions as those are different types
    const auctionsList = useGetAuctions(type, tokenSymbol) as SDKAuction[]
    const userProxy: string = _.get(connectWalletState, 'proxyAddress', '')

    useEffect(() => {
        if (auctionsList) {
            if (auctionsList.length === 0) {
                setState([])
            }

            // show auctions less than one month old only
            // const oneMonthOld = new Date().setMonth(new Date().getMonth() - 1)
            const filteredAuctions: IAuction[] = auctionsList.map((auc: SDKAuction, index) => {
                const {
                    // isClaimed,
                    auctionDeadline,
                    // startedBy,
                    createdAt,
                    initialBid,
                    createdAtTransaction,
                    biddersList,
                    auctionId,
                } = auc

                // if auction is settled, winner is the last bidder
                const winner = _.get(
                    auc,
                    'winner',
                    // winner === currentWinner
                    // so we set the last bidder as currentWinner
                    biddersList && biddersList.length > 0 ? biddersList.reverse()[0].bidder : ''
                )

                let sellInitialAmount = _.get(auc, 'amount', '0')
                const startedBy = _.get(auc, 'startedBy', '')
                const isClaimed = _.get(auc, 'isClaimed', false)
                const buyToken = _.get(auc, 'buyToken', 'PROTOCOL_TOKEN')
                const sellToken = _.get(auc, 'sellToken', 'COIN')
                const englishAuctionType: AuctionEventType = _.get(auc, 'englishAuctionType', 'SURPLUS')
                const englishAuctionConfiguration = _.get(auc, 'englishAuctionConfiguration', {
                    bidDuration: '',
                    bidIncrease: '1',
                    totalAuctionLength: '',
                    DEBT_amountSoldIncrease: '1',
                })
                const tokenSymbol = _.get(auc, 'tokenSymbol', undefined)

                const buyDecimals = englishAuctionType === 'SURPLUS' ? 18 : 45
                const sellDecimals = englishAuctionType === 'SURPLUS' ? 45 : 18

                const isOngoingAuction = Number(auctionDeadline) * 1000 > Date.now()
                const bidders = biddersList?.sort((a, b) => Number(a.createdAt) - Number(b.createdAt)) || []
                const kickBidder = {
                    bidder: startedBy,
                    buyAmount: utils.formatUnits(initialBid, buyDecimals),
                    createdAt,
                    sellAmount: utils.formatUnits(sellInitialAmount, sellDecimals),
                    createdAtTransaction,
                }
                const formattedInitialBids: IAuctionBidder[] = bidders.map((bid) => {
                    return {
                        bidder: bid.bidder,
                        buyAmount: utils.formatUnits(bid.bid, buyDecimals),
                        createdAt: bid.createdAt,
                        sellAmount: utils.formatUnits(bid.buyAmount, sellDecimals),
                        createdAtTransaction: bid.createdAtTransaction,
                    }
                })

                const initialBids = [...[kickBidder], ...formattedInitialBids]
                if (!isOngoingAuction && isClaimed) {
                    initialBids.push(formattedInitialBids[formattedInitialBids.length - 1])
                }

                return {
                    biddersList: initialBids.reverse(),
                    englishAuctionBids: initialBids,
                    winner,
                    buyToken,
                    englishAuctionType,
                    sellToken,
                    startedBy,
                    englishAuctionConfiguration,
                    auctionDeadline,
                    buyAmount: initialBids[0]?.buyAmount || '0',
                    buyInitialAmount: utils.formatUnits(initialBid, buyDecimals),
                    sellAmount: initialBids[0]?.sellAmount || utils.formatUnits(sellInitialAmount, sellDecimals),
                    sellInitialAmount: utils.formatUnits(sellInitialAmount, sellDecimals),
                    auctionId,
                    createdAt,
                    createdAtTransaction,
                    isClaimed,
                    tokenSymbol,
                }
            })

            const onGoingAuctions = filteredAuctions.filter(
                (auction: IAuction) => Number(auction.auctionDeadline) * 1000 > Date.now()
            )

            const myAuctions = filteredAuctions
                .filter(
                    (auction: IAuction) =>
                        auction.winner &&
                        userProxy &&
                        auction.winner.toLowerCase() === userProxy.toLowerCase() &&
                        !auction.isClaimed
                )
                .sort(
                    (a: { auctionDeadline: any }, b: { auctionDeadline: any }) =>
                        Number(b.auctionDeadline) - Number(a.auctionDeadline)
                )

            const auctionsToRestart = filteredAuctions
                ?.filter((auction: IAuction) => !auction.englishAuctionBids?.length)
                ?.sort(
                    (a: { auctionDeadline: any }, b: { auctionDeadline: any }) =>
                        Number(b.auctionDeadline) - Number(a.auctionDeadline)
                )

            const auctionsData = Array.from(
                new Set([...onGoingAuctions, ...myAuctions, ...auctionsToRestart, ...filteredAuctions])
            )
            setState(auctionsData)
        } else {
            setState(null)
        }
    }, [auctionsList, userProxy])

    return state
}

export function useCollateralAuctions(tokenSymbol: string): ICollateralAuction[] | null {
    const { auctionModel } = useStoreState((state) => state)

    const auctionsList = auctionModel.collateralAuctions[tokenSymbol]

    const auctions = (function () {
        if (auctionsList) {
            if (auctionsList.length === 0) {
                return []
            }

            const filteredAuctions = auctionsList.map((auc: SDKCollateralAuction, index) => {
                const { createdAt, createdAtTransaction, amountToSell, amountToRaise, biddersList } = auc

                const startedBy = _.get(auc, 'startedBy', '')
                // Amount to sell = collateral
                // Amout to raise = hai
                const collateralBought = biddersList.reduce((acc, bid) => acc.add(bid.bid), BigNumber.from('0'))
                const remainingCollateral = BigNumber.from(amountToSell).sub(collateralBought).toString()

                const raised = biddersList.reduce((acc, bid) => acc.add(bid.buyAmount), BigNumber.from('0'))
                const amountToRaiseE18 = gebUtils.decimalShift(
                    BigNumber.from(amountToRaise),
                    floatsTypes.WAD - floatsTypes.RAD
                )
                const remainingToRaiseE18 = amountToRaiseE18.sub(raised).toString()

                const discPerSecondE18 = gebUtils.decimalShift(BigNumber.from(auc.perSecondDiscountUpdateRate), -9)
                const disountsDiffE18 = BigNumber.from(auc.maxDiscount)
                    .mul(BigNumber.from(10).pow(18))
                    .div(BigNumber.from(auc.startingDiscount))
                const timeToMaxDiscount =
                    Math.log(Number(parseWad(disountsDiffE18))) / Math.log(Number(parseWad(discPerSecondE18)))
                const unixNow = Math.floor(new Date().getTime() / 1000)
                const maxDiscountTimestamp = Math.floor(unixNow + timeToMaxDiscount).toString()

                const kickBidder = {
                    bidder: startedBy,
                    buyAmount: '0',
                    createdAt,
                    bid: '0',
                    createdAtTransaction,
                }

                const initialBids = [...[kickBidder], ...biddersList]

                return {
                    ...auc,
                    biddersList: initialBids.reverse(),
                    startedBy,
                    remainingToRaiseE18,
                    remainingCollateral,
                    tokenSymbol,
                    maxDiscountTimestamp,
                }
            })

            const onGoingAuctions = filteredAuctions.filter(
                (auction) => !BigNumber.from(auction.remainingCollateral).isZero()
            )

            const auctionsData = Array.from(new Set([...onGoingAuctions, ...filteredAuctions]))

            return auctionsData
        } else {
            return null
        }
    })()

    return auctions
}

// start surplus auction
export function useStartAuction() {
    const geb = useGeb()
    const { transactionsModel: transactionsActions, popupsModel: popupsActions } = useStoreActions((store) => store)

    const { auctionModel: auctionsState } = useStoreState((state) => state)
    const auctionsData = auctionsState.auctionsData as AuctionData

    const { account, library } = useActiveWeb3React()
    const [surplusAmountToSell, setSurplusAmountToSell] = useState<string>('')
    const [debtAmountToSell, setDebtAmountToSell] = useState<string>('')
    const [protocolTokensOffered, setProtocolTokensToOffer] = useState<string>('')
    const [systemSurplus, setSystemSurplus] = useState<string>('')
    const [systemDebt, setSystemDebt] = useState<string>('')

    const [surplusRequiredToAuction, setAmountToStartSurplusAuction] = useState<string>('')
    const [debtRequiredToAuction, setAmountToStartDebtAuction] = useState<string>('')
    const lastSurplusTime = auctionsData?.accountingEngineData?.lastSurplusTime
    const surplusDelay = auctionsData?.accountingEngineData?.accountingEngineParams?.surplusDelay

    useEffect(() => {
        if (auctionsData) {
            const coinBalance = auctionsData.accountingEngineData.coinBalance
            const unqueuedUnauctionedDebt = auctionsData.accountingEngineData.unqueuedUnauctionedDebt

            let systemSurplus = coinBalance.sub(unqueuedUnauctionedDebt)
            let systemDebt = unqueuedUnauctionedDebt.sub(coinBalance)

            const surplusAmount = auctionsData.accountingEngineData?.accountingEngineParams.surplusAmount
            const surplusBuffer = auctionsData?.accountingEngineData?.accountingEngineParams.surplusBuffer
            const surplusRequiredToAuction = surplusAmount.add(surplusBuffer).sub(systemSurplus)

            const debtAmountToSell = auctionsData.accountingEngineData?.accountingEngineParams.debtAuctionBidSize
            const protocolTokensOffered =
                auctionsData.accountingEngineData?.accountingEngineParams.debtAuctionMintedTokens
            const debtRequiredToAuction = debtAmountToSell.sub(systemDebt)

            systemSurplus = systemSurplus < BigNumber.from(0) ? BigNumber.from(0) : systemSurplus
            systemDebt = systemDebt < BigNumber.from(0) ? BigNumber.from(0) : systemDebt
            setSystemSurplus(radToFixed(systemSurplus).toString())
            setSystemDebt(radToFixed(systemDebt).toString())

            setAmountToStartSurplusAuction(radToFixed(surplusRequiredToAuction).toString())
            setAmountToStartDebtAuction(radToFixed(debtRequiredToAuction).toString())

            setSurplusAmountToSell(radToFixed(surplusAmount).toString())
            setDebtAmountToSell(radToFixed(debtAmountToSell).toString())
            setProtocolTokensToOffer(wadToFixed(protocolTokensOffered).toString())
        }
    }, [auctionsData])

    // Check surplus cooldown. Time now > lastSurplusTime + surplusDelay
    const surplusCooldownDone = useMemo(
        () =>
            lastSurplusTime && surplusDelay
                ? new Date() > new Date(lastSurplusTime.add(surplusDelay).mul(1000).toNumber())
                : false,
        [lastSurplusTime, surplusDelay]
    )

    // if delta to start surplus auction is negative and cooldown is over we can allow to start surplus auction
    const allowStartSurplusAuction = useMemo(() => {
        if (!surplusAmountToSell || !surplusRequiredToAuction) return false
        return surplusRequiredToAuction <= '0' && surplusCooldownDone
    }, [surplusAmountToSell, surplusRequiredToAuction, surplusCooldownDone])

    // if delta to start debt auction is negative we can allow to start surplus auction
    const allowStartDebtAuction = useMemo(() => {
        if (!debtAmountToSell || !debtRequiredToAuction) return false
        return debtRequiredToAuction <= '0'
    }, [debtAmountToSell, debtRequiredToAuction])

    const startSurplusAcution = async function () {
        if (!library || !account) throw new Error('No library or account')

        const txResponse = await geb.contracts.accountingEngine.auctionSurplus()

        if (!txResponse) throw new Error('No transaction request!')

        if (txResponse) {
            const { hash, chainId } = txResponse
            transactionsActions.addTransaction({
                chainId,
                hash,
                from: txResponse.from,
                summary: 'Starting surplus auction',
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

    const startDebtAcution = async function () {
        if (!library || !account) throw new Error('No library or account')

        const txResponse = await geb.contracts.accountingEngine.auctionDebt()

        if (!txResponse) throw new Error('No transaction request!')

        if (txResponse) {
            const { hash, chainId } = txResponse
            transactionsActions.addTransaction({
                chainId,
                hash,
                from: txResponse.from,
                summary: 'Starting debt auction',
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

    return {
        startSurplusAcution,
        startDebtAcution,
        surplusAmountToSell,
        debtAmountToSell,
        protocolTokensOffered,
        systemSurplus,
        systemDebt,
        allowStartSurplusAuction,
        allowStartDebtAuction,
        deltaToStartDebtAuction: debtRequiredToAuction,
        deltaToStartSurplusAuction: surplusRequiredToAuction,
        surplusCooldownDone,
    }
}
