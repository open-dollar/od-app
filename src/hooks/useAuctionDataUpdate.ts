import { useEffect } from 'react'
import { ethers } from 'ethers'
import { useStoreActions, useStoreState } from '~/store'

/**
 * Hook that updates internal balances based on auction data. It checks for changes
 * in auction data and updates the protocol token and coin token internal balances accordingly.
 */
export default function useAuctionDataUpdate() {
    const { auctionModel } = useStoreState((state) => state)
    const { setProtInternalBalance, setInternalBalance } = useStoreActions((state) => state.auctionModel)

    useEffect(() => {
        if (auctionModel.auctionsData) {
            const { protocolTokenProxyBalance, coinTokenSafeBalance } = auctionModel.auctionsData

            if (protocolTokenProxyBalance) {
                const formattedProtBalance = ethers.utils.formatEther(protocolTokenProxyBalance)
                setProtInternalBalance(formattedProtBalance)
            }

            if (coinTokenSafeBalance) {
                const formattedCoinBalance = ethers.utils.formatUnits(coinTokenSafeBalance, 45)
                setInternalBalance(formattedCoinBalance)
            }
        }
    }, [auctionModel?.auctionsData, setProtInternalBalance, setInternalBalance])
}
