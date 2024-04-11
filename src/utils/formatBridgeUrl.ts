import { BridgeTransaction } from './interfaces'

export const formatBridgeUrl = ({
    originChain,
    fromTokenAddress,
    amount,
    toChain,
    toTokenAddress,
}: BridgeTransaction) => {
    if (originChain === 1) {
        return `https://bridge.arbitrum.io/?token=${fromTokenAddress}&amount=${amount}&destinationChain=arbitrum-one&sourceChain=ethereum`
    }
    if (originChain !== 1) {
        return `https://jumper.exchange/?fromAmount=${amount}&fromChain=${originChain}&fromToken=${fromTokenAddress}&toChain=${toChain}&toToken=${toTokenAddress}`
    }
}
