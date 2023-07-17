import { formatUserSafe, IFetchSafesPayload, IUserSafeList } from '~/utils'
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
        availableHAI:
            safesResponse.erc20Balances && safesResponse.erc20Balances.length > 0
                ? safesResponse.erc20Balances[0].balance
                : '0',
        liquidationData,
    }
}

export const fetchUserSafesRaw = async (config: IFetchSafesPayload) => {
    const { address, geb } = config

    if (!geb) return
    let response = await gebManager.getUserSafesRpc({
        address: address.toLowerCase(),
        geb,
        tokensData: config.tokensData,
    })

    return response
}
