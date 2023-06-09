// tests
import gebManager from '.'
import '../../setupTests'
import axios from 'axios'
import { GRAPH_API_URLS } from '../constants'
import { liquidationQuery } from '../queries/safe'
import { BigNumber, FixedNumber } from 'ethers'
import { ISafeQuery, IUserSafeList } from '../interfaces'
import { geb } from '../../setupTests'
import { fetchSafeById, fetchUserSafes } from '../../services/graphql'

// Add custom match type
declare global {
    namespace jest {
        interface Matchers<R> {
            fixedNumberMatch: (other: string) => void
            almostEqual: (other: string, maxAbsoluteDeviation: number) => void
        }
    }
}

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
        const mantissaReceived = BigNumber.from(
            fixReceived.toHexString()
        ).toString()
        const mantissaOther = BigNumber.from(fixOther.toHexString()).toString()
        const truncatedMantissaReceived = mantissaReceived.slice(
            0,
            gqlMaxMantissaSize
        )
        const truncatedMantissaOther = mantissaOther.slice(
            0,
            gqlMaxMantissaSize
        )

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
                message: () =>
                    `Got ${received} not matching ${other} \n Deviation of ${deviation} is too large`,
            }
        }
    },
})

// Recursively checks that 2 objects have the same keys and number of array element
const verifyKeys = (objA: any, objB: any, matchArrays = true) => {
    const keyA = Object.keys(objA).sort()
    const keyB = Object.keys(objB).sort()

    if (keyA.length !== keyB.length) {
        fail("Objects don't have the same number of key")
    }

    for (let i = 0; i < keyA.length; i++) {
        if (keyA[i] !== keyB[i]) {
            fail(`Key names not matching: ${keyA[i]} ${keyB[i]}`)
        }

        const typeA = typeof objA[keyA[i]]
        const typeB = typeof objA[keyB[i]]

        if (typeA !== typeB && typeA !== null && typeB !== null) {
            fail(
                `Type of object not matching for: \n ${JSON.stringify(
                    objA
                )} \n and: \n   ${JSON.stringify(objB)}`
            )
        }

        if (Array.isArray(objA[keyA[i]]) && matchArrays) {
            // Process arrays
            const arrayA = objA[keyA[i]]
            const arrayB = objB[keyB[i]]
            // Make sure that the arrays are of the same length
            expect(arrayA.length).toEqual(arrayB.length)

            // Check each individual objec within the aeeay
            for (let j = 0; j < arrayA.length; j++) {
                verifyKeys(arrayA[j], arrayB[j], matchArrays)
            }
        } else if (
            typeof objA[keyA[i]] === 'object' &&
            !Array.isArray(objA[keyA[i]]) &&
            objA[keyA[i]]
        ) {
            verifyKeys(objA[keyA[i]], objB[keyB[i]], matchArrays)
        }
    }
}

describe('actions', () => {
    // Address and safe to run the test against
    // !! This safe needs to exist on the deployment tested against
    const address = '0x6C5CCF22147A96e27855E26bC6824EB76497D112'.toLowerCase()
    let safeId: string

    beforeAll(async () => {
        const userSafes = await gebManager.getUserSafesRpc({ geb, address })
        if (!userSafes || !userSafes.safes.length) {
            console.log(`WARNING => ADDRESS HAS NO PROXY OR HAS NO SAFES`)
        } else {
            safeId = userSafes.safes[0].safeId
        }
    })

    describe('FetchLiquidationData', () => {
        // prettier-ignore

        it('Data from RPC and GQL should be the same for liquidation data', async () => {
      const rpcResponse = await gebManager.getLiquidationDataRpc(geb);

      const gqlQuery = `{ ${liquidationQuery} }`;
      const gqlResponse : IUserSafeList = (
        await axios.post(GRAPH_API_URLS[0], JSON.stringify({ query: gqlQuery }))
      ).data.data;

      expect(rpcResponse).toBeTruthy();
      expect(gqlResponse).toBeTruthy();

      verifyKeys(rpcResponse, gqlResponse)

      // It can't be an exact match since the the RPC read function is in reality a state changing function applying the price change every second  

      expect(rpcResponse.systemState.currentRedemptionPrice.value).almostEqual(gqlResponse.systemState.currentRedemptionPrice.value, 0.0001);      
      // Since we're using JS instead of solidity for the exponentiation, an approximation is enough
      expect(rpcResponse.systemState.currentRedemptionRate.annualizedRate).almostEqual(gqlResponse.systemState.currentRedemptionRate.annualizedRate, 0.0001)
      expect(rpcResponse.systemState.globalDebt).fixedNumberMatch(gqlResponse.systemState.globalDebt);
      expect(rpcResponse.systemState.globalDebtCeiling).fixedNumberMatch(gqlResponse.systemState.globalDebtCeiling)
      expect(rpcResponse.systemState.perSafeDebtCeiling).fixedNumberMatch(gqlResponse.systemState.perSafeDebtCeiling)
      expect(rpcResponse.collateralType.accumulatedRate).fixedNumberMatch(gqlResponse.collateralType.accumulatedRate)
      expect(rpcResponse.collateralType.currentPrice.liquidationPrice).fixedNumberMatch(gqlResponse.collateralType.currentPrice.liquidationPrice)
      expect(rpcResponse.collateralType.currentPrice.safetyPrice).fixedNumberMatch(gqlResponse.collateralType.currentPrice.safetyPrice)
      // This value is derive from other value and therefore can have a small deviation
      expect(rpcResponse.collateralType.currentPrice.value).almostEqual(gqlResponse.collateralType.currentPrice.value, 0.01)
      expect(rpcResponse.collateralType.debtCeiling).fixedNumberMatch(gqlResponse.collateralType.debtCeiling)
      expect(rpcResponse.collateralType.debtFloor).fixedNumberMatch(gqlResponse.collateralType.debtFloor)
      expect(rpcResponse.collateralType.liquidationCRatio).fixedNumberMatch(gqlResponse.collateralType.liquidationCRatio)
      expect(rpcResponse.collateralType.liquidationPenalty).fixedNumberMatch(gqlResponse.collateralType.liquidationPenalty)
      expect(rpcResponse.collateralType.safetyCRatio).fixedNumberMatch(gqlResponse.collateralType.safetyCRatio)
      // Here we're using JS exponentiation again, so get an approximate value 
      expect(rpcResponse.collateralType.totalAnnualizedStabilityFee).almostEqual(gqlResponse.collateralType.totalAnnualizedStabilityFee, 0.00001)
    });
    })

    describe('FetchUserSafeList', () => {
        it('fetches a list of user safes', async () => {
            const rpcResponse = await gebManager.getUserSafesRpc({
                geb,
                address,
            })
            const gqlResponse: IUserSafeList = await fetchUserSafes(
                { geb, address },
                true
            )

            expect(gqlResponse).toBeTruthy()
            expect(rpcResponse).toBeTruthy()

            // This will als make that we have the same number of safe on both sides
            verifyKeys(rpcResponse, gqlResponse)

            expect(rpcResponse.erc20Balances[0].balance).fixedNumberMatch(
                gqlResponse.erc20Balances[0].balance
            )

            // Sort the safes by id to compare each
            rpcResponse.safes.sort(
                (a: any, b: any) => Number(a.safeId) - Number(b.safeId)
            )
            gqlResponse.safes.sort(
                (a, b) => Number(a.safeId) - Number(b.safeId)
            )

            // Check that every safe is the same
            for (let i = 0; i < rpcResponse.safes.length; i++) {
                let rpcSafe = rpcResponse.safes[i]
                let gqlSafe = gqlResponse.safes[i]
                expect(rpcSafe.collateral).fixedNumberMatch(gqlSafe.collateral)
                expect(rpcSafe.debt).fixedNumberMatch(gqlSafe.debt)
                expect(rpcSafe.safeHandler).toEqual(gqlSafe.safeHandler)
                expect(rpcSafe.safeId).toEqual(gqlSafe.safeId)
                // !! There is no way to fetch this over RPC, so we return 0
                expect(rpcSafe.createdAt).toBeNull()
            }
        })
    })

    describe('FetchSafeById', () => {
        // prettier-ignore
        it('fetches a safe by id', async () => {
      const rpcResponse = await gebManager.getSafeByIdRpc({ geb, safeId, address });
      const gqlResponse: ISafeQuery = await fetchSafeById(
        { geb, address, safeId },
        true
      );

      expect(gqlResponse).toBeTruthy();
      expect(rpcResponse).toBeTruthy();

      // We set check array to false because the safe history will be missing
      verifyKeys(rpcResponse, gqlResponse, false);

      expect(rpcResponse.safes.length).toEqual(1);
      expect(gqlResponse.safes.length).toEqual(1);

      const safeRpc = rpcResponse.safes[0];
      const safeGql = gqlResponse.safes[0];

      expect(safeRpc.collateral).fixedNumberMatch(safeGql.collateral);
      // There is no way to fetch this over RPC, so we return null
      expect(safeRpc.createdAt).toBeNull();
      expect(safeRpc.debt).fixedNumberMatch(safeGql.debt);
      expect(safeRpc.internalCollateralBalance.balance).fixedNumberMatch(safeGql.internalCollateralBalance.balance);
      // There is no way to fetch this over RPC, so we return null
      expect(safeRpc.liquidationDiscount).toBeNull()
      // There is no way to fetch this over RPC, so we return null
      expect(safeRpc.modifySAFECollateralization).toBeNull()
      expect(safeRpc.safeId).fixedNumberMatch(safeGql.safeId);
        
      expect(rpcResponse.erc20Balances.length).toEqual(1);
      expect(gqlResponse.erc20Balances.length).toEqual(1);
      expect(rpcResponse.erc20Balances[0].balance).fixedNumberMatch(gqlResponse.erc20Balances[0].balance)

      expect(rpcResponse.userProxies.length).toEqual(1);
      expect(gqlResponse.userProxies.length).toEqual(1);
      expect(rpcResponse.userProxies[0].address).toEqual(gqlResponse.userProxies[0].address);

      expect(!!rpcResponse.userProxies[0].coinAllowance).toEqual(!!gqlResponse.userProxies[0].coinAllowance);
      
      if(rpcResponse.userProxies[0].coinAllowance && gqlResponse.userProxies[0].coinAllowance) {
        expect(rpcResponse.userProxies[0].coinAllowance.amount).fixedNumberMatch(gqlResponse.userProxies[0].coinAllowance.amount);
      }
    });
    })
})
