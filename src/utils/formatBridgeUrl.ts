import { from } from "@apollo/client"

const chainIdToName = {
  1: 'ethereum',
  42161: 'arbitrum-one',
  56: 'bsc',
  137: 'matic',
  250: 'fantom',
}

export const formatBridgeUrl = (tokenAddress: string, amount: string, fromChain?: string, fromChainId?: number) => {
  if (fromChain == 'ethereum' || fromChainId == 1) {
    // @ts-ignore
    const chain: string = fromChain ? fromChain : fromChainId ? chainIdToName[fromChainId as keyof chainIdToName] : ''
    return `https://bridge.arbitrum.io/?token-${tokenAddress}&amount=${amount}&destinationChain=arbitrum-one&sourceChain=ethereum`
  }
}