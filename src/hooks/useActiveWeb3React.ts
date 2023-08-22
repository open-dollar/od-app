import { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { BaseProvider, Web3Provider } from '@ethersproject/providers'
import { getPriorityConnector, useWeb3React, Web3ReactPriorityHooks } from '@web3-react/core'

import type { Connector } from '@web3-react/types'

import { injected } from '~/connectors'

export type Web3ContextType<T extends BaseProvider = Web3Provider> = {
    connector: Connector
    chainId?: ReturnType<Web3ReactPriorityHooks['useSelectedChainId']>
    accounts: ReturnType<Web3ReactPriorityHooks['useSelectedAccounts']>
    isActivating: ReturnType<Web3ReactPriorityHooks['useSelectedIsActivating']>
    account: ReturnType<Web3ReactPriorityHooks['useSelectedAccount']>
    isActive: ReturnType<Web3ReactPriorityHooks['useSelectedIsActive']>
    provider: T | undefined
    ENSNames: ReturnType<Web3ReactPriorityHooks['useSelectedENSNames']>
    ENSName: ReturnType<Web3ReactPriorityHooks['useSelectedENSName']>
    hooks: ReturnType<typeof getPriorityConnector>
}

export function useActiveWeb3React(): Web3ContextType {
    const context = useWeb3React()
    const contextNetwork = useWeb3React()
    // @ts-ignore
    return context.isActive ? context : contextNetwork
}

export function useEagerConnect() {
    const { isActive, connector } = useWeb3React() // specifically using useWeb3ReactCore because of what this hook does

    useEffect(() => {
        if (!isActive) {
            injected.isAuthorized().then((isAuthorized) => {
                if (isAuthorized) {
                    connector.activate(injected, undefined, true)
                } else {
                    if (isMobile && window.ethereum) {
                        connector.activate(injected, undefined, true)
                    }
                }
            })
        }
    }, [isActive])

    return true
}

/**
 * Use for network and injected - logs user in
 * and out after checking what network they're on
 */
export function useInactiveListener(suppress = false) {
    const { isActive, connector } = useWeb3React() // specifically using useWeb3React because of what this hook does

    useEffect(() => {
        const { ethereum } = window

        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length > 0) {
                // eat errors
                connector.activate(injected, undefined, true)
            }
        }

        const handleChainChanged = () => {
            // eat errors
            connector.activate(injected, undefined, true)
        }

        // @ts-ignore
        if (ethereum && ethereum.on && !isActive && !suppress) {
            // @ts-ignore
            ethereum.on('chainChanged', handleChainChanged)
            // @ts-ignore
            ethereum.on('accountsChanged', handleAccountsChanged)

            return () => {
                // @ts-ignore
                if (ethereum.removeListener) {
                    // @ts-ignore
                    ethereum.removeListener('chainChanged', handleChainChanged)
                    // @ts-ignore
                    ethereum.removeListener('accountsChanged', handleAccountsChanged)
                }
            }
        }

        return undefined
    }, [isActive, suppress])
}
