import { BigNumber } from 'ethers'
import { Geb, utils } from 'geb.js'
import {
    ILiquidationResponse,
    ISafeQuery,
    ISafeResponse,
    IUserSafeList,
} from '../interfaces'

interface UserListConfig {
    geb: Geb
    address: string
    proxy_not?: null
    safeId_not?: null
}

type SingleSafeConfig = UserListConfig & { safeId: string }

// returns LiquidationData
const getLiquidationDataRpc = async (
    geb: Geb,
    collateralTypeId = 'ETH-A',
    systemStateTypeId = 'current'
): Promise<ILiquidationResponse> => {
    if (collateralTypeId !== 'ETH-A') {
        throw Error(`Collateral ${collateralTypeId} not supported`)
    }

    // Massive multicall query to fetch everything one shot
    // @ts-ignore Typing only supported up to 7 queries
    const resp: any = await geb.multiCall([
        geb.contracts.oracleRelayer.redemptionPrice_readOnly(true), // 0
        geb.contracts.oracleRelayer.redemptionRate(true), // 1
        geb.contracts.safeEngine.globalDebt(true), // 2
        geb.contracts.safeEngine.globalDebtCeiling(true), // 3
        geb.contracts.safeEngine.safeDebtCeiling(true), // 4
        geb.contracts.safeEngine.collateralTypes(utils.ETH_A, true), // 5
        geb.contracts.oracleRelayer.collateralTypes(utils.ETH_A, true), // 6
        geb.contracts.liquidationEngine.collateralTypes(utils.ETH_A, true), // 7
        geb.contracts.taxCollector.collateralTypes(utils.ETH_A, true), // 8
    ])

    return {
        systemState: {
            currentRedemptionPrice: {
                value: parseRay(resp[0]),
            },
            currentRedemptionRate: {
                // Calculate 8h exponentiation of the redemption rate in JS instead of solidity
                annualizedRate: Math.pow(
                    Number(parseRay(resp[1])),
                    3600 * 24 * 365
                ).toString(),
            },
            globalDebt: parseRad(resp[2]),
            globalDebtCeiling: parseRad(resp[3]),
            perSafeDebtCeiling: parseWad(resp[4]),
        },
        collateralType: {
            accumulatedRate: parseRay(resp[5].accumulatedRate),
            currentPrice: {
                liquidationPrice: parseRay(resp[5].liquidationPrice),
                safetyPrice: parseRay(resp[5].safetyPrice),
                // Price not directly available but can be calculated
                // Price feed price = safetyPrice * safetyCRatio * redemptionPrice
                value: parseRad(
                    resp[5].safetyPrice
                        .mul(resp[6].safetyCRatio)
                        .mul(resp[0])
                        .div(BigNumber.from(10).pow(36))
                ),
            },
            debtCeiling: parseRad(resp[5].debtCeiling),
            debtFloor: parseRad(resp[5].debtFloor),
            liquidationCRatio: parseRay(resp[6].liquidationCRatio),
            liquidationPenalty: parseWad(resp[7].liquidationPenalty),
            safetyCRatio: parseRay(resp[6].safetyCRatio),
            totalAnnualizedStabilityFee: Math.pow(
                Number(parseRay(resp[8].stabilityFee)),
                3600 * 24 * 365 // Second per year
            ).toString(),
        },
    }
}

// Returns list of user safes
// This is slow since it's 3 chained requests to a RPC node.
// TODO: Pass-in the proxy if available so that request 2 can be added to the multicall
// This could be optimized further with a dedicated contract fetching exactly the needed date
const getUserSafesRpc = async (
    config: UserListConfig
): Promise<IUserSafeList> => {
    const { geb, address } = config

    const multiCallRequest = geb.multiCall([
        geb.contracts.coin.balanceOf(address, true), // 0
        geb.contracts.proxyRegistry.proxies(address, true), // 1
    ])

    // Fetch the liq data and the a multicall in parallel
    const [multiCall, liquidationDataRpc] = await Promise.all([
        multiCallRequest,
        getLiquidationDataRpc(geb),
    ])

    const safeDetails = await geb.contracts.getSafes.getSafesAsc(
        geb.contracts.safeManager.address,
        multiCall[1]
    )

    const collateralAndDebtRequest = safeDetails.safes.map((handler) =>
        geb.contracts.safeEngine.safes(utils.ETH_A, handler, true)
    )

    // @ts-ignore typing does not support this
    const collateralAndDebt = await geb.multiCall(collateralAndDebtRequest) //RMV

    let safe: ISafeResponse[] = []

    for (let i = 0; i < collateralAndDebt.length; i++) {
        safe.push({
            collateral: parseWad(collateralAndDebt[i].lockedCollateral),
            debt: parseWad(collateralAndDebt[i].generatedDebt),
            createdAt: null,
            safeHandler: safeDetails.safes[i].toLowerCase(),
            safeId: safeDetails.ids[i].toString(),
        })
    }

    return {
        safes: safe,
        erc20Balances: [
            {
                balance: parseWad(multiCall[0]),
            },
        ],
        ...liquidationDataRpc,
    }
}

// returns single user safe by Id
const getSafeByIdRpc = async (
    config: SingleSafeConfig
): Promise<ISafeQuery> => {
    const { geb, address, safeId } = config
    const multiCall1Request = geb.multiCall([
        geb.contracts.safeManager.safes(safeId, true), // 0
        geb.contracts.coin.balanceOf(address, true), // 1
        geb.contracts.proxyRegistry.proxies(address, true), // 2
    ])

    // Fetch the liq data and the a multicall in parallel
    const [multiCall1, liquidationDataRpc] = await Promise.all([
        multiCall1Request,
        getLiquidationDataRpc(geb),
    ])

    const safeHandler = multiCall1[0]

    const multiCall2 = await geb.multiCall([
        geb.contracts.safeEngine.safes(utils.ETH_A, safeHandler, true), // 0
        geb.contracts.safeEngine.tokenCollateral(
            utils.ETH_A,
            safeHandler,
            true
        ), // 1
        geb.contracts.coin.allowance(config.address, multiCall1[2], true), // 2
    ])

    return {
        safes: [
            {
                collateral: parseWad(multiCall2[0].lockedCollateral),
                safeHandler,
                // We can't get this over RPC
                createdAt: null,
                debt: parseWad(multiCall2[0].generatedDebt),
                internalCollateralBalance: {
                    balance: parseWad(multiCall2[1]),
                },
                // We can't get these over RPC
                liquidationDiscount: null,
                modifySAFECollateralization: null,
                safeId: config.safeId,
            },
        ],
        erc20Balances: [
            {
                balance: parseWad(multiCall1[1]),
            },
        ],
        userProxies: [
            {
                address: multiCall1[2].toLowerCase(),
                coinAllowance: {
                    amount: parseWad(multiCall2[2]),
                },
            },
        ],
        ...liquidationDataRpc,
    }
}

const gebManager = {
    getUserSafesRpc,
    getSafeByIdRpc,
    getLiquidationDataRpc,
}

// Helper functions
export const parseWad = (val: BigNumber) => utils.wadToFixed(val).toString()
export const parseRay = (val: BigNumber) => utils.rayToFixed(val).toString()
export const parseRad = (val: BigNumber) => utils.radToFixed(val).toString()

export default gebManager
