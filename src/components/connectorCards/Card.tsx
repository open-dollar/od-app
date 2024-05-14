// Copyright (C) 2023  Uniswap
// https://github.com/Uniswap/web3-react

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { ConnectWithSelect } from '../ConnectWithSelect'
import type { Connector } from '@web3-react/types'
import { MetaMask } from '@web3-react/metamask'
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'
import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { Network } from '@web3-react/network'
import { Web3ReactHooks } from '@web3-react/core'
import { Status } from '~/components/connectorCards/Status'
import styled from 'styled-components'
import { useCallback, useEffect, useState } from 'react'
import { getAddChainParameters } from '~/chains'
import { GnosisSafe } from '@web3-react/gnosis-safe'
import { useStoreActions } from '~/store'

interface Props {
    userInitiatedConnection: boolean
    onUserInitiatedConnection: () => void
    connector: MetaMask | WalletConnectV2 | CoinbaseWallet | Network | GnosisSafe
    activeChainId: ReturnType<Web3ReactHooks['useChainId']>
    chainIds?: ReturnType<Web3ReactHooks['useChainId']>[]
    isActivating: ReturnType<Web3ReactHooks['useIsActivating']>
    isActive: ReturnType<Web3ReactHooks['useIsActive']>
    error: Error | undefined
    setError: (error: Error | undefined) => void
    provider?: ReturnType<Web3ReactHooks['useProvider']>
    accounts?: string[]
}

function getName(connector: Connector) {
    if (connector instanceof MetaMask) return 'MetaMask'
    if (connector instanceof WalletConnectV2) return 'WalletConnect V2'
    if (connector instanceof CoinbaseWallet) return 'Coinbase Wallet'
    if (connector instanceof Network) return 'Network'
    if (connector instanceof GnosisSafe) return 'Gnosis Safe'
    return 'Unknown'
}

export function Card({
    userInitiatedConnection,
    onUserInitiatedConnection,
    connector,
    activeChainId,
    isActivating,
    isActive,
    error,
    setError,
}: Props) {
    const [desiredChainId, setDesiredChainId] = useState<number>(parseInt(process.env.REACT_APP_NETWORK_ID || '-1', 10))
    const { popupsModel: popupsActions } = useStoreActions((state) => state)

    const switchChain = useCallback(
        async (desiredChainId: number) => {
            setDesiredChainId(desiredChainId)
            onUserInitiatedConnection()

            try {
                if (
                    // If we're already connected to the desired chain, return
                    desiredChainId === activeChainId ||
                    // If they want to connect to the default chain and we're already connected, return
                    (desiredChainId === -1 && activeChainId !== undefined)
                ) {
                    setError(undefined)
                    return
                }

                if (desiredChainId === -1) {
                    // Disconnect from any existing connections
                    await connector.activate()
                    popupsActions.setIsConnectorsWalletOpen(false)
                } else if (connector instanceof WalletConnectV2 || connector instanceof Network) {
                    await connector.activate(desiredChainId)
                    popupsActions.setIsConnectorsWalletOpen(false)
                } else {
                    await connector.activate(getAddChainParameters(desiredChainId))
                    popupsActions.setIsConnectorsWalletOpen(false)
                }

                setError(undefined)
            } catch (error) {
                if (error instanceof Error) {
                    setError(error)
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [connector, activeChainId, setError, onUserInitiatedConnection]
    )

    /**
     * When user connects eagerly (`desiredChainId` is undefined) or to the default chain (`desiredChainId` is -1),
     * update the `desiredChainId` value so that <select /> has the right selection.
     */
    useEffect(() => {
        if (activeChainId && (!desiredChainId || desiredChainId === -1)) {
            setDesiredChainId(activeChainId)
        }
    }, [desiredChainId, activeChainId])

    return (
        <OptionCard onClick={() => switchChain(desiredChainId)}>
            <ConnectWithSelect
                connector={connector}
                activeChainId={activeChainId}
                isActivating={isActivating}
                isActive={isActive}
                error={error}
                setError={setError}
            />
            <NetworkCard>
                <NetworkHeader>{getName(connector)}</NetworkHeader>
                <div>
                    <Status
                        userInitiatedConnection={userInitiatedConnection}
                        isActivating={isActivating}
                        isActive={isActive}
                        error={error}
                    />
                </div>
            </NetworkCard>
        </OptionCard>
    )
}

const InfoCard = styled.button<{ active?: boolean }>`
    padding: 1.25rem;
    width: 100% !important;
`

const OptionCard = styled(InfoCard as any)`
    display: flex;
    flex-direction: row;
    border: 2px solid white;
    border-radius: 4px;
    min-height: 107px;
    align-items: center;
`

const NetworkCard = styled.div`
    display: flex;
    flex-direction: column;
    text-align: left;
    margin-left: 19.4px;
`

const NetworkHeader = styled.h3`
    font-family: 'Barlow', sans-serif;
    font-weight: 700;
    color: white;
    font-size: ${(props: any) => props.theme.font.large};
    line-height: 38.4px;
`
