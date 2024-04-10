import { action, Action } from 'easy-peasy'
import { BridgeTransaction } from '~/utils'
import { formatBridgeUrl } from '~/utils/formatBridgeUrl'

export interface BridgeModel {
    originChain: number
    toChain: number
    fromTokenAddress: string
    toTokenAddress: string
    amount: string
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
    fromTokenAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI ETH
    toTokenAddress: '0x5979D7b546E38E414F7E9822514be443A4800529', // WSETH ARB
    amount: '100',
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
        console.log('Bridge transaction', payload)
        const url = formatBridgeUrl({
            amount: state.amount,
            fromTokenAddress: state.fromTokenAddress,
            originChain: state.originChain,
            toTokenAddress: state.toTokenAddress,
        })
        window.open(url, '_blank')
    }),
}

export default bridgeModel
