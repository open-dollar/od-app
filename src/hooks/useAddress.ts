import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { JsonRpcProvider } from '@ethersproject/providers'

/**
 * Return the wallet address or ENS name if applicable
 * @param walletAddress
 * @param startingIndex
 */
export function useAddress(walletAddress: string | undefined, startingIndex: number = 0) {
    const { provider } = useWeb3React()
    const [address, setAddress] = useState<string | undefined>('')

    const rpcProvider = new JsonRpcProvider('https://eth.llamarpc.com', 1)

    useEffect(() => {
        let isMounted = true

        const fetchData = async () => {
            if (walletAddress) {
                try {
                    const ensName = await rpcProvider.lookupAddress(walletAddress)
                    if (isMounted) {
                        setAddress(
                            ensName || `${walletAddress.slice(startingIndex, 4 + 2)}...${walletAddress.slice(-4)}`
                        )
                    }
                } catch (error) {
                    if (isMounted) {
                        setAddress(`${walletAddress.slice(startingIndex, 4 + 2)}...${walletAddress.slice(-4)}`)
                    }
                }
            }
        }

        fetchData()

        return () => {
            isMounted = false
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provider, walletAddress, startingIndex])

    return address
}
