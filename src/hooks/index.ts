import { useEffect, useState } from 'react'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { isMobile } from 'react-device-detect'
import { gnosisSafe, injected } from '../connectors'
import { NetworkContextName } from '../utils/constants'
import { ChainId } from '../utils/interfaces'
import { IS_IN_IFRAME } from 'src/utils/helper'

export function useActiveWeb3React(): Web3ReactContextInterface<Web3Provider> & {
    chainId?: ChainId
} {
    const context = useWeb3ReactCore<Web3Provider>()
    const contextNetwork = useWeb3ReactCore<Web3Provider>(NetworkContextName)
    return context.active ? context : contextNetwork
}

export function useEagerConnect() {
    const { activate, active } = useWeb3ReactCore() // specifically using useWeb3ReactCore because of what this hook does
    const [tried, setTried] = useState(false)

    // gnosisSafe.isSafeApp() races a timeout against postMessage, so it delays pageload if we are not in a safe app;
    // if we are not embedded in an iframe, it is not worth checking
    const [triedSafe, setTriedSafe] = useState(!IS_IN_IFRAME)

    // first, try connecting to a gnosis safe
    useEffect(() => {
        if (!triedSafe) {
            gnosisSafe.isSafeApp().then((loadedInSafe) => {
                if (loadedInSafe) {
                    activate(gnosisSafe, undefined, true).catch((e) => {
                        console.log(e, 'e')

                        setTriedSafe(true)
                    })
                } else {
                    setTriedSafe(true)
                }
            })
        }
    }, [activate, setTriedSafe, triedSafe])

    useEffect(() => {
        if (!active && triedSafe) {
            injected.isAuthorized().then((isAuthorized) => {
                if (isAuthorized) {
                    activate(injected, undefined, true).catch(() => {
                        setTried(true)
                    })
                } else {
                    if (isMobile && window.ethereum) {
                        activate(injected, undefined, true).catch(() => {
                            setTried(true)
                        })
                    } else {
                        setTried(true)
                    }
                }
            })
        }
    }, [activate, active, triedSafe])

    // if the connection worked, wait until we get confirmation of that to flip the flag
    useEffect(() => {
        if (active) {
            setTried(true)
        }
    }, [active])

    return tried
}

/**
 * Use for network and injected - logs user in
 * and out after checking what network they're on
 */
export function useInactiveListener(suppress = false) {
    const { active, error, activate } = useWeb3ReactCore() // specifically using useWeb3React because of what this hook does

    useEffect(() => {
        const { ethereum } = window

        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length > 0) {
                // eat errors
                activate(injected, undefined, true).catch((error) => {
                    console.error(
                        'Failed to activate after accounts changed',
                        error
                    )
                })
            }
        }

        const handleChainChanged = () => {
            // eat errors
            activate(injected, undefined, true).catch((error) => {
                console.error('Failed to activate after chain changed', error)
            })
        }

        if (ethereum && ethereum.on && !active && !error && !suppress) {
            ethereum.on('chainChanged', handleChainChanged)
            ethereum.on('accountsChanged', handleAccountsChanged)

            return () => {
                if (ethereum.removeListener) {
                    ethereum.removeListener('chainChanged', handleChainChanged)
                    ethereum.removeListener(
                        'accountsChanged',
                        handleAccountsChanged
                    )
                }
            }
        }

        return undefined
        // eslint-disable-next-line
    }, [active, error, suppress, activate])
}
