export const chainIdToName = new Map<number, string>([
  [1, 'ethereum'],
  [42161, 'arbitrum-one'],
  [56, 'bsc'],
  [137, 'matic'],
  [250, 'fantom'],
]);

export const formatBridgeUrl = (amount: string, tokenAddress: string, fromChain?: string, fromChainId?: number) => {
  if (fromChain == 'ethereum' || fromChainId == 1) {
    return `https://bridge.arbitrum.io/?token-${tokenAddress}&amount=${amount}&destinationChain=arbitrum-one&sourceChain=ethereum`
  }
  if (fromChainId !== 1) {
    return `https://jumper.exchange/?fromAmount=${amount}&fromChain=${fromChainId}&fromToken=${tokenAddress}&toChain=42161&toToken=0x5979d7b546e38e414f7e9822514be443a4800529`
  }
}