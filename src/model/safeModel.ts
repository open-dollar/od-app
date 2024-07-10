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
import { Geb } from '@opendollar/sdk'

export interface SafeModel {
    list: Array<ISafe>
    safeCreated: boolean
    singleSafe: ISafe | null
    operation: number
    targetedCRatio: number
    totalEth: string
    isMaxWithdraw: boolean
    totalOD: string
    amount: string
    isES: boolean
    isUniSwapPoolChecked: boolean
    stage: number
    isSuccessfulTx: boolean
    safeData: ISafeData
    liquidationData: ILiquidationData | null
    uniSwapPool: ISafeData
    depositAndBorrow: Thunk<
        SafeModel,
        ISafePayload & { safeId?: string } & { geb: Geb } & { account: string } & { depositAmountUSD: number } & {
            borrowAmountUSD?: number
        },
        any,
        StoreModel
    >
    repayAndWithdraw: Thunk<
        SafeModel,
        ISafePayload & { safeId: string } & { geb: Geb } & { account: string } & { withdrawAmountUSD: number } & {
            repayAmountUSD?: number
        },
        any,
        StoreModel
    >
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
    setTotalOD: Action<SafeModel, string>
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
    wrapEther: Thunk<SafeModel, WrapEtherProps & { geb: Geb }, any, StoreModel>
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
    totalOD: '0.00',
    isSuccessfulTx: true,
    isES: true,
    isUniSwapPoolChecked: true,
    stage: 0,
    safeData: DEFAULT_SAFE_STATE,
    liquidationData: null,
    uniSwapPool: DEFAULT_SAFE_STATE,
    depositAndBorrow: thunk(async (actions, payload, { getStoreActions }) => {
        const storeActions = getStoreActions()
        const txResponse = await handleDepositAndBorrow(payload.signer, payload.safeData, payload.safeId, payload.geb)
        if (txResponse) {
            const { hash, chainId } = txResponse
            storeActions.transactionsModel.addTransaction({
                chainId,
                hash,
                from: txResponse.from,
                summary: payload.safeId ? 'Modifying Vault' : 'Creating a new Vault',
                addedTime: new Date().getTime(),
                originalTx: txResponse,
            })
            storeActions.popupsModel.setIsWaitingModalOpen(true)
            if (!payload.safeId) {
                storeActions.popupsModel.setWaitingPayload({
                    title: 'Transaction Submitted',
                    text: 'Adding a new vault...',
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
            await txResponse.wait().then((receipt) => {
                if (receipt && receipt.status === 1 && window?._paq) {
                    if (payload.safeData.leftInput !== '0') {
                        window._paq.push(['trackEvent', 'Vault', 'Deposit', payload.account])
                        window._paq.push([
                            'addEcommerceItem',
                            payload.safeData.collateral + '_Deposited', // (required) SKU: Product unique identifier
                            payload.safeData.collateral + '_Deposited', // (optional) Product name
                            'Collateral_Deposited', // (optional) Product category
                        ])
                        window._paq.push([
                            'trackEcommerceOrder',
                            (Math.random() * (2 - 1) + 1).toString(), // (required) unique order ID between 1 and 2
                            payload.depositAmountUSD,
                        ])
                    }

                    if (payload.safeData.rightInput !== '0') {
                        window._paq.push(['trackEvent', 'Vault', 'Borrow', payload.account])
                        window._paq.push([
                            'addEcommerceItem',
                            'OD_Borrowed', // (required) SKU: Product unique identifier
                            'OD_Borrowed', // (optional) Product name
                            'Debt_Borrowed', // (optional) Product category
                        ])
                        window._paq.push([
                            'trackEcommerceOrder',
                            (Math.random() * (2 - 1) + 1).toString(), // (required) unique order ID between 1 and 2
                            payload.depositAmountUSD,
                        ])
                    }
                }
            })
            storeActions.connectWalletModel.setForceUpdateTokens(true)
        } else {
            storeActions.connectWalletModel.setIsStepLoading(false)
            storeActions.connectWalletModel.setStep(2)
        }
    }),
    repayAndWithdraw: thunk(async (actions, payload, { getStoreActions, getStoreState }) => {
        const storeActions = getStoreActions()
        const txResponse = await handleRepayAndWithdraw(payload.signer, payload.safeData, payload.safeId, payload.geb)
        if (txResponse) {
            const { hash, chainId } = txResponse
            storeActions.transactionsModel.addTransaction({
                chainId,
                hash,
                from: txResponse.from,
                summary: 'Modifying Vault',
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
            await txResponse.wait().then((receipt) => {
                if (receipt && receipt.status === 1 && window?._paq) {
                    if (payload.safeData.rightInput !== '0') {
                        window._paq.push(['trackEvent', 'Vault', 'Repay', payload.account])
                        window._paq.push([
                            'addEcommerceItem',
                            'OD_Repaid', // (required) SKU: Product unique identifier
                            'OD_Repaid', // (optional) Product name
                            'Debt_Repaid', // (optional) Product category
                        ])
                        window._paq.push([
                            'trackEcommerceOrder',
                            (Math.random() * (2 - 1) + 1).toString(), // (required) unique order ID between 1 and 2
                            payload.repayAmountUSD,
                        ])
                    }
                    if (payload.safeData.leftInput !== '0') {
                        window._paq.push(['trackEvent', 'Vault', 'Withdraw', payload.account])
                        window._paq.push([
                            'addEcommerceItem',
                            payload.safeData.collateral + '_Withdrawn', // (required) SKU: Product unique identifier
                            payload.safeData.collateral + '_Withdrawn', // (optional) Product name
                            'Collateral_Withdrawn', // (optional) Product category
                        ])
                        window._paq.push([
                            'trackEcommerceOrder',
                            (Math.random() * (2 - 1) + 1).toString(), // (required) unique order ID between 1 and 2
                            payload.withdrawAmountUSD,
                        ])
                    }
                }
            })
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
        console.log('fetchUserSafes')
        const storeActions = getStoreActions()
        const state = getState()
        const { isSuccessfulTx } = state
        let fetched
        try {
            fetched = await fetchUserSafes(payload)
        } catch (e) {
            storeActions.popupsModel.setIsWaitingModalOpen(false)
            console.debug('Failed to fetch user safes', e)
        }
        if (fetched) {
            storeActions.popupsModel.setIsWaitingModalOpen(false)
            actions.setList(fetched.userSafes)
            if (fetched.userSafes.length > 0) {
                actions.setIsSafeCreated(true)
                // storeActions.connectWalletModel.setStep(2)
            } else if (!fetched.userSafes.length && !isSuccessfulTx) {
                actions.setIsSafeCreated(false)
                storeActions.connectWalletModel.setIsStepLoading(false)
            } else {
                actions.setIsSafeCreated(false)
            }
            actions.setLiquidationData(fetched.liquidationData)
            const chainId = NETWORK_ID
            if (fetched.availableOD && chainId) {
                storeActions.connectWalletModel.updateHaiBalance({
                    chainId,
                    balance: fetched.availableOD,
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
    setTotalOD: action((state, payload) => {
        state.totalOD = payload
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
