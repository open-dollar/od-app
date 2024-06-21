import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { JsonRpcProvider } from '@ethersproject/providers'
import { RPC_URL_ETHEREUM } from '~/chains'
import { useStoreActions, useStoreState } from '~/store'

const rpcProvider = new JsonRpcProvider(RPC_URL_ETHEREUM, 1)

/**
 * Return the wallet address or ENS name if applicable
 * @param walletAddress
 * @param startingIndex
 * @param skipEnsCheck
 */
export function useAddress(
    walletAddress: string | undefined,
    startingIndex: number = 0,
    skipEnsCheck: boolean = false
) {
    const { provider } = useWeb3React()
    const [address, setAddress] = useState<string | undefined>('')
    const ensCache = useStoreState((state) => state.boltsModel.ensCache)
    const setEnsCache = useStoreActions((actions) => actions.boltsModel.setEnsCache)

    useEffect(() => {
        let isMounted = true

        const fetchData = async () => {
            if (walletAddress) {
                if (skipEnsCheck) {
                    const displayName = `${walletAddress.slice(startingIndex, 4 + 2)}...${walletAddress.slice(-4)}`
                    if (isMounted) {
                        setAddress(displayName)
                    }
                } else if (ensCache[walletAddress]) {
                    setAddress(ensCache[walletAddress])
                } else {
                    try {
                        const ensName = await rpcProvider.lookupAddress(walletAddress)
                        const displayName =
                            ensName || `${walletAddress.slice(startingIndex, 4 + 2)}...${walletAddress.slice(-4)}`
                        if (isMounted) {
                            setAddress(displayName)
                            setEnsCache({ address: walletAddress, ens: displayName })
                        }
                    } catch (error) {
                        const displayName = `${walletAddress.slice(startingIndex, 4 + 2)}...${walletAddress.slice(-4)}`
                        if (isMounted) {
                            setAddress(displayName)
                            setEnsCache({ address: walletAddress, ens: displayName })
                        }
                    }
                }
            }
        }

        fetchData()

        return () => {
            isMounted = false
        }
    }, [provider, walletAddress, startingIndex, skipEnsCheck, ensCache, setEnsCache])

    return address
}
