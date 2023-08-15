import type { AddEthereumChainParameter } from '@web3-react/types'

const ETH: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
}

const MATIC: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Matic',
  symbol: 'MATIC',
  decimals: 18,
}


interface BasicChainInformation {
  urls: string[]
  name: string
}

interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter['nativeCurrency']
  blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls']
}

function isExtendedChainInformation(
  chainInformation: BasicChainInformation | ExtendedChainInformation
): chainInformation is ExtendedChainInformation {
  return !!(chainInformation as ExtendedChainInformation).nativeCurrency
}

export function getAddChainParameters(chainId: number): AddEthereumChainParameter | number {
  const chainInformation = CHAINS[chainId]
  if (isExtendedChainInformation(chainInformation)) {
    return {
      chainId,
      chainName: chainInformation.name,
      nativeCurrency: chainInformation.nativeCurrency,
      rpcUrls: chainInformation.urls,
      blockExplorerUrls: chainInformation.blockExplorerUrls,
    }
  } else {
    return chainId
  }
}

const getInfuraUrlFor = (network: string) =>
  process.env.INFURA_KEY ? `https://${network}.infura.io/v3/${process.env.INFURA_KEY}` : undefined

type ChainConfig = { [chainId: number]: BasicChainInformation | ExtendedChainInformation }

export const MAINNET_CHAINS: ChainConfig = {
  42161: {
    // @ts-ignore
    urls: [getInfuraUrlFor('arbitrum-mainnet'), 'https://arb1.arbitrum.io/rpc'].filter(Boolean),
    name: 'Arbitrum One',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://arbiscan.io'],
  },
  10: {
    // @ts-ignore
    urls: [getInfuraUrlFor('optimism-mainnet'), 'https://goerli.optimism.io/'].filter(Boolean),
    name: 'Optimism Mainnet',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://optimistic.etherscan.io'],

  }
}

export const TESTNET_CHAINS: ChainConfig = {
  421613: {
    // @ts-ignore
    urls: [getInfuraUrlFor('arbitrum-goerli'), 'https://goerli-rollup.arbitrum.io/rpc'].filter(Boolean),
    name: 'Arbitrum Goerli',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://testnet.arbiscan.io'],
  },
  420: {
    // @ts-ignore
    urls: [getInfuraUrlFor('optimism-goerli'), 'https://goerli.optimism.io/'].filter(Boolean),
    name: 'Optimism Goerli',
    nativeCurrency: ETH,
    blockExplorerUrls: ['https://goerli-optimism.etherscan.io/'],
  }

}

const supportedChainId = parseInt(process.env.REACT_APP_NETWORK_ID || '', 10);

if (isNaN(supportedChainId)) {
  throw new Error('REACT_APP_NETWORK_ID must be a valid number');
}

export const CHAINS: ChainConfig = {
  [supportedChainId]: {
    ...(MAINNET_CHAINS[supportedChainId] || TESTNET_CHAINS[supportedChainId]),
  },
};

if (!CHAINS[supportedChainId]) {
  throw new Error(`Unsupported chain ID ${supportedChainId}`);
}

export const URLS: { [chainId: number]: string[] } = Object.keys(CHAINS).reduce<{ [chainId: number]: string[] }>(
  (accumulator, chainId) => {
    const validURLs: string[] = CHAINS[Number(chainId)].urls

    if (validURLs.length) {
      accumulator[Number(chainId)] = validURLs
    }

    return accumulator
  },
  {}
)
