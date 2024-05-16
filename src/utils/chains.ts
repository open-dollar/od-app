export enum SupportedChainId {
    ARBITRUM_SEPOLIA = 421614,
    OPTIMISM = 10,
    ARBITRUM = 42161,
    OPTIMISM_GOERLI = 420,
}

export const chainMapping: { [key: string]: number } = {
    Mainnet: 1,
    Optimism: 10,
    Polygon: 137,
    Base: 8453,
}

export const getChainId = (chain: string): number => {
    return chainMapping[chain]
}
