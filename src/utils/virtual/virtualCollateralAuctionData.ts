import { Geb } from '@hai-on-op/sdk'
import { BigNumber, ethers } from 'ethers'
import VirtualCollateralAuctionsData from '~/artifacts/contracts/VirtualCollateralAuctionData.sol/VirtualCollateralAuctionsData.json'

export interface CollateralAuctionsData {
    _auctionId: BigNumber
    _boughtCollateral: BigNumber
    _adjustedBid: BigNumber
}

export async function fetchCollateralAuctionData(
    geb: Geb,
    collateral: string, // 'WETH' / 'OP' ...
    auctionIds: string[]
): Promise<CollateralAuctionsData[]> {
    // Encoded input data to be sent to the batch contract constructor
    const inputData = ethers.utils.defaultAbiCoder.encode(
        ['address', 'uint256[]'],
        [geb.tokenList[collateral].collateralAuctionHouse, auctionIds]
    )
    // Generate payload from input data
    const payload = VirtualCollateralAuctionsData.bytecode.concat(inputData.slice(2))

    // Call the deployment transaction with the payload
    const returnedData = await geb.provider.call({ data: payload })
    // Parse the returned value to the struct type in order
    const decoded = ethers.utils.defaultAbiCoder.decode(
        [
            `tuple(
                uint256 _auctionId,
                uint256 _boughtCollateral,
                uint256 _adjustedBid
            )[]`,
        ],
        returnedData
    )[0] as CollateralAuctionsData[]

    return decoded
}
