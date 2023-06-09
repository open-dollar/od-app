import { action, Action, thunk, Thunk } from 'easy-peasy'
import { StoreModel } from '.'
import {
    handleAuctionBid,
    handleAuctionClaim,
    handleClaimInternalBalance,
} from '../services/blockchain'
import { fetchAuctions, fetchInternalBalance } from '../services/graphql'
import { IAuction, IAuctionBid } from '../utils/interfaces'

export interface AuctionsModel {
    operation: number
    amount: string
    internalBalance: string
    protInternalBalance: string
    coinBalances: {
        rai: string
        flx: string
    }
    isSubmitting: boolean
    autctionsData: Array<IAuction>
    selectedAuction: IAuction | null
    fetchAuctions: Thunk<
        AuctionsModel,
        { address: string; type: string },
        any,
        StoreModel
    >
    auctionBid: Thunk<AuctionsModel, IAuctionBid, any, StoreModel>
    auctionClaimInternalBalance: Thunk<
        AuctionsModel,
        IAuctionBid,
        any,
        StoreModel
    >
    auctionClaim: Thunk<AuctionsModel, IAuctionBid, any, StoreModel>
    setAuctionsData: Action<AuctionsModel, Array<IAuction>>
    setSelectedAuction: Action<AuctionsModel, IAuction | null>
    setOperation: Action<AuctionsModel, number>
    setAmount: Action<AuctionsModel, string>
    setCoinBalances: Action<
        AuctionsModel,
        {
            rai: string
            flx: string
        }
    >
    setIsSubmitting: Action<AuctionsModel, boolean>
    setInternalBalance: Action<AuctionsModel, string>
    setProtInternalBalance: Action<AuctionsModel, string>
}

const auctionsModel: AuctionsModel = {
    operation: 0,
    autctionsData: [],
    internalBalance: '0',
    protInternalBalance: '0',
    isSubmitting: false,
    coinBalances: {
        rai: '',
        flx: '',
    },
    selectedAuction: null,
    amount: '',
    fetchAuctions: thunk(
        async (actions, payload, { getState, getStoreActions }) => {
            const storeActions = getStoreActions()
            const res = await fetchAuctions({
                address: payload.address.toLowerCase(),
                type: payload.type,
            })
            if (!res) return
            if (res.userProxies && res.userProxies.length > 0) {
                const proxyAddress = res.userProxies[0].address
                const balanceRes = await fetchInternalBalance(proxyAddress)

                if (balanceRes && balanceRes.internalCoinBalances.length > 0) {
                    actions.setInternalBalance(
                        balanceRes.internalCoinBalances[0].balance
                    )
                }
                if (balanceRes && balanceRes.protInternalBalance.length > 0) {
                    actions.setProtInternalBalance(
                        balanceRes.protInternalBalance[0].balance
                    )
                }
                storeActions.connectWalletModel.setProxyAddress(proxyAddress)

                if (res.userProxies[0].coinAllowance) {
                    storeActions.connectWalletModel.setCoinAllowance(
                        res.userProxies[0].coinAllowance.amount
                    )
                }
                if (res.userProxies[0].protAllowance) {
                    storeActions.connectWalletModel.setProtAllowance(
                        res.userProxies[0].protAllowance.amount
                    )
                }
            } else {
                storeActions.connectWalletModel.setProxyAddress('')
            }

            if (res.user) {
                storeActions.connectWalletModel.setIsUserCreated(true)
            }
            if (res.raiBalance && res.raiBalance.length > 0) {
                actions.setCoinBalances({
                    ...getState().coinBalances,
                    rai: res.raiBalance[0].balance,
                })
            }
            if (res.protBalance && res.protBalance.length > 0) {
                actions.setCoinBalances({
                    ...getState().coinBalances,
                    flx: res.protBalance[0].balance,
                })
            }

            actions.setAuctionsData(res.englishAuctions)
        }
    ),
    auctionBid: thunk(async (actions, payload, { getStoreActions }) => {
        const storeActions = getStoreActions()
        const txResponse = await handleAuctionBid(payload)
        if (txResponse) {
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

    auctionClaimInternalBalance: thunk(
        async (actions, payload, { getStoreActions }) => {
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
        }
    ),
    setOperation: action((state, payload) => {
        state.operation = payload
    }),
    setAuctionsData: action((state, payload) => {
        state.autctionsData = payload
    }),
    setSelectedAuction: action((state, payload) => {
        state.selectedAuction = payload
    }),
    setAmount: action((state, payload) => {
        state.amount = payload
    }),
    setCoinBalances: action((state, payload) => {
        state.coinBalances = payload
    }),
    setIsSubmitting: action((state, payload) => {
        state.isSubmitting = payload
    }),
    setInternalBalance: action((state, payload) => {
        state.internalBalance = payload
    }),
    setProtInternalBalance: action((state, payload) => {
        state.protInternalBalance = payload
    }),
}

export default auctionsModel
