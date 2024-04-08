export const formatBridgeUrl = (amount: string, tokenAddress: string, fromChain?: number, toTokenAddress?: string) => {
  if (fromChain == 1) {
    return `https://bridge.arbitrum.io/?token=${tokenAddress}&amount=${amount}&destinationChain=arbitrum-one&sourceChain=ethereum`
  }
  if (fromChain !== 1) {
    return `https://jumper.exchange/?fromAmount=${amount}&fromChain=${fromChain}&fromToken=${tokenAddress}&toChain=42161&toToken=${toTokenAddress}`
  }
}