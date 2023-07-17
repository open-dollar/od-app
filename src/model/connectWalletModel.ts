import { action, Action, Thunk, thunk } from 'easy-peasy'
import { fetchTokenData, TokenFetchData } from 'src/utils/virtual/tokenData'
import api from '../services/api'
import { IBlockNumber, IFetchTokensDataPayload, ITokenBalance } from '../utils/interfaces'
import { TokenData } from '@hai-on-op/sdk/lib/contracts/addreses'

export interface ConnectWalletModel {
    forceUpdateTokens: boolean
    tokensData: { [token: string]: TokenData }
    tokensFetchedData: { [token: string]: TokenFetchData }
    blockNumber: IBlockNumber
    fiatPrice: number
    flxPrice: number
    step: number
    ethPriceChange: number
    proxyAddress: string
    coinAllowance: string
    protAllowance: string
    ctHash: string
    ethBalance: ITokenBalance
    haiBalance: ITokenBalance
    uniswapPoolBalance: ITokenBalance
    claimableFLX: string
    isWrongNetwork: boolean
    isStepLoading: boolean
    fetchFiatPrice: Thunk<ConnectWalletModel>
    fetchTokenData: Thunk<ConnectWalletModel, IFetchTokensDataPayload>
    setFiatPrice: Action<ConnectWalletModel, number>
    setFlxPrice: Action<ConnectWalletModel, number>
    setIsWrongNetwork: Action<ConnectWalletModel, boolean>
    updateBlockNumber: Action<ConnectWalletModel, { chainId: number; blockNumber: number }>
    updateEthBalance: Action<ConnectWalletModel, { chainId: number; balance: number }>
    updateHaiBalance: Action<ConnectWalletModel, { chainId: number; balance: string }>
    updateUniswapPoolBalance: Action<ConnectWalletModel, { chainId: number; balance: string }>
    setStep: Action<ConnectWalletModel, number>
    setProxyAddress: Action<ConnectWalletModel, string>
    setCoinAllowance: Action<ConnectWalletModel, string>
    setProtAllowance: Action<ConnectWalletModel, string>
    setIsStepLoading: Action<ConnectWalletModel, boolean>
    setCtHash: Action<ConnectWalletModel, string>
    setEthPriceChange: Action<ConnectWalletModel, number>
    setClaimableFLX: Action<ConnectWalletModel, string>
    setTokensData: Action<ConnectWalletModel, { [token: string]: TokenData }>
    setTokensFetchedData: Action<ConnectWalletModel, { [token: string]: TokenFetchData }>
    setForceUpdateTokens: Action<ConnectWalletModel, boolean>
}

const ctHashState = localStorage.getItem('ctHash')

const blockNumberState = localStorage.getItem('blockNumber')

const connectWalletModel: ConnectWalletModel = {
    forceUpdateTokens: true,
    blockNumber: blockNumberState ? JSON.parse(blockNumberState) : {},
    ethBalance: { 1: 0, 42: 0, 420: 0 },
    haiBalance: { 1: '0', 42: '0', 420: '0' },
    uniswapPoolBalance: { 1: '0', 42: '0', 420: '0' },
    tokensData: {},
    tokensFetchedData: {},
    claimableFLX: '0',
    fiatPrice: 0,
    flxPrice: 0,
    ethPriceChange: 0,
    step: 0,
    proxyAddress: '',
    coinAllowance: '',
    protAllowance: '',
    ctHash: ctHashState || '',
    isStepLoading: false,
    isWrongNetwork: false,
    fetchFiatPrice: thunk(async (actions, payload) => {
        const res = await api.fetchFiatPrice()
        if (res && res.usd) {
            actions.setFiatPrice(res.usd)
        }

        if (res && res.usd_24h_change) {
            actions.setEthPriceChange(res.usd_24h_change)
        }
    }),
    fetchTokenData: thunk(async (actions, payload) => {
        const tokenList = payload.geb.tokenList
        const fetched = await fetchTokenData(payload.geb, payload.user, tokenList)
        if (fetched) {
            actions.setTokensFetchedData(fetched)
            actions.setForceUpdateTokens(false)
        }
    }),
    setFiatPrice: action((state, payload) => {
        state.fiatPrice = payload
    }),
    setFlxPrice: action((state, payload) => {
        state.flxPrice = payload
    }),
    setIsWrongNetwork: action((state, payload) => {
        state.isWrongNetwork = payload
    }),

    updateBlockNumber: action((state, payload) => {
        const { chainId, blockNumber } = payload
        if (typeof state.blockNumber[chainId] !== 'number') {
            state.blockNumber[chainId] = blockNumber
        } else {
            state.blockNumber[chainId] = Math.max(blockNumber, state.blockNumber[chainId])
        }
        localStorage.setItem('blockNumber', JSON.stringify(state.blockNumber))
    }),

    updateEthBalance: action((state, payload) => {
        const { chainId, balance } = payload
        state.ethBalance[chainId] = balance
    }),
    updateHaiBalance: action((state, payload) => {
        const { chainId, balance } = payload
        state.haiBalance[chainId] = balance
    }),
    updateUniswapPoolBalance: action((state, payload) => {
        const { chainId, balance } = payload
        state.uniswapPoolBalance[chainId] = balance
    }),
    setStep: action((state, payload) => {
        state.step = payload
        state.isStepLoading = false
    }),
    setProxyAddress: action((state, payload) => {
        state.proxyAddress = payload
    }),
    setCoinAllowance: action((state, payload) => {
        state.coinAllowance = payload
    }),
    setProtAllowance: action((state, payload) => {
        state.protAllowance = payload
    }),
    setIsStepLoading: action((state, payload) => {
        state.isStepLoading = payload
    }),

    setCtHash: action((state, payload) => {
        state.ctHash = payload
        localStorage.setItem('ctHash', payload)
    }),
    setEthPriceChange: action((state, payload) => {
        state.ethPriceChange = payload
    }),
    setClaimableFLX: action((state, payload) => {
        state.claimableFLX = payload
    }),
    setTokensData: action((state, payload) => {
        state.tokensData = payload
    }),
    setTokensFetchedData: action((state, payload) => {
        state.tokensFetchedData = payload
    }),
    setForceUpdateTokens: action((state, payload) => {
        state.forceUpdateTokens = payload
    }),
}

export default connectWalletModel
