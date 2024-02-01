import { action, Action } from 'easy-peasy'
import { IAlert, IAuctionOperation, IOperation, IWaitingPayload, LoadingPayload } from '../utils/interfaces'

export interface PopupsModel {
    isSettingsModalOpen: boolean
    isConnectModalOpen: boolean
    isConnectedWalletModalOpen: boolean
    isConnectorsWalletOpen: boolean
    isLiquidateSafeModalOpen: boolean
    showSideMenu: boolean
    isSafeManagerOpen: boolean
    isClaimPopupOpen: boolean
    returnProxyFunction: (actions: any) => void | null
    blockBackdrop: boolean
    hasFLXClaim: boolean
    isProxyModalOpen: boolean
    isScreenModalOpen: boolean
    isVotingModalOpen: boolean
    auctionOperationPayload: IAuctionOperation
    liquidateSafePayload: { safeId: string } | null
    alertPayload: IAlert | null
    ESMOperationPayload: IOperation
    safeOperationPayload: IOperation & { isCreate: boolean }
    isLoadingModalOpen: LoadingPayload
    isWaitingModalOpen: boolean
    waitingPayload: IWaitingPayload
    setIsSettingModalOpen: Action<PopupsModel, boolean>
    setIsConnectModalOpen: Action<PopupsModel, boolean>
    setIsConnectedWalletModalOpen: Action<PopupsModel, boolean>
    setShowSideMenu: Action<PopupsModel, boolean>
    setIsScreenModalOpen: Action<PopupsModel, boolean>
    setIsConnectorsWalletOpen: Action<PopupsModel, boolean>
    setIsLoadingModalOpen: Action<PopupsModel, LoadingPayload>
    setSafeOperationPayload: Action<PopupsModel, IOperation & { isCreate: boolean }>
    setAlertPayload: Action<PopupsModel, IAlert | null>
    setESMOperationPayload: Action<PopupsModel, IOperation>
    setIsVotingModalOpen: Action<PopupsModel, boolean>
    openLiquidateSafeModal: Action<PopupsModel, { safeId: string }>
    closeLiquidateSafeModal: Action<PopupsModel>
    setAuctionOperationPayload: Action<PopupsModel, IAuctionOperation>
    setIsWaitingModalOpen: Action<PopupsModel, boolean>
    setWaitingPayload: Action<PopupsModel, IWaitingPayload>
    setBlockBackdrop: Action<PopupsModel, boolean>
    setIsProxyModalOpen: Action<PopupsModel, boolean>
    setIsSafeManagerOpen: Action<PopupsModel, boolean>
    setIsClaimPopupOpen: Action<PopupsModel, boolean>
    setHasFLXClaim: Action<PopupsModel, boolean>
    setReturnProxyFunction: Action<PopupsModel, (storeActions: any) => void | null>
}

const popupsModel: PopupsModel = {
    blockBackdrop: false,
    isSettingsModalOpen: false,
    isConnectModalOpen: false,
    isLiquidateSafeModalOpen: false,
    isProxyModalOpen: false,
    hasFLXClaim: false,
    isConnectedWalletModalOpen: false,
    isScreenModalOpen: false,
    isWaitingModalOpen: false,
    isSafeManagerOpen: false,
    isClaimPopupOpen: false,
    liquidateSafePayload: null,
    returnProxyFunction: () => {},
    waitingPayload: {
        title: '',
        text: '',
        hint: '',
        status: 'loading',
        isCreate: false,
    },
    safeOperationPayload: {
        isOpen: false,
        type: '',
        isCreate: false,
    },
    alertPayload: {
        type: '',
        text: '',
    },
    ESMOperationPayload: {
        isOpen: false,
        type: '',
    },
    isVotingModalOpen: false,
    isConnectorsWalletOpen: false,
    showSideMenu: false,
    isLoadingModalOpen: {
        isOpen: false,
        text: '',
    },
    auctionOperationPayload: {
        isOpen: false,
        type: '',
        auctionType: '',
    },

    setIsSettingModalOpen: action((state, payload) => {
        state.isSettingsModalOpen = payload
    }),
    setIsConnectModalOpen: action((state, payload) => {
        state.isConnectModalOpen = payload
    }),
    setIsConnectedWalletModalOpen: action((state, payload) => {
        state.isConnectedWalletModalOpen = payload
    }),
    openLiquidateSafeModal: action((state, payload) => {
        state.isLiquidateSafeModalOpen = true
        state.liquidateSafePayload = payload
    }),
    closeLiquidateSafeModal: action((state) => {
        state.isLiquidateSafeModalOpen = false
        state.liquidateSafePayload = null
    }),
    setShowSideMenu: action((state, payload) => {
        state.showSideMenu = payload
    }),
    setIsScreenModalOpen: action((state, payload) => {
        state.isScreenModalOpen = payload
    }),
    setIsConnectorsWalletOpen: action((state, payload) => {
        state.isConnectorsWalletOpen = payload
    }),
    setIsLoadingModalOpen: action((state, payload) => {
        state.isLoadingModalOpen = payload
    }),
    setSafeOperationPayload: action((state, payload) => {
        state.safeOperationPayload = payload
    }),
    setAlertPayload: action((state, payload) => {
        state.alertPayload = payload
    }),
    setESMOperationPayload: action((state, payload) => {
        state.ESMOperationPayload = payload
    }),
    setIsVotingModalOpen: action((state, payload) => {
        state.isVotingModalOpen = payload
    }),
    setAuctionOperationPayload: action((state, payload) => {
        state.auctionOperationPayload = payload
    }),
    setIsWaitingModalOpen: action((state, payload) => {
        state.isWaitingModalOpen = payload
        if (!payload) {
            state.waitingPayload = {
                title: '',
                text: '',
                hint: '',
                status: 'loading',
                isCreate: false,
            }
        }
    }),
    setWaitingPayload: action((state, payload) => {
        state.waitingPayload = payload
    }),
    setBlockBackdrop: action((state, payload) => {
        state.blockBackdrop = payload
    }),
    setIsProxyModalOpen: action((state, payload) => {
        state.isProxyModalOpen = payload
    }),
    setReturnProxyFunction: action((state, payload) => {
        state.returnProxyFunction = payload
    }),
    setIsSafeManagerOpen: action((state, payload) => {
        state.isSafeManagerOpen = payload
    }),
    setIsClaimPopupOpen: action((state, payload) => {
        state.isClaimPopupOpen = payload
    }),
    setHasFLXClaim: action((state, payload) => {
        state.hasFLXClaim = payload
    }),
}

export default popupsModel
