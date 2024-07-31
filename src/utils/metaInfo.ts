export interface MetaInfo {
    title: string
    description: string
    keywords: string
}

const metaInfo: { [key: string]: MetaInfo } = {
    home: {
        title: 'Open Dollar - Low-Interest DeFi Loans & Tradable CDPs',
        description:
            'Discover Open Dollar, a DeFi platform offering low-interest tradable onchain loans. Secure and trade your collateral with ease. The future of onchain lending is here.',
        keywords:
            'Open Dollar, DeFi, low-interest loans, tradable assets, decentralized finance, collateral, stablecoins, tradeable CDPs',
    },
    vaults: {
        title: 'Open Dollar Vaults - Secure Collateral for Low-Interest Loans',
        description:
            'Utilize Open Dollar Vaults to securely lock collateral for minting stablecoins at low interest. Trade your assets with ease on our DeFi platform.',
        keywords: 'Open Dollar vaults, secure collateral, low-interest loans, mint stablecoins, DeFi trading',
    },
    earn: {
        title: 'Open Dollar Staking - Explore earning opportunities in the Open Dollar ecosystem',
        description:
            'Stake your assets on Open Dollar to earn rewards while benefiting from low-interest loans. Enhance your DeFi experience with our staking options.',
        keywords: 'Open Dollar staking, earn rewards, low-interest loans, DeFi staking, asset staking',
    },
    stats: {
        title: 'Open Dollar Stats - Numbers and stuff.',
        description:
            'Access Open Dollar Stats for insights on low-interest loans, collateral, and trading activities. Make informed decisions with comprehensive Open Dollar data.',
        keywords:
            'Open Dollar analytics, Open Dollar stats, low-interest loans, trading insights, DeFi data, collateral analysis',
    },
    bolts: {
        title: 'Open Dollar Bolts - Join the Open Dollar Bolts campaign today',
        description: 'Test the newest primitives in DeFi for a chance at a stake in the future of Open Dollar.',
        keywords:
            'Open Dollar Bolts, points, open dollar points, low-interest loans, liquidity, DeFi platform, gain OD, open dollar',
    },
    bridge: {
        title: 'Open Dollar Bridge - Seamless Cross-Chain Asset Transfers',
        description: 'Deposit collateral into Open Dollar cross-chain with extreme ease.',
        keywords:
            'Open Dollar Bridge, cross-chain transfers, asset transfers, DeFi, secure blockchain transfers, seamless transactions',
    },
    auctions: {
        title: 'Open Dollar Auctions - Bid on Collateral for Great Discounts',
        description: 'Participate in Open Dollar Auctions to bid on collateral and get the best price in the market.',
        keywords:
            'Open Dollar Auctions, bid on collateral, maximize profits, decentralized auction, DeFi opportunities, collateral auctions, cheap crypto, best place to buy crypto',
    },
}

export default metaInfo
