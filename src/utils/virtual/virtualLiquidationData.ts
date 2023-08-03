import { BigNumber, ethers } from 'ethers'
import { Geb } from '@hai-on-op/sdk'
import VirtualLiquidationData from '~/artifacts/contracts/VirtualLiquidationData.sol/VirtualLiquidationData.json'
import { TokenData } from '@hai-on-op/sdk/lib/contracts/addreses'

interface LiquidationData {
    redemptionPrice: BigNumber
    redemptionRate: BigNumber
    globalDebt: BigNumber
    globalDebtCeiling: BigNumber
    safeDebtCeiling: BigNumber
    tokensLiquidationData: TokenLiquidationData[]
}

export interface TokenLiquidationData {
    accumulatedRate: BigNumber
    debtFloor: BigNumber
    liquidationPrice: BigNumber
    safetyPrice: BigNumber
    safetyCRatio: BigNumber
    liquidationCRatio: BigNumber
    liquidationPenalty: BigNumber
    stabilityFee: BigNumber
}

export async function fetchLiquidationData(
    geb: Geb,
    tokensData: { [key: string]: TokenData }
): Promise<LiquidationData> {
    const tokens = Object.values(tokensData)
        .filter((token) => token.isCollateral)
        .map((token) => token.bytes32String)

    // Encoded input data to be sent to the batch contract constructor
    const inputData = ethers.utils.defaultAbiCoder.encode(
        ['address', 'address', 'address', 'address', 'bytes32[]'],
        [
            geb.contracts.oracleRelayer.address,
            geb.contracts.safeEngine.address,
            geb.contracts.liquidationEngine.address,
            geb.contracts.taxCollector.address,
            tokens,
        ]
    )

    // Generate payload from input data
    const payload = VirtualLiquidationData.bytecode.concat(inputData.slice(2))

    // Call the deployment transaction with the payload
    const returnedData = await geb.provider.call({ data: payload })

    // Parse the returned value to the struct type in order
    const [decoded] = ethers.utils.defaultAbiCoder.decode(
        [
            `tuple(uint256 redemptionPrice, 
                uint256 redemptionRate, 
                uint256 globalDebt, 
                uint256 globalDebtCeiling, 
                uint256 safeDebtCeiling, 
                tuple(
                    uint256 accumulatedRate, 
                    uint256 debtFloor, 
                    uint256 liquidationPrice, 
                    uint256 safetyPrice, 
                    uint256 safetyCRatio, 
                    uint256 liquidationCRatio, 
                    uint256 liquidationPenalty, 
                    uint256 stabilityFee
                    )[] tokensLiquidationData)`,
        ],
        returnedData
    )

    return decoded
}
