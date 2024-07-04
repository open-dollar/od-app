import { formatUserSafe, IFetchGlobalSafesPayload, IFetchSafesPayload, IUserSafeList } from '~/utils'
import gebManager from '~/utils/gebManager'

export const fetchUserSafes = async (config: IFetchSafesPayload) => {
    let response = await fetchUserSafesRaw(config)
    if (!response) return

    const safesResponse: IUserSafeList = response

    const liquidationData = {
        collateralLiquidationData: safesResponse.collateralLiquidationData,
        currentRedemptionPrice: safesResponse.systemState.currentRedemptionPrice.value,
        currentRedemptionRate: safesResponse.systemState.currentRedemptionRate.annualizedRate,
        globalDebt: safesResponse.systemState.globalDebt,
        globalDebtCeiling: safesResponse.systemState.globalDebtCeiling,
        perSafeDebtCeiling: safesResponse.systemState.perSafeDebtCeiling,
    }

    const userSafes = formatUserSafe(safesResponse.safes, liquidationData, config.tokensData)
    return {
        userSafes,
        availableOD:
            safesResponse.erc20Balances && safesResponse.erc20Balances.length > 0
                ? safesResponse.erc20Balances[0].balance
                : '0',
        liquidationData,
    }
}

export const fetchUserSafesRaw = async (config: IFetchSafesPayload) => {
    const { address, geb } = config

    if (!geb || !config.tokensData) {
        console.error('fetchUserSafesRaw: geb or tokensData not defined')
        return
    }
    let response = await gebManager.getUserSafesRpc({
        address: address.toLowerCase(),
        geb,
        tokensData: config.tokensData,
    })

    return response
}

export const fetchGlobalSafes = async (config: IFetchGlobalSafesPayload) => {
    let ownerAddressesResponse = await gebManager.getGlobalSafesRpc()
    if (!ownerAddressesResponse) return

    let safesResponse = await gebManager.fetchSafesForOwners(config, ownerAddressesResponse.ownerAddresses)
    if (!safesResponse) return

    const liquidationData = {
        collateralLiquidationData: safesResponse.collateralLiquidationData,
        currentRedemptionPrice: safesResponse.systemState.currentRedemptionPrice.value,
        currentRedemptionRate: safesResponse.systemState.currentRedemptionRate.annualizedRate,
        globalDebt: safesResponse.systemState.globalDebt,
        globalDebtCeiling: safesResponse.systemState.globalDebtCeiling,
        perSafeDebtCeiling: safesResponse.systemState.perSafeDebtCeiling,
    }

    const globalSafes = formatUserSafe(safesResponse.safes, liquidationData, config.tokensData)
    return {
        globalSafes,
        liquidationData,
    }
}
