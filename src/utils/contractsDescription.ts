// temporary: We can add this values to the SDK
export const contractsDescriptions: { [k: string]: string } = {
    safeEngine:
        'The SafeEngine contract is the core of HAI Protocol. It is responsible for having the accountance of all opened SAFEs.',
    accountingEngine:
        'The AccountingEngine contract is responsible for the accounting of HAI Protocol. Holds both system surplus and debt, and auctions them off when necessary.',
    taxCollector:
        'The TaxCollector contract is responsible for collecting the Stability Fee from SAFEs and sending it to the StabilityFeeTreasury.',
    liquidationEngine: 'The LiquidationEngine contract is responsible for the liquidation of SAFEs.',
    oracleRelayer:
        'The OracleRelayer centralizes the oracle price feeds and provides a single price feed for the system.',
    globalSettlement: 'The GlobalSettlement contract is responsible for the global settlement of HAI Protocol.',
    debtAuctionHouse:
        'The DebtAuctionHouse contract is responsible for the creation and execution of all Debt Auctions.',
    surplusAuctionHouse:
        'The SurplusAuctionHouse contract is responsible for the creation and execution of all Surplus Auctions.',
    stabilityFeeTreasury:
        'The StabilityFeeTreasury contract is responsible for the collection of the Stability Fee from the TaxCollector and the distribution of the Stability Fee to the Protocol Token Holders.',
    safeManager: 'The SafeManager contract is responsible for the creation and execution of SAFEs.',
    joinCoin: 'The JoinCoin allows users to join and exit the system with the Coin',
    coin: 'The System Coin contract is the ERC20 token (HAI) that is used to mint or burn debts within the system.',
    proxyRegistry: 'The ProxyRegistry contract hosts proxy ownership and facilitates deployment.',
    medianizerCoin: 'The Oracle responsible for quoting the price of the system Coin.',
    rateSetter: 'The RateSetter contract is responsible for the triggering the update of the PI Controller.',
    piCalculator: 'The PiController contract calculates the redemption rate given error history parameters.',
    weth: 'The Weth contract.',
    protocolToken: 'The ProtocolToken is the ERC20Votes used for Surplus and Debt auctions.',
}
