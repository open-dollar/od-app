import { formatUserSafe } from '../utils/helper'
import {
    IFetchSafeById,
    IFetchSafesPayload,
    ISafeQuery,
    IUserSafeList,
} from '../utils/interfaces'
import gebManager from '../utils/gebManager'

export const fetchUserSafes = async (
    config: IFetchSafesPayload
) => {
    let response = await fetchUserSafesRaw(config);
    if(!response) return

    const safesResponse: IUserSafeList = response

    const liquidationData = {
        ...safesResponse.collateralType,
        currentRedemptionPrice:
            safesResponse.systemState.currentRedemptionPrice.value,
        currentRedemptionRate:
            safesResponse.systemState.currentRedemptionRate.annualizedRate,
        globalDebt: safesResponse.systemState.globalDebt,
        globalDebtCeiling: safesResponse.systemState.globalDebtCeiling,
        perSafeDebtCeiling: safesResponse.systemState.perSafeDebtCeiling,
    }

    const userSafes = formatUserSafe(safesResponse.safes, liquidationData)
    return {
        userSafes,
        availableHAI:
            safesResponse.erc20Balances &&
                safesResponse.erc20Balances.length > 0
                ? safesResponse.erc20Balances[0].balance
                : '0',
        liquidationData,
    }
}

export const fetchUserSafesRaw = async (
    config: IFetchSafesPayload,
) => {
    const { address, geb } = config

    if (!geb) return
    let response = await gebManager.getUserSafesRpc({
        address: address.toLowerCase(),
        geb,
    })

    return response
}

export const fetchSafeById = async (
    config: IFetchSafeById,
) => {
    let response = await fetchSafeByIdRaw(config);
    if(!response) return

    const safeResponse: ISafeQuery = response

    const liquidationData = {
        ...safeResponse.collateralType,
        currentRedemptionPrice:
            safeResponse.systemState.currentRedemptionPrice.value,
        currentRedemptionRate:
            safeResponse.systemState.currentRedemptionRate.annualizedRate,
        globalDebt: safeResponse.systemState.globalDebt,
        globalDebtCeiling: safeResponse.systemState.globalDebtCeiling,
        perSafeDebtCeiling: safeResponse.systemState.perSafeDebtCeiling,
    }

    const safe = formatUserSafe(response.safes, liquidationData)
    const proxyData =
        safeResponse.userProxies.length > 0 ? safeResponse.userProxies[0] : null

    const erc20Balance =
        safeResponse.erc20Balances && safeResponse.erc20Balances.length > 0
            ? safeResponse.erc20Balances[0].balance
            : '0'

    return {
        safe,
        proxyData,
        erc20Balance,
        liquidationData,
    }
}

export const fetchSafeByIdRaw = async (
    config: IFetchSafeById,
) => {
    const { address, safeId, geb } = config

    if (!geb) return
    let response = await gebManager.getSafeByIdRpc({
        address: address.toLowerCase(),
        safeId,
        geb,
    })

    if (!response || !response.safes.length) return

    return response
}
