import { BigNumber, ethers } from 'ethers'
import { Geb } from '@hai-on-op/sdk'
import VirtualUserSafes from '~/artifacts/contracts/VirtualUserSafes.sol/VirtualUserSafes.json'

interface SafeData {
    addy: string
    id: BigNumber
    lockedCollateral: BigNumber
    generatedDebt: BigNumber
    collateralType: string
}

export async function fetchUserSafes(
    geb: Geb,
    userAddress: string,
    haiAddress: string
): Promise<[BigNumber, SafeData[]]> {
    // Encoded input data to be sent to the batch contract constructor
    const inputData = ethers.utils.defaultAbiCoder.encode(
        ['address', 'address', 'address', 'address', 'address', 'address'],
        [
            haiAddress,
            geb.contracts.proxyRegistry.address,
            geb.contracts.getSafes.address,
            geb.contracts.safeEngine.address,
            geb.contracts.safeManager.address,
            userAddress,
        ]
    )
    // Generate payload from input data
    const payload = VirtualUserSafes.bytecode.concat(inputData.slice(2))

    // Call the deployment transaction with the payload
    const returnedData = await geb.provider.call({ data: payload })

    // Parse the returned value to the struct type in order
    const decoded = ethers.utils.defaultAbiCoder.decode(
        [
            `uint256 coinBalance`,
            `tuple(
                address addy, 
                uint256 id, 
                uint256 lockedCollateral, 
                uint256 generatedDebt, 
                bytes32 collateralType
                )[]`,
        ],
        returnedData
    ) as [BigNumber, SafeData[]]

    return decoded
}
