import axios from 'axios'
import { BigNumber } from 'ethers'
import { fetchLiquidationData, Geb, TokenLiquidationData, utils } from '@opendollar/sdk'
import { ILiquidationResponse, IUserSafeList, IOwnerAddressesResponse } from '../interfaces'
import { fetchUserSafes } from '@opendollar/sdk/lib/virtual/virtualUserSafes.js'
import { TokenData } from '@opendollar/sdk/lib/contracts/addreses'
import { OD_API_URL } from '~/utils/constants'

interface UserListConfig {
    geb: Geb
    address: string
    tokensData: { [key: string]: TokenData }
    proxy_not?: null
    safeId_not?: null
}

interface GlobalSafesConfig {
    geb: Geb
    tokensData: { [key: string]: TokenData }
}

// returns LiquidationData
const getLiquidationDataRpc = async (
    geb: Geb,
    tokensData: { [key: string]: TokenData }
): Promise<ILiquidationResponse> => {
    const liquidationData = await fetchLiquidationData(geb, tokensData)

    const systemState = {
        currentRedemptionPrice: {
            value: parseRay(liquidationData.redemptionPrice),
        },
        currentRedemptionRate: {
            // Calculate 8h exponentiation of the redemption rate
            annualizedRate: Math.pow(Number(parseRay(liquidationData.redemptionRate)), 3600 * 24 * 365).toString(),
        },
        globalDebt: parseRad(liquidationData.globalDebt),
        globalDebtCeiling: parseRad(liquidationData.globalDebtCeiling),
        perSafeDebtCeiling: parseWad(liquidationData.safeDebtCeiling),
    }

    const parsedLiquidationData = liquidationData.tokensLiquidationData.map((tokenLiquidationData) =>
        parseTokenLiquidationData(liquidationData.redemptionPrice, tokenLiquidationData)
    )

    const tokensDataCopy = JSON.parse(JSON.stringify(tokensData))

    // Non-collateral tokens like OD and ODG are not included in the liquidation data
    Object.keys(tokensDataCopy).forEach((key) => {
        if (!tokensDataCopy[key].isCollateral) {
            delete tokensDataCopy[key]
        }
    })

    const collateralLiquidationData = Object.keys(tokensDataCopy).reduce((accumulator, key, index) => {
        return { ...accumulator, [key]: parsedLiquidationData[index] }
    }, {})

    return {
        systemState,
        collateralLiquidationData,
    }
}

function parseTokenLiquidationData(redemptionPrice: BigNumber, tokenLiquidationData: TokenLiquidationData) {
    return {
        accumulatedRate: parseRay(tokenLiquidationData.accumulatedRate),
        currentPrice: {
            liquidationPrice: parseRay(tokenLiquidationData.liquidationPrice),
            safetyPrice: parseRay(tokenLiquidationData.safetyPrice),
            // Price not directly available but can be calculated
            // Price feed price = safetyPrice * safetyCRatio * redemptionPrice
            value: parseRad(
                tokenLiquidationData.safetyPrice
                    .mul(tokenLiquidationData.safetyCRatio)
                    .mul(redemptionPrice)
                    .div(BigNumber.from(10).pow(36))
            ),
        },
        debtFloor: parseRad(tokenLiquidationData.debtFloor),
        liquidationCRatio: parseRay(tokenLiquidationData.liquidationCRatio),
        liquidationPenalty: parseWad(tokenLiquidationData.liquidationPenalty),
        safetyCRatio: parseRay(tokenLiquidationData.safetyCRatio),
        totalAnnualizedStabilityFee: (
            Math.round(
                Math.pow(
                    Number(parseRay(tokenLiquidationData.stabilityFee)),
                    3600 * 24 * 365 // Second per year
                ) * 10000
            ) / 10000
        ).toString(),
    }
}

// Returns list of user safes
const getUserSafesRpc = async (config: UserListConfig): Promise<IUserSafeList> => {
    const [userCoinBalance, safesData] = await fetchUserSafes(config.geb, config.address)

    const safes = safesData.map((safe) => ({
        collateral: parseWad(safe.lockedCollateral),
        debt: parseWad(safe.generatedDebt),
        createdAt: null,
        safeHandler: safe.addy,
        safeId: safe.id.toString(),
        collateralType: safe.collateralType,
        ownerAddress: config.address,
    }))

    return {
        safes,
        erc20Balances: [
            {
                balance: parseWad(userCoinBalance),
            },
        ],
        ...(await getLiquidationDataRpc(config.geb, config.tokensData)),
    }
}

const getGlobalSafesRpc = async (): Promise<IOwnerAddressesResponse> => {
    const response = await axios.get(`${OD_API_URL}/vaults`)
    const ownerAddresses: string[] = Array.from(new Set(response.data.details.map((safe: any) => safe.owner)))
    return { ownerAddresses }
}

const fetchSafesForOwners = async (config: GlobalSafesConfig, ownerAddresses: string[]): Promise<IUserSafeList> => {
    const allSafes: any[] = []
    const safePromises = ownerAddresses.map((address) => getUserSafesRpc({ ...config, address }))

    const results = await Promise.all(safePromises)
    results.forEach((result) => {
        allSafes.push(...result.safes)
    })

    const liquidationData = await getLiquidationDataRpc(config.geb, config.tokensData)
    return {
        safes: allSafes,
        erc20Balances: [],
        ...liquidationData,
    }
}

const gebManager = {
    getUserSafesRpc,
    getGlobalSafesRpc,
    fetchSafesForOwners,
    getLiquidationDataRpc,
}

export const parseWad = (val: BigNumber) => utils.wadToFixed(val).toString()
export const parseRay = (val: BigNumber) => utils.rayToFixed(val).toString()
export const parseRad = (val: BigNumber) => utils.radToFixed(val).toString()

export default gebManager
