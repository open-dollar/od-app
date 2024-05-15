import { BridgeTransaction } from './interfaces'

export const formatBridgeUrl = ({
    originChain,
    fromTokenAddress,
    toChain = 42161,
    toTokenAddress,
}: BridgeTransaction) => {
    if (originChain === 1) {
        return `https://bridge.arbitrum.io/?destinationChain=arbitrum-one&sourceChain=ethereum`
    }
    if (originChain !== 1) {
        const toToken = toTokenAddress === 'WSTETH' ? '0x5979D7b546E38E414F7E9822514be443A4800529' : toTokenAddress
        return `https://jumper.exchange/?fromChain=${originChain}&fromToken=${fromTokenAddress}&toChain=${toChain}&toToken=${toToken}`
    }
}
