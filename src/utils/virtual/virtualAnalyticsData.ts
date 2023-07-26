import { BigNumber, ethers } from 'ethers'
import { Geb } from '@hai-on-op/sdk'
import VirtualAnalyticsData from '~/artifacts/contracts/VirtualAnalyticsData.sol/VirtualAnalyticsData.json'

interface TokenAnalyticsData {
    [key: string]: {
        debtAmount: BigNumber
        currentPrice: BigNumber
        nextPrice: BigNumber
    }
}

export interface AnalyticsData {
    marketPrice: string
    redemptionPrice: string
    redemptionRate: string
    tokenAnalyticsData: TokenAnalyticsData
}

export async function fetchAnalyticsData(geb: Geb): Promise<AnalyticsData> {
    // Encoded input data to be sent to the batch contract constructor
    const tokenList = Object.values(geb.tokenList)
        .map((token) => token.bytes32String)
        .filter((address) => address !== undefined && address !== '' && address)

    const inputData = ethers.utils.defaultAbiCoder.encode(
        ['address', 'address', 'bytes32[]'],
        [geb.contracts.safeEngine.address, geb.contracts.oracleRelayer.address, tokenList]
    )

    // Generate payload from input data
    const payload = VirtualAnalyticsData.bytecode.concat(inputData.slice(2))

    // Call the deployment transaction with the payload
    const returnedData = await geb.provider.call({ data: payload })

    // Parse the returned value to the struct type in order
    const decoded = ethers.utils.defaultAbiCoder.decode(
        [
            'tuple(uint256 marketPrice, uint256 redemptionPrice, uint256 redemptionRate, tuple(uint256 debtAmount, uint256 currentPrice, uint256 nextPrice)[] tokenAnalyticsData)',
        ],
        returnedData
    )[0] as AnalyticsData

    const result: TokenAnalyticsData = Object.entries(geb.tokenList)
        .filter(([, value]) => value.isCollateral)
        .reduce(
            (obj, [key], i) => ({
                ...obj,
                [key]: {
                    debtAmount: decoded?.tokenAnalyticsData[i]?.debtAmount.toString(),
                    currentPrice: decoded?.tokenAnalyticsData[i]?.currentPrice.toString(),
                    nextPrice: decoded?.tokenAnalyticsData[i]?.nextPrice.toString(),
                },
            }),
            {}
        )

    const parsedResult = {
        marketPrice: decoded.marketPrice.toString(),
        redemptionPrice: decoded.redemptionPrice.toString(),
        redemptionRate: decoded.redemptionRate.toString(),
        tokenAnalyticsData: result,
    }

    return parsedResult
}
