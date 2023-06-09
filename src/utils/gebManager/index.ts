import { BigNumber } from 'ethers'
import { Geb, utils } from '@hai-on-op/sdk'
import {
    ILiquidationResponse,
    ISafeQuery,
    IUserSafeList,
} from '../interfaces'
import { fetchLiquidationData } from '../virtual/virtualLiquidationData'
import { fetchUserSafes } from '../virtual/virtualUserSafes'


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

    const liquidationData = await fetchLiquidationData(geb);

    return {
        systemState: {
            currentRedemptionPrice: {
                value: parseRay(liquidationData.redemptionPrice),
            },
            currentRedemptionRate: {
                // Calculate 8h exponentiation of the redemption rate in JS instead of solidity
                annualizedRate: Math.pow(
                    Number(parseRay(liquidationData.redemptionRate)),
                    3600 * 24 * 365
                ).toString(),
            },
            globalDebt: parseRad(liquidationData.globalDebt),
            globalDebtCeiling: parseRad(liquidationData.globalDebtCeiling),
            perSafeDebtCeiling: parseWad(liquidationData.safeDebtCeiling),
        },
        collateralType: {
            accumulatedRate: parseRay(liquidationData.accumulatedRate),
            currentPrice: {
                liquidationPrice: parseRay(liquidationData.liquidationPrice),
                safetyPrice: parseRay(liquidationData.safetyPrice),
                // Price not directly available but can be calculated
                // Price feed price = safetyPrice * safetyCRatio * redemptionPrice
                value: parseRad(
                    liquidationData.safetyPrice
                        .mul(liquidationData.safetyCRatio)
                        .mul(liquidationData.redemptionPrice)
                        .div(BigNumber.from(10).pow(36))
                ),
            },
            debtCeiling: parseWad(liquidationData.safeDebtCeiling),
            debtFloor: parseRad(liquidationData.debtFloor),
            liquidationCRatio: parseRay(liquidationData.liquidationCRatio),
            liquidationPenalty: parseWad(liquidationData.liquidationPenalty),
            safetyCRatio: parseRay(liquidationData.safetyCRatio),
            totalAnnualizedStabilityFee: Math.pow(
                Number(parseRay(liquidationData.stabilityFee)),
                3600 * 24 * 365 // Second per year
            ).toString(),
        },
    }
}

// Returns list of user safes
const getUserSafesRpc = async (
    config: UserListConfig
): Promise<IUserSafeList> => {
    const [userCoinBalance, safesData] = await fetchUserSafes(config.geb, config.address);

    const safes = safesData.map(safe => ({
        collateral: parseWad(safe.lockedCollateral),
        debt: parseWad(safe.generatedDebt),
        createdAt: null,
        safeHandler: safe.addy,
        safeId: safe.id.toString(),
        collateralType: safe.collateralType,
    }));

    return {
        safes,
        erc20Balances: [{
            balance: parseWad(userCoinBalance),
        }],
        ...await getLiquidationDataRpc(config.geb),
    }
}

// returns single user safe by Id
const getSafeByIdRpc = async (
    config: SingleSafeConfig
): Promise<ISafeQuery> => {
    const { geb, address, safeId } = config
    const multiCall1Request = Promise.all([
        geb.contracts.safeManager.safes(safeId), // 0
        geb.contracts.coin.balanceOf(address), // 1
        geb.contracts.proxyRegistry.proxies(address), // 2
    ])

    // Fetch the liq data and the a multicall in parallel
    const [multiCall1, liquidationDataRpc] = await Promise.all([
        multiCall1Request,
        getLiquidationDataRpc(geb),
    ])

    const safeHandler = multiCall1[0]

    const multiCall2 = await Promise.all([
        geb.contracts.safeEngine.safes(utils.ETH_A, safeHandler), // 0
        geb.contracts.safeEngine.tokenCollateral(
            utils.ETH_A,
            safeHandler,
        ), // 1
        geb.contracts.coin.allowance(config.address, multiCall1[2]), // 2
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
