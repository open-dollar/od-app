import { Geb } from '@hai-on-op/sdk'
import { action, Action, thunk, Thunk } from 'easy-peasy'

// temporary cast
import { ISurplusAuction as SDKAuction, ICollateralAuction } from '@hai-on-op/sdk/lib/schema/auction'
import {
    handleAuctionBid,
    handleAuctionBuy,
    handleAuctionClaim,
    handleClaimInternalBalance,
    IAuctionBuy,
    IClaimInternalBalance,
} from '~/utils'
import { CollateralAuctionsData, fetchCollateralAuctionData } from '~/utils/virtual/virtualCollateralAuctionData'
import { AuctionData, fetchAuctionData } from '~/utils/virtual/virtualAuctionData'
import { IAuctionBid, IAuction, AuctionEventType } from '~/types'
import { StoreModel } from '~/model'

export interface AuctionModel {
    fetchAuctions: Thunk<AuctionModel, { geb: Geb; type: AuctionEventType; tokenSymbol?: string }>

    amount: string
    setAmount: Action<AuctionModel, string>

    collateralAmount: string
    setCollateralAmount: Action<AuctionModel, string>

    operation: number
    setOperation: Action<AuctionModel, number>

    // protInternalBalance = user's KITE balance in the protocol
    protInternalBalance: string
    setProtInternalBalance: Action<AuctionModel, string>

    // internalbalance = user's HAI balance in the protocol
    internalBalance: string
    setInternalBalance: Action<AuctionModel, string>

    coinBalances: {
        hai: string
        kite: string
    }
    setCoinBalances: Action<
        AuctionModel,
        {
            hai: string
            kite: string
        }
    >

    selectedAuction: IAuction | null
    setSelectedAuction: Action<AuctionModel, IAuction | null>

    selectedCollateralAuction: ICollateralAuction | null
    setSelectedCollateralAuction: Action<AuctionModel, ICollateralAuction | null>

    auctionBid: Thunk<AuctionModel, IAuctionBid, any, StoreModel>
    auctionClaimInternalBalance: Thunk<AuctionModel, IClaimInternalBalance, any, StoreModel>
    auctionClaim: Thunk<AuctionModel, IAuctionBid, any, StoreModel>

    auctionBuy: Thunk<AuctionModel, IAuctionBuy, any, StoreModel>

    isSubmitting: boolean
    setIsSubmitting: Action<AuctionModel, boolean>

    auctionsData: AuctionData | null
    setAuctionsData: Action<AuctionModel, AuctionData>
    fetchAuctionsData: Thunk<AuctionModel, { geb: Geb; proxyAddress: string }, StoreModel>

    surplusAuctions: SDKAuction[] | null
    setSurplusAuctions: Action<AuctionModel, SDKAuction[] | null>

    debtAuctions: SDKAuction[] | null
    setDebtAuctions: Action<AuctionModel, SDKAuction[] | null>

    collateralAuctions: { [key: string]: ICollateralAuction[] }
    setCollateralAuctions: Action<AuctionModel, { collateral: string; auctions: ICollateralAuction[] }>

    collateralData: CollateralAuctionsData[] | null
    setCollateralData: Action<AuctionModel, CollateralAuctionsData[]>
    fetchCollateralData: Thunk<
        AuctionModel,
        {
            geb: Geb
            collateral: string
            auctionIds: string[]
        },
        CollateralAuctionsData[]
    >
}

const auctionModel: AuctionModel = {
    surplusAuctions: null,
    collateralAuctions: {},
    debtAuctions: null,
    fetchAuctions: thunk(async (actions, { geb, type, tokenSymbol }) => {
        if (type === 'SURPLUS') {
            const surplusAuctionsFetched = await geb.auctions.getSurplusAuctions(0)
            const surplusAuctions = surplusAuctionsFetched.auctions.map((auction) => {
                return {
                    ...auction,
                    englishAuctionType: 'SURPLUS',
                    sellToken: 'COIN',
                    buyToken: 'PROTOCOL_TOKEN',
                }
            })
            if (surplusAuctions) {
                actions.setSurplusAuctions(surplusAuctions)
            }
        } else if (type === 'DEBT') {
            const debtAuctionsFetched = await geb.auctions.getDebtAuctions(0)
            const debtAuctions = debtAuctionsFetched.auctions.map((auction) => {
                return {
                    ...auction,
                    englishAuctionType: 'DEBT',
                    sellToken: 'PROTOCOL_TOKEN',
                    buyToken: 'COIN',
                }
            })
            if (debtAuctions) {
                actions.setDebtAuctions(debtAuctions)
            }
        } else if (type === 'COLLATERAL') {
            const collateralAuctionsFetched = await geb.auctions.getCollateralAuctions(0, tokenSymbol || 'WETH')

            const collateralAuctions = collateralAuctionsFetched.auctions.map((auction) => {
                return {
                    ...auction,
                    englishAuctionType: 'COLLATERAL',
                    sellToken: 'PROTOCOL_TOKEN',
                    buyToken: 'COIN',
                    tokenSymbol: tokenSymbol,
                    auctionDeadline: '1699122709',
                }
            })
            if (collateralAuctions && tokenSymbol) {
                actions.setCollateralAuctions({ collateral: tokenSymbol, auctions: collateralAuctions })
            }
        }
    }),
    setSurplusAuctions: action((state, payload) => {
        state.surplusAuctions = payload
    }),
    setDebtAuctions: action((state, payload) => {
        state.debtAuctions = payload
    }),
    setCollateralAuctions: action((state, { collateral, auctions }) => {
        state.collateralAuctions = { ...state.collateralAuctions, [collateral]: auctions }
    }),

    amount: '',
    setAmount: action((state, payload) => {
        state.amount = payload
    }),

    operation: 0,
    setOperation: action((state, payload) => {
        state.operation = payload
    }),

    collateralAmount: '',
    setCollateralAmount: action((state, payload) => {
        state.collateralAmount = payload
    }),

    protInternalBalance: '',
    setProtInternalBalance: action((state, payload) => {
        state.protInternalBalance = payload
    }),

    internalBalance: '',
    setInternalBalance: action((state, payload) => {
        state.internalBalance = payload
    }),

    coinBalances: {
        hai: '',
        kite: '',
    },
    setCoinBalances: action((state, payload) => {
        state.coinBalances = payload
    }),

    selectedAuction: null,
    setSelectedAuction: action((state, payload) => {
        state.selectedAuction = payload
    }),

    selectedCollateralAuction: null,
    setSelectedCollateralAuction: action((state, payload) => {
        state.selectedCollateralAuction = payload
    }),

    auctionBid: thunk(async (actions, payload, { getStoreActions }) => {
        const storeActions = getStoreActions()
        const txResponse = await handleAuctionBid(payload)
        if (txResponse) {
            actions.setIsSubmitting(true)
            const { hash, chainId } = txResponse
            storeActions.transactionsModel.addTransaction({
                chainId,
                hash,
                from: txResponse.from,
                summary: payload.title,
                addedTime: new Date().getTime(),
                originalTx: txResponse,
            })
            storeActions.popupsModel.setIsWaitingModalOpen(true)
            storeActions.popupsModel.setWaitingPayload({
                title: 'Transaction Submitted',
                hash: txResponse.hash,
                status: 'success',
            })
            await txResponse.wait()
            actions.setIsSubmitting(false)
        }
    }),

    auctionBuy: thunk(async (actions, payload, { getStoreActions }) => {
        const storeActions = getStoreActions()
        const txResponse = await handleAuctionBuy(payload)
        if (txResponse) {
            actions.setIsSubmitting(true)
            const { hash, chainId } = txResponse
            storeActions.transactionsModel.addTransaction({
                chainId,
                hash,
                from: txResponse.from,
                summary: payload.title,
                addedTime: new Date().getTime(),
                originalTx: txResponse,
            })
            storeActions.popupsModel.setIsWaitingModalOpen(true)
            storeActions.popupsModel.setWaitingPayload({
                title: 'Transaction Submitted',
                hash: txResponse.hash,
                status: 'success',
            })
            await txResponse.wait()
            actions.setIsSubmitting(false)
        }
    }),

    auctionClaim: thunk(async (actions, payload, { getStoreActions }) => {
        const storeActions = getStoreActions()
        const txResponse = await handleAuctionClaim(payload)
        if (txResponse) {
            actions.setIsSubmitting(true)
            const { hash, chainId } = txResponse
            storeActions.transactionsModel.addTransaction({
                chainId,
                hash,
                from: txResponse.from,
                summary: payload.title,
                addedTime: new Date().getTime(),
                originalTx: txResponse,
            })
            storeActions.popupsModel.setIsWaitingModalOpen(true)
            storeActions.popupsModel.setWaitingPayload({
                title: 'Transaction Submitted',
                hash: txResponse.hash,
                status: 'success',
            })
            await txResponse.wait()
            actions.setIsSubmitting(false)
        }
    }),

    auctionClaimInternalBalance: thunk(async (actions, payload, { getStoreActions }) => {
        const storeActions = getStoreActions()
        const txResponse = await handleClaimInternalBalance(payload)
        if (txResponse) {
            actions.setIsSubmitting(true)
            const { hash, chainId } = txResponse
            storeActions.transactionsModel.addTransaction({
                chainId,
                hash,
                from: txResponse.from,
                summary: payload.title,
                addedTime: new Date().getTime(),
                originalTx: txResponse,
            })
            storeActions.popupsModel.setIsWaitingModalOpen(true)
            storeActions.popupsModel.setWaitingPayload({
                title: 'Transaction Submitted',
                hash: txResponse.hash,
                status: 'success',
            })
            await txResponse.wait()
            actions.setIsSubmitting(false)
        }
    }),

    isSubmitting: false,
    setIsSubmitting: action((state, payload) => {
        state.isSubmitting = payload
    }),
    setAuctionsData: action((state, payload) => {
        state.auctionsData = payload
    }),
    fetchAuctionsData: thunk(async (actions, { geb, proxyAddress }) => {
        const fetched = await fetchAuctionData(geb, proxyAddress)
        if (fetched) {
            actions.setAuctionsData(fetched)
        }
    }),
    auctionsData: null,

    collateralData: null,
    setCollateralData: action((state, payload) => {
        state.collateralData = payload
    }),
    fetchCollateralData: thunk(async (state, { geb, collateral, auctionIds }) => {
        const fetched = await fetchCollateralAuctionData(geb, collateral, auctionIds)
        state.setCollateralData(fetched)
    }),
}

export default auctionModel
