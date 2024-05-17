import { action, Action } from 'easy-peasy'
import { BridgeTransaction } from '~/utils'
import { formatBridgeUrl } from '~/utils/formatBridgeUrl'

export interface BridgeModel {
    originChain: number
    toChain: number
    fromTokenAddress: string
    toTokenAddress: string
    amount: string
    reason: string
    setReason: Action<BridgeModel, string>
    setOriginChain: Action<BridgeModel, number>
    setToChain: Action<BridgeModel, number>
    setFromTokenAddress: Action<BridgeModel, string>
    setToTokenAddress: Action<BridgeModel, string>
    setAmount: Action<BridgeModel, string>
    bridge: Action<BridgeModel, BridgeTransaction>
}

const bridgeModel: BridgeModel = {
    originChain: 1,
    toChain: 42161,
    fromTokenAddress: '0x0000000000000000000000000000000000000000', // DAI ETH
    toTokenAddress: '0x5979D7b546E38E414F7E9822514be443A4800529', // WSETH ARB
    amount: '100',
    reason:'',
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
    setAmount: action((state, payload) => {
        state.amount = payload
    }),
    bridge: action((state, payload) => {
        const url = formatBridgeUrl({
            amount: state.amount,
            fromTokenAddress: state.fromTokenAddress,
            originChain: payload.originChain,
            toTokenAddress: payload.toTokenAddress,
        })
        window.open(url, '_blank')
    }),
}

export default bridgeModel
