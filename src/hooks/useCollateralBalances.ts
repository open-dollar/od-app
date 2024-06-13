import { useMemo } from 'react'
import { ethers } from 'ethers'
import { TokenFetchData } from '@opendollar/sdk/lib/virtual/tokenData'
import { TokenData } from '@opendollar/sdk/lib/contracts/addreses'

/**
 * Get the user's wallet balance for the selected collateral
 * @param tokensData
 * @param tokensFetchedData
 * @param collateralName
 */
export const useCollateralBalances = (
    tokensData: { [p: string]: TokenData },
    tokensFetchedData: { [p: string]: TokenFetchData },
    collateralName: string
) => {
    const collaterals = useMemo(() => {
        return tokensData ? Object.values(tokensData).filter((token) => token.isCollateral) : []
    }, [tokensData])

    const formattedCollateralBalances = useMemo(() => {
        return collaterals.reduce((acc, collateral) => {
            const balance = tokensFetchedData[collateral.symbol]?.balanceE18 || '0'
            const formattedBalance = ethers.utils.formatEther(balance)
            return { ...acc, [collateral.symbol]: formattedBalance }
        }, {} as { [symbol: string]: string })
    }, [collaterals, tokensFetchedData])

    const selectedCollateralBalance = formattedCollateralBalances[collateralName]

    const selectedTokenBalance = useMemo(() => {
        return selectedCollateralBalance
    }, [selectedCollateralBalance])

    return selectedTokenBalance
}
