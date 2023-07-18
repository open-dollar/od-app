import { action, Action, thunk, Thunk } from 'easy-peasy'
import { StoreModel } from '~/model'
import { NETWORK_ID } from '~/connectors'
import { handleDepositAndBorrow, handleRepayAndWithdraw } from '~/services/blockchain'
import { fetchUserSafes } from '~/services/safes'
import {
    DEFAULT_SAFE_STATE,
    timeout,
    handleWrapEther,
    WrapEtherProps,
    IFetchSafesPayload,
    ILiquidationData,
    ISafe,
    ISafeData,
    ISafePayload,
} from '~/utils'

export interface SafeModel {
    list: Array<ISafe>
    safeCreated: boolean
    singleSafe: ISafe | null
    operation: number
    targetedCRatio: number
    totalEth: string
    isMaxWithdraw: boolean
    totalHAI: string
    amount: string
    isES: boolean
    isUniSwapPoolChecked: boolean
    stage: number
    isSuccessfulTx: boolean
    safeData: ISafeData
    liquidationData: ILiquidationData | null
    uniSwapPool: ISafeData
    depositAndBorrow: Thunk<SafeModel, ISafePayload & { safeId?: string }, any, StoreModel>
    repayAndWithdraw: Thunk<SafeModel, ISafePayload & { safeId: string }, any, StoreModel>
    fetchUserSafes: Thunk<SafeModel, IFetchSafesPayload, any, StoreModel>
    // collectETH: Thunk<
    //     SafeModel,
    //     { signer: JsonRpcSigner; safe: ISafe },
    //     any,
    //     StoreModel
    // >
    setIsSafeCreated: Action<SafeModel, boolean>
    setList: Action<SafeModel, Array<ISafe>>
    setSingleSafe: Action<SafeModel, ISafe | null>
    setOperation: Action<SafeModel, number>
    setTotalEth: Action<SafeModel, string>
    setTotalHAI: Action<SafeModel, string>
    setIsES: Action<SafeModel, boolean>
    setLiquidationData: Action<SafeModel, ILiquidationData>
    setSafeData: Action<SafeModel, ISafeData>
    setUniSwapPool: Action<SafeModel, ISafeData>
    setIsUniSwapPoolChecked: Action<SafeModel, boolean>
    setStage: Action<SafeModel, number>
    setIsSuccessfulTx: Action<SafeModel, boolean>
    setAmount: Action<SafeModel, string>
    setTargetedCRatio: Action<SafeModel, number>
    setIsMaxWithdraw: Action<SafeModel, boolean>
    wrapEther: Thunk<SafeModel, WrapEtherProps, any, StoreModel>
}

const safeModel: SafeModel = {
    list: [],
    safeCreated: false,
    isMaxWithdraw: false,
    operation: 0,
    amount: '',
    targetedCRatio: 0,
    singleSafe: null,
    totalEth: '0.00',
    totalHAI: '0.00',
    isSuccessfulTx: true,
    isES: true,
    isUniSwapPoolChecked: true,
    stage: 0,
    safeData: DEFAULT_SAFE_STATE,
    liquidationData: null,
    uniSwapPool: DEFAULT_SAFE_STATE,
    depositAndBorrow: thunk(async (actions, payload, { getStoreActions }) => {
        const storeActions = getStoreActions()
        const txResponse = await handleDepositAndBorrow(payload.signer, payload.safeData, payload.safeId)
        if (txResponse) {
            const { hash, chainId } = txResponse
            storeActions.transactionsModel.addTransaction({
                chainId,
                hash,
                from: txResponse.from,
                summary: payload.safeId ? 'Modifying Safe' : 'Creating a new Safe',
                addedTime: new Date().getTime(),
                originalTx: txResponse,
            })
            storeActions.popupsModel.setIsWaitingModalOpen(true)
            if (!payload.safeId) {
                storeActions.popupsModel.setWaitingPayload({
                    title: 'Transaction Submitted',
                    text: 'Adding a new safe...',
                    status: 'success',
                    isCreate: true,
                })
            } else {
                storeActions.popupsModel.setWaitingPayload({
                    title: 'Transaction Submitted',
                    hash: txResponse.hash,
                    status: 'success',
                })
            }

            actions.setStage(0)
            actions.setUniSwapPool(DEFAULT_SAFE_STATE)
            actions.setSafeData(DEFAULT_SAFE_STATE)
            await txResponse.wait()
            storeActions.connectWalletModel.setForceUpdateTokens(true)
        } else {
            storeActions.connectWalletModel.setIsStepLoading(false)
            storeActions.connectWalletModel.setStep(2)
        }
    }),
    repayAndWithdraw: thunk(async (actions, payload, { getStoreActions, getStoreState }) => {
        const storeActions = getStoreActions()
        const txResponse = await handleRepayAndWithdraw(payload.signer, payload.safeData, payload.safeId)
        if (txResponse) {
            const { hash, chainId } = txResponse
            storeActions.transactionsModel.addTransaction({
                chainId,
                hash,
                from: txResponse.from,
                summary: 'Modifying Safe',
                addedTime: new Date().getTime(),
                originalTx: txResponse,
            })
            storeActions.popupsModel.setIsWaitingModalOpen(true)
            storeActions.popupsModel.setWaitingPayload({
                title: 'Transaction Submitted',
                hash: txResponse.hash,
                status: 'success',
            })

            actions.setStage(0)
            actions.setUniSwapPool(DEFAULT_SAFE_STATE)
            actions.setSafeData(DEFAULT_SAFE_STATE)
            await txResponse.wait()
            storeActions.connectWalletModel.setForceUpdateTokens(true)
        }
    }),
    // collectETH: thunk(async (actions, payload, { getStoreActions }) => {
    //     const storeActions = getStoreActions()
    //     const txResponse = await handleCollectETH(payload.signer, payload.safe)
    //     if (txResponse) {
    //         const { hash, chainId } = txResponse
    //         storeActions.transactionsModel.addTransaction({
    //             chainId,
    //             hash,
    //             from: txResponse.from,
    //             summary: 'Collecting ETH',
    //             addedTime: new Date().getTime(),
    //             originalTx: txResponse,
    //         })
    //         storeActions.popupsModel.setIsWaitingModalOpen(true)
    //         storeActions.popupsModel.setWaitingPayload({
    //             title: 'Transaction Submitted',
    //             hash: txResponse.hash,
    //             status: 'success',
    //         })
    //         await txResponse.wait()
    //     }
    // }),
    fetchUserSafes: thunk(async (actions, payload, { getStoreActions, getState }) => {
        const storeActions = getStoreActions()
        const state = getState()
        const { isSuccessfulTx } = state
        const fetched = await fetchUserSafes(payload)
        if (fetched) {
            actions.setList(fetched.userSafes)
            if (fetched.userSafes.length > 0) {
                actions.setIsSafeCreated(true)
                storeActions.connectWalletModel.setStep(2)
            } else if (!fetched.userSafes.length && !isSuccessfulTx) {
                actions.setIsSafeCreated(false)
                storeActions.connectWalletModel.setIsStepLoading(false)
            } else {
                actions.setIsSafeCreated(false)
            }
            actions.setLiquidationData(fetched.liquidationData)
            const chainId = NETWORK_ID
            if (fetched.availableHAI && chainId) {
                storeActions.connectWalletModel.updateHaiBalance({
                    chainId,
                    balance: fetched.availableHAI,
                })
            }
            await timeout(200)
            return fetched
        }
    }),

    wrapEther: thunk(async (actions, payload, { getStoreActions }) => {
        const storeActions = getStoreActions()
        const txResponse = await handleWrapEther(payload)
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

    setIsSafeCreated: action((state, payload) => {
        state.safeCreated = payload
    }),
    setList: action((state, payload) => {
        state.list = payload
    }),
    setSingleSafe: action((state, payload) => {
        state.singleSafe = payload
    }),
    setOperation: action((state, payload) => {
        state.operation = payload
    }),
    setTotalEth: action((state, payload) => {
        state.totalEth = payload
    }),
    setTotalHAI: action((state, payload) => {
        state.totalHAI = payload
    }),
    setIsES: action((state, payload) => {
        state.isES = payload
    }),

    setLiquidationData: action((state, payload) => {
        state.liquidationData = payload
    }),

    setSafeData: action((state, payload) => {
        state.safeData = payload
    }),
    setUniSwapPool: action((state, payload) => {
        state.uniSwapPool = payload
    }),
    setIsUniSwapPoolChecked: action((state, payload) => {
        state.isUniSwapPoolChecked = payload
    }),
    setStage: action((state, payload) => {
        state.stage = payload
    }),
    setIsSuccessfulTx: action((state, payload) => {
        state.isSuccessfulTx = payload
    }),
    setAmount: action((state, payload) => {
        state.amount = payload
    }),
    setTargetedCRatio: action((state, payload) => {
        state.targetedCRatio = payload
    }),
    setIsMaxWithdraw: action((state, payload) => {
        state.isMaxWithdraw = payload
    }),
}

export default safeModel
