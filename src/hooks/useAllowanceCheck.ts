import { useEffect } from 'react'
import { utils } from 'ethers'
import { useStoreActions, useStoreState } from '~/store'
import { useActiveWeb3React, useTokenContract } from '~/hooks'
import { getTokenList } from '@opendollar/sdk/lib/contracts/addreses'
import { ETH_NETWORK } from '~/utils'
import { GebDeployment } from '@opendollar/sdk'

/**
 * Hook to fetch and set the allowance of coin and protocol tokens.
 */
export default function useAllowanceCheck() {
    const { connectWalletModel: connectWalletActions } = useStoreActions((state) => state)
    const { account } = useActiveWeb3React()
    const { connectWalletModel: connectWalletState } = useStoreState((state) => state)

    const coinTokenContract = useTokenContract(getTokenList(ETH_NETWORK as GebDeployment).OD.address)
    const protTokenContract = useTokenContract(getTokenList(ETH_NETWORK as GebDeployment).ODG.address)

    useEffect(() => {
        if (account && connectWalletState?.proxyAddress && coinTokenContract && protTokenContract) {
            try {
                protTokenContract.allowance(account, connectWalletState?.proxyAddress).then((allowance) => {
                    const formattedAllowance = utils.formatEther(allowance)
                    connectWalletActions.setProtAllowance(formattedAllowance)
                })

                coinTokenContract.allowance(account, connectWalletState?.proxyAddress).then((allowance) => {
                    const formattedAllowance = utils.formatEther(allowance)
                    connectWalletActions.setCoinAllowance(formattedAllowance)
                })
            } catch (e) {
                console.debug('Error fetching allowance', e)
            }
        }
    }, [account, connectWalletState?.proxyAddress, coinTokenContract, protTokenContract, connectWalletActions])
}
