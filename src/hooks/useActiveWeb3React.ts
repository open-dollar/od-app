import { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import {BaseProvider, Web3Provider} from '@ethersproject/providers'
import {getPriorityConnector, useWeb3React, Web3ReactPriorityHooks} from '@web3-react/core'

import type { Connector } from '@web3-react/types'

import { gnosisSafe, injected } from '~/connectors'
import { NetworkContextName } from '~/utils/constants'
import { IS_IN_IFRAME } from '~/utils/helper'
import { ChainId } from '~/utils/interfaces'

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
    const { isActive } = useWeb3React() // specifically using useWeb3ReactCore because of what this hook does
    const [tried, setTried] = useState(false)

    // gnosisSafe.isSafeApp() races a timeout against postMessage, so it delays pageload if we are not in a safe app;
    // if we are not embedded in an iframe, it is not worth checking
    const [triedSafe, setTriedSafe] = useState(!IS_IN_IFRAME)

    // first, try connecting to a gnosis safe
    useEffect(() => {
        if (!triedSafe) {
            gnosisSafe.isSafeApp().then((loadedInSafe) => {
                if (loadedInSafe) {
                    // activate(gnosisSafe, undefined, true).catch((e) => {
                    //     console.log(e, 'e')
                    //
                    //     setTriedSafe(true)
                    // })
                } else {
                    setTriedSafe(true)
                }
            })
        }
    }, [setTriedSafe, triedSafe])

    useEffect(() => {
        if (!isActive && triedSafe) {
            injected.isAuthorized().then((isAuthorized) => {
                if (isAuthorized) {
                    // activate(injected, undefined, true).catch(() => {
                    //     setTried(true)
                    // })
                } else {
                    if (isMobile && window.ethereum) {
                        // activate(injected, undefined, true).catch(() => {
                        //     setTried(true)
                        // })
                    } else {
                        setTried(true)
                    }
                }
            })
        }
    }, [triedSafe])

    // if the connection worked, wait until we get confirmation of that to flip the flag
    useEffect(() => {
        if (isActive) {
            setTried(true)
        }
    }, [isActive])

    return tried
}

/**
 * Use for network and injected - logs user in
 * and out after checking what network they're on
 */
export function useInactiveListener(suppress = false) {
    const { isActive} = useWeb3React() // specifically using useWeb3React because of what this hook does

    useEffect(() => {
        const { ethereum } = window

        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length > 0) {
                // eat errors
                // activate(injected, undefined, true).catch((error) => {
                //     console.error('Failed to activate after accounts changed', error)
                // })
            }
        }

        const handleChainChanged = () => {
            // eat errors
            // activate(injected, undefined, true).catch((error) => {
            //     console.error('Failed to activate after chain changed', error)
            // })
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
        // eslint-disable-next-line
    }, [isActive, suppress])
}
