import { BigNumber, ethers } from 'ethers'
import { Geb } from '@hai-on-op/sdk'
import VirtualAnalyticsData from '~/artifacts/contracts/VirtualAnalyticsData.sol/VirtualAnalyticsData.json'

interface TokenAnalyticsData {
    [key: string]: {
        delayedOracle: string
        debtAmount: BigNumber
        debtCeiling: BigNumber
        lockedAmount: BigNumber
        currentPrice: BigNumber
        nextPrice: BigNumber
        stabilityFee: BigNumber
    }
}

export interface AnalyticsData {
    erc20Supply: string
    globalDebt: string
    globalDebtCeiling: string
    globalUnbackedDebt: string
    marketPrice: string
    redemptionPrice: string
    redemptionRate: string
    redemptionRatePTerm: string
    redemptionRateITerm: string
    surplusInTreasury: string
    tokenAnalyticsData: TokenAnalyticsData
}

export async function fetchAnalyticsData(geb: Geb): Promise<AnalyticsData> {
    // Encoded input data to be sent to the batch contract constructor
    const tokenList = Object.values(geb.tokenList)
        .map((token) => token.bytes32String)
        .filter((address) => address !== undefined && address !== '' && address)

    const inputData = ethers.utils.defaultAbiCoder.encode(
        ['address', 'address', 'address', 'address', 'address', 'address', 'bytes32[]'],
        [
            geb.contracts.coin.address,
            geb.contracts.safeEngine.address,
            geb.contracts.oracleRelayer.address,
            geb.contracts.piCalculator.address,
            geb.contracts.taxCollector.address,
            geb.contracts.stabilityFeeTreasury.address,
            tokenList,
        ]
    )

    // Generate payload from input data
    const payload = VirtualAnalyticsData.bytecode.concat(inputData.slice(2))

    // Call the deployment transaction with the payload
    const returnedData = await geb.provider.call({ data: payload })

    // Parse the returned value to the struct type in order
    const decoded = ethers.utils.defaultAbiCoder.decode(
        [
            `tuple(
                uint256 erc20Supply,
                uint256 globalDebt,
                uint256 globalDebtCeiling,
                uint256 globalUnbackedDebt,
                uint256 marketPrice, 
                uint256 redemptionPrice, 
                uint256 redemptionRate, 
                uint256 redemptionRatePTerm, 
                uint256 redemptionRateITerm, 
                uint256 surplusInTreasury, 
                tuple(
                    address delayedOracle, 
                    uint256 debtAmount, 
                    uint256 debtCeiling, 
                    uint256 lockedAmount,
                    uint256 currentPrice, 
                    uint256 nextPrice,
                    uint256 stabilityFee
                    )[] tokenAnalyticsData)`,
        ],
        returnedData
    )[0] as AnalyticsData

    const result: TokenAnalyticsData = Object.entries(geb.tokenList)
        .filter(([, value]) => value.isCollateral)
        .reduce(
            (obj, [key], i) => ({
                ...obj,
                [key]: {
                    delayedOracle: decoded?.tokenAnalyticsData[i]?.delayedOracle,
                    debtAmount: decoded?.tokenAnalyticsData[i]?.debtAmount.toString(),
                    debtCeiling: decoded?.tokenAnalyticsData[i]?.debtCeiling.toString(),
                    lockedAmount: decoded?.tokenAnalyticsData[i]?.lockedAmount.toString(),
                    currentPrice: decoded?.tokenAnalyticsData[i]?.currentPrice.toString(),
                    nextPrice: decoded?.tokenAnalyticsData[i]?.nextPrice.toString(),
                    stabilityFee: decoded?.tokenAnalyticsData[i]?.stabilityFee.toString(),
                },
            }),
            {}
        )

    const parsedResult = {
        erc20Supply: decoded.erc20Supply.toString(),
        globalDebt: decoded.globalDebt.toString(),
        globalDebtCeiling: decoded.globalDebtCeiling.toString(),
        globalUnbackedDebt: decoded.globalUnbackedDebt.toString(),
        marketPrice: decoded.marketPrice.toString(),
        redemptionPrice: decoded.redemptionPrice.toString(),
        redemptionRate: decoded.redemptionRate.toString(),
        redemptionRatePTerm: decoded.redemptionRatePTerm.toString(),
        redemptionRateITerm: decoded.redemptionRateITerm.toString(),
        surplusInTreasury: decoded.surplusInTreasury.toString(),
        tokenAnalyticsData: result,
    }

    return parsedResult
}
