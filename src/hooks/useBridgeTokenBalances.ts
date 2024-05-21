import { useMemo } from 'react'
import { ethers } from 'ethers'
import { formatNumber } from '~/utils/helper'
import { TokenFetchData } from '@opendollar/sdk/lib/virtual/tokenData'
import { TokenData } from '@opendollar/sdk/lib/contracts/addreses'

/**
 * Get the user's wallet balance for the selected collateral
 * @param tokensData
 * @param tokensFetchedData
 * @param collateralName
 */
export const useCollateralBalances = (
    tokensData: { [chainId: number]: string[] },
) => {
    
  return tokensData
}
