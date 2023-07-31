// tests
// import gebManager from '.'
import '../../setupTests'
import { BigNumber, FixedNumber } from 'ethers'

// Add custom match type
// declare global {
//     namespace jest {
//         interface Matchers<R> {
//             fixedNumberMatch: (other: string) => void
//             almostEqual: (other: string, maxAbsoluteDeviation: number) => void
//         }
//     }
// }

// Add some custom matchers
expect.extend({
    // Compare numbers as string regardless of things like trailing/leading zeros
    // And work with the gql endpoint way of handling BigDecimals
    fixedNumberMatch(received, other: string) {
        // Use format 45 decimal
        const fixReceived = FixedNumber.from(received, 'fixed256x45')
        const fixOther = FixedNumber.from(other, 'fixed256x45')

        // The GQL endpoint will allow only up to 33-34 digits base 10 for the mantissa
        // So we truncate it
        const gqlMaxMantissaSize = 33
        const mantissaReceived = BigNumber.from(fixReceived.toHexString()).toString()
        const mantissaOther = BigNumber.from(fixOther.toHexString()).toString()
        const truncatedMantissaReceived = mantissaReceived.slice(0, gqlMaxMantissaSize)
        const truncatedMantissaOther = mantissaOther.slice(0, gqlMaxMantissaSize)

        // Compare the mantissa and the decimal place
        if (
            truncatedMantissaReceived === truncatedMantissaOther &&
            fixReceived.format.decimals === fixOther.format.decimals
        ) {
            return { pass: true, message: () => 'Good' }
        } else {
            return {
                pass: false,
                message: () => `Got ${received} not matching ${other}`,
            }
        }
    },
    // Equality with a specified tolerance
    almostEqual(received: string, other: string, maxAbsoluteDeviation: number) {
        const deviation = Math.abs(Number(received) - Number(other))
        if (deviation <= maxAbsoluteDeviation) {
            return { pass: true, message: () => 'Good' }
        } else {
            return {
                pass: false,
                message: () => `Got ${received} not matching ${other} \n Deviation of ${deviation} is too large`,
            }
        }
    },
})

// Recursively checks that 2 objects have the same keys and number of array element
// const verifyKeys = (objA: any, objB: any, matchArrays = true) => {
//     const keyA = Object.keys(objA).sort()
//     const keyB = Object.keys(objB).sort()

//     if (keyA.length !== keyB.length) {
//         fail("Objects don't have the same number of key")
//     }

//     for (let i = 0; i < keyA.length; i++) {
//         if (keyA[i] !== keyB[i]) {
//             fail(`Key names not matching: ${keyA[i]} ${keyB[i]}`)
//         }

//         const typeA = typeof objA[keyA[i]]
//         const typeB = typeof objA[keyB[i]]

//         if (typeA !== typeB && typeA !== null && typeB !== null) {
//             fail(`Type of object not matching for: \n ${JSON.stringify(objA)} \n and: \n   ${JSON.stringify(objB)}`)
//         }

//         if (Array.isArray(objA[keyA[i]]) && matchArrays) {
//             // Process arrays
//             const arrayA = objA[keyA[i]]
//             const arrayB = objB[keyB[i]]
//             // Make sure that the arrays are of the same length
//             expect(arrayA.length).toEqual(arrayB.length)

//             // Check each individual objec within the aeeay
//             for (let j = 0; j < arrayA.length; j++) {
//                 verifyKeys(arrayA[j], arrayB[j], matchArrays)
//             }
//         } else if (typeof objA[keyA[i]] === 'object' && !Array.isArray(objA[keyA[i]]) && objA[keyA[i]]) {
//             verifyKeys(objA[keyA[i]], objB[keyB[i]], matchArrays)
//         }
//     }
// }

describe('empty', () => {
    it('empty', () => {
        expect(true).toBe(true)
    })
})

// TODO: This tests compared the rpc calls with graphql. We don't use graphql anymore
// We need to mock the calls to the geb package to test that the function works correctly
// describe('actions', () => {
//     // Address and safe to run the test against
//     // !! This safe needs to exist on the deployment tested against
//     const address = '0xabfE7805bf9BBeb0DA3B4AaF53e5af00b7204fD5'.toLowerCase()
//     let safeId: string

//     beforeAll(async () => {
//         const userSafes = await gebManager.getUserSafesRpc({ geb, address })
//         if (!userSafes || !userSafes.safes.length) {
//             console.log(`WARNING => ADDRESS HAS NO PROXY OR HAS NO SAFES`)
//         } else {
//             safeId = userSafes.safes[0].safeId
//         }
//     })

//     describe('FetchLiquidationData', () => {
//         // prettier-ignore

//         it('Data from liquidation data', async () => {
//             const rpcResponse = await gebManager.getLiquidationDataRpc(geb);

//             expect(rpcResponse).toBeTruthy();

//             // It can't be an exact match since the the RPC read function is in reality a state changing function applying the price change every second

//             expect(rpcResponse.systemState.currentRedemptionPrice.value).not.toBeNull();
//             // Since we're using JS instead of solidity for the exponentiation, an approximation is enough
//             expect(rpcResponse.systemState.currentRedemptionRate.annualizedRate).not.toBeNull()
//             expect(rpcResponse.systemState.globalDebt).not.toBeNull();
//             expect(rpcResponse.systemState.globalDebtCeiling).not.toBeNull()
//             expect(rpcResponse.systemState.perSafeDebtCeiling).not.toBeNull()
//             expect(rpcResponse.collateralType.accumulatedRate).not.toBeNull()
//             expect(rpcResponse.collateralType.currentPrice.liquidationPrice).not.toBeNull()
//             expect(rpcResponse.collateralType.currentPrice.safetyPrice).not.toBeNull()
//             // This value is derive from other value and therefore can have a small deviation
//             expect(rpcResponse.collateralType.currentPrice.value).not.toBeNull()
//             expect(rpcResponse.collateralType.debtCeiling).not.toBeNull()
//             expect(rpcResponse.collateralType.debtFloor).not.toBeNull()
//             expect(rpcResponse.collateralType.liquidationCRatio).not.toBeNull()
//             expect(rpcResponse.collateralType.liquidationPenalty).not.toBeNull()
//             expect(rpcResponse.collateralType.safetyCRatio).not.toBeNull()
//             // Here we're using JS exponentiation again, so get an approximate value
//             expect(rpcResponse.collateralType.totalAnnualizedStabilityFee).not.toBeNull()
//         });
//     })

//     describe('FetchUserSafeList', () => {
//         it('fetches a list of user safes', async () => {
//             const rpcResponse = await gebManager.getUserSafesRpc({
//                 geb,
//                 address,
//             })

//             expect(rpcResponse).toBeTruthy()

//             // Check that every safe is the same
//             for (let i = 0; i < rpcResponse.safes.length; i++) {
//                 let rpcSafe = rpcResponse.safes[i]
//                 expect(rpcSafe.collateral).not.toBeNull()
//                 expect(rpcSafe.debt).not.toBeNull()
//                 expect(rpcSafe.safeHandler).not.toBeNull()
//                 expect(rpcSafe.safeId).not.toBeNull()
//                 // !! There is no way to fetch this over RPC, so we return 0
//                 expect(rpcSafe.createdAt).toBeNull()
//             }
//         })
//     })

//     describe('FetchSafeById', () => {
//         // prettier-ignore
//         it('fetches a safe by id', async () => {
//             const rpcResponse = await gebManager.getSafeByIdRpc({ geb, safeId, address });

//             expect(rpcResponse).toBeTruthy();

//             expect(rpcResponse.safes.length).toEqual(1);

//             const safeRpc = rpcResponse.safes[0];

//             expect(safeRpc.collateral).not.toBeNull();
//             // There is no way to fetch this over RPC, so we return null
//             expect(safeRpc.createdAt).toBeNull();
//             expect(safeRpc.debt).not.toBeNull();
//             expect(safeRpc.internalCollateralBalance.balance).not.toBeNull();
//             // There is no way to fetch this over RPC, so we return null
//             expect(safeRpc.liquidationDiscount).toBeNull()
//             // There is no way to fetch this over RPC, so we return null
//             expect(safeRpc.modifySAFECollateralization).toBeNull()
//             expect(safeRpc.safeId).not.toBeNull();

//             expect(rpcResponse.erc20Balances.length).toEqual(1);
//             expect(rpcResponse.erc20Balances[0].balance).not.toBeNull()

//             expect(rpcResponse.userProxies.length).toEqual(1);
//             expect(rpcResponse.userProxies[0].address).not.toBeNull();

//             if (rpcResponse.userProxies[0].coinAllowance) {
//                 expect(rpcResponse.userProxies[0].coinAllowance.amount).not.toBeNull();
//             }
//         });
//     })
// })
