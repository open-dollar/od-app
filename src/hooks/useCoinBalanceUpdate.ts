import { useEffect } from 'react'
import { utils } from 'ethers'
import { useStoreActions, useStoreState } from '~/store'

/**
 * Hook that updates the balances for OD and ODG tokens when their balance changes are detected.
 */
export default function useCoinBalanceUpdate() {
    const { connectWalletModel: connectWalletState } = useStoreState((state) => state)

    const {
        auctionModel: { setCoinBalances },
    } = useStoreActions((state) => state)

    useEffect(() => {
        const odBalance = connectWalletState?.tokensFetchedData.OD?.balanceE18
        const odgBalance = connectWalletState?.tokensFetchedData.ODG?.balanceE18

        if (odBalance && odgBalance) {
            setCoinBalances({
                od: utils.formatEther(odBalance),
                odg: utils.formatEther(odgBalance),
            })
        }
    }, [connectWalletState, setCoinBalances])
}
