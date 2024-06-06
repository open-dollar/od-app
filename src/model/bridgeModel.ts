import { action, Action } from 'easy-peasy'
import { BridgeTransaction } from '~/utils'
import { formatBridgeUrl } from '~/utils/formatBridgeUrl'

export interface BridgeModel {
    originChain: number
    toChain: number
    fromTokenAddress: string
    toTokenAddress: string
    toTokenSymbol: string
    amount: string
    reason: string
    fromTokenSymbol: string
    setReason: Action<BridgeModel, string>
    setOriginChain: Action<BridgeModel, number>
    setToTokenSymbol: Action<BridgeModel, string>
    setToChain: Action<BridgeModel, number>
    setFromTokenAddress: Action<BridgeModel, string>
    setFromTokenSymbol: Action<BridgeModel, string>
    setToTokenAddress: Action<BridgeModel, string>
    setAmount: Action<BridgeModel, string>
    bridge: Action<BridgeModel, BridgeTransaction>
}

const bridgeModel: BridgeModel = {
    originChain: 1,
    toChain: 42161,
    fromTokenAddress: '',
    toTokenAddress: '',
    toTokenSymbol: '',
    fromTokenSymbol: '',
    amount: '',
    reason: '',
    setReason: action((state, payload) => {
        state.reason = payload
    }),
    setOriginChain: action((state, payload) => {
        state.originChain = payload
    }),
    setToChain: action((state, payload) => {
        state.toChain = payload
    }),
    setFromTokenAddress: action((state, payload) => {
        state.fromTokenAddress = payload
    }),
    setToTokenAddress: action((state, payload) => {
        state.toTokenAddress = payload
    }),
    setToTokenSymbol: action((state, payload) => {
        state.toTokenSymbol = payload
    }),
    setFromTokenSymbol: action((state, payload) => {
        state.fromTokenSymbol = payload
    }),
    setAmount: action((state, payload) => {
        state.amount = payload
    }),
    bridge: action((state, payload) => {
        const url = formatBridgeUrl({
            amount: state.amount,
            fromTokenAddress: payload.fromTokenAddress,
            originChain: payload.originChain,
            toTokenAddress: payload.toTokenAddress,
        })
        window.open(url, '_blank')
    }),
}

export default bridgeModel
