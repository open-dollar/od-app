import { Geb } from '@hai-on-op/sdk'
import { BigNumber, ethers } from 'ethers'
import VirtualAuctionsData from '~/artifacts/contracts/VirtualAuctionsData.sol/VirtualAuctionsData.json'

export interface AuctionData {
    debtAuctionHouseParams: DebtAuctionHouseParams
    surplusAuctionHouseParams: SurplusAuctionHouseParams
    accountingEngineData: IAccountingEngineData
    protocolTokenProxyBalance: BigNumber
    coinTokenProxyBalance: BigNumber
    coinTokenSafeBalance: BigNumber
}

interface AccountingEngineParams {
    // Whether the system transfers surplus instead of auctioning it
    surplusIsTransferred: BigNumber
    // Delay between surplus actions
    surplusDelay: BigNumber
    // Delay after which debt can be popped from debtQueue
    popDebtDelay: BigNumber
    // Time to wait (post settlement) until any remaining surplus can be transferred to the settlement auctioneer
    disableCooldown: BigNumber
    // Amount of surplus stability fees transferred or sold in one surplus auction
    surplusAmount: BigNumber
    // Amount of stability fees that need to accrue in this contract before any surplus auction can start
    surplusBuffer: BigNumber
    // Amount of protocol tokens to be minted post-auction
    debtAuctionMintedTokens: BigNumber
    // Amount of debt sold in one debt auction (initial coin bid for debtAuctionMintedTokens protocol tokens)
    debtAuctionBidSize: BigNumber
}

interface IAccountingEngineData {
    accountingEngineParams: AccountingEngineParams
    totalOnAuctionDebt: BigNumber
    totalQueuedDebt: BigNumber
    debtQueue: BigNumber
    lastSurplusTime: BigNumber
    unqueuedUnauctionedDebt: BigNumber
    disableTimestamp: BigNumber
    coinBalance: BigNumber
    debtBalance: BigNumber
}

interface DebtAuctionHouseParams {
    // Minimum bid increase compared to the last bid in order to take the new one in consideration
    bidDecrease: BigNumber // [wad]
    // Increase in protocol tokens sold in case an auction is restarted
    amountSoldIncrease: BigNumber // [wad]
    // How long the auction lasts after a new bid is submitted
    bidDuration: BigNumber // [seconds]
    // Total length of the auction
    totalAuctionLength: BigNumber // [seconds]
}

interface SurplusAuctionHouseParams {
    // Minimum bid increase compared to the last bid in order to take the new one in consideration
    bidIncrease: BigNumber // [wad]
    // How long the auction lasts after a new bid is submitted
    bidDuration: BigNumber // [seconds]
    // Total length of the auction
    totalAuctionLength: BigNumber // [seconds]
    recyclingPercentage: BigNumber
}

export async function fetchAuctionData(geb: Geb, proxyAddress: string): Promise<AuctionData> {
    // Encoded input data to be sent to the batch contract constructor
    const inputData = ethers.utils.defaultAbiCoder.encode(
        ['address', 'address', 'address', 'address', 'address', 'address', 'address'],
        [
            geb.contracts.surplusAuctionHouse.address,
            geb.contracts.debtAuctionHouse.address,
            geb.contracts.accountingEngine.address,
            geb.contracts.safeEngine.address,
            proxyAddress,
            geb.tokenList.KITE.address,
            geb.tokenList.HAI.address,
        ]
    )
    // Generate payload from input data
    const payload = VirtualAuctionsData.bytecode.concat(inputData.slice(2))

    // Call the deployment transaction with the payload
    const returnedData = await geb.provider.call({ data: payload })
    // Parse the returned value to the struct type in order
    const decoded = ethers.utils.defaultAbiCoder.decode(
        [
            `tuple(
                tuple(uint256 bidIncrease,uint256 bidDuration,uint256 totalAuctionLength,uint256 recyclingPercentage) surplusAuctionHouseParams, 
                tuple(uint256 bidDecrease,uint256 amountSoldIncrease,uint256 bidDuration,uint256 totalAuctionLength) debtAuctionHouseParams,
                tuple(
                    tuple(uint256 surplusIsTransferred,uint256 surplusDelay,uint256 popDebtDelay,uint256 disableCooldown,uint256 surplusAmount,uint256 surplusBuffer,uint256 debtAuctionMintedTokens,uint256 debtAuctionBidSize) accountingEngineParams,
                    uint256 totalOnAuctionDebt,
                    uint256 totalQueuedDebt,
                    uint256 debtQueue,
                    uint256 lastSurplusTime,
                    uint256 unqueuedUnauctionedDebt,
                    uint256 disableTimestamp,
                    uint256 coinBalance,
                    uint256 debtBalance
                ) accountingEngineData,
                uint256 protocolTokenProxyBalance,
                uint256 coinTokenProxyBalance,
                uint256 coinTokenSafeBalance
            )`,
        ],
        returnedData
    )[0] as AuctionData

    return decoded
}
