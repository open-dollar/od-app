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
import { WalletConnect } from '@web3-react/walletconnect'
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'
import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { Network } from '@web3-react/network'
import { Web3ReactHooks } from '@web3-react/core'
import { Chain } from '~/components/connectorCards/Chain'
import { Status } from '~/components/connectorCards/Status'
import styled from 'styled-components'
import { useCallback, useEffect, useState } from 'react'
import { getAddChainParameters } from '~/chains'

interface Props {
    connector: MetaMask | WalletConnect | WalletConnectV2 | CoinbaseWallet | Network
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
    if (connector instanceof WalletConnect) return 'WalletConnect'
    if (connector instanceof CoinbaseWallet) return 'Coinbase Wallet'
    if (connector instanceof Network) return 'Network'
    return 'Unknown'
}

const InfoCard = styled.button<{ active?: boolean }>`
    background-color: ${(props) => props.theme.colors.background};
    padding: 1rem;
    outline: none;
    border: 1px solid ${(props) => props.theme.colors.border};
    border-radius: 12px;
    width: 100% !important;
    &:focus {
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
        background: ${(props) => props.theme.colors.placeholder};
    }
`

const OptionCard = styled(InfoCard as any)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 2rem;
    padding: 1rem;
`

export function Card({ connector, activeChainId, isActivating, isActive, error, setError }: Props) {
    const [desiredChainId, setDesiredChainId] = useState<number>(parseInt(process.env.REACT_APP_NETWORK_ID || '-1', 10))

    const switchChain = useCallback(
        async (desiredChainId: number) => {
            setDesiredChainId(desiredChainId)

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
                    await connector.activate()
                } else if (
                    connector instanceof WalletConnectV2 ||
                    connector instanceof WalletConnect ||
                    connector instanceof Network
                ) {
                    await connector.activate(desiredChainId)
                } else {
                    await connector.activate(getAddChainParameters(desiredChainId))
                }

                setError(undefined)
            } catch (error) {
                // @ts-ignore
                setError(error)
            }
        },
        [connector, activeChainId, setError]
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
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'left',
                }}
            >
                <span style={{ fontSize: '20px' }}>{getName(connector)}</span>
                <div>
                    <Status isActivating={isActivating} isActive={isActive} error={error} />
                </div>
                <Chain chainId={activeChainId} />
            </div>
            <ConnectWithSelect
                connector={connector}
                activeChainId={activeChainId}
                isActivating={isActivating}
                isActive={isActive}
                error={error}
                setError={setError}
            />
        </OptionCard>
    )
}
