export enum SupportedChainId {
    ARBITRUM_SEPOLIA = 421614,
    OPTIMISM = 10,
    ARBITRUM = 42161,
    OPTIMISM_GOERLI = 420,
}

export const chainMapping: { [key: string]: number } = {
    Ethereum: 1,
    Optimism: 10,
    Polygon: 137,
    Base: 8453,
    Arbitrum: 42161,
}

export const getChainId = (chain: string): number => {
    return chainMapping[chain]
}
