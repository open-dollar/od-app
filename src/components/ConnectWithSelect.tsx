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

import type { Web3ReactHooks } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { Network } from '@web3-react/network'
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'

import { IconWrapper } from '~/components/ConnectedWalletIcon'
import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { GnosisSafe } from '@web3-react/gnosis-safe'
import metamask from '../assets/connectors/metamask.webp'
import walletConnectIcon from '../assets/connectors/walletConnectIcon.svg'
import coinbaseWalletIcon from '../assets/connectors/coinbaseWalletIcon.svg'
import gnosisWalletIcon from '../assets/connectors/gnosisWalletIcon.svg'

function getStatusIcon(connector: MetaMask | WalletConnectV2 | CoinbaseWallet | Network | GnosisSafe) {
    if (connector instanceof MetaMask) {
        return (
            <IconWrapper size={38}>
                <img src={metamask} alt={'metamask logo'} />
            </IconWrapper>
        )
    } else if (connector instanceof WalletConnectV2) {
        return (
            <IconWrapper size={38}>
                <img src={walletConnectIcon} alt={'wallet connect logo'} />
            </IconWrapper>
        )
    } else if (connector instanceof CoinbaseWallet) {
        return (
            <IconWrapper size={38}>
                <img src={coinbaseWalletIcon} alt={'coinbase wallet logo'} />
            </IconWrapper>
        )
    } else if (connector instanceof GnosisSafe) {
        return (
            <IconWrapper size={38}>
                <img src={gnosisWalletIcon} alt={'gnosis safe logo'} />
            </IconWrapper>
        )
    }
    return null
}

export function ConnectWithSelect({
    connector,
    isActive,
    error,
}: {
    connector: MetaMask | WalletConnectV2 | CoinbaseWallet | Network | GnosisSafe
    activeChainId: ReturnType<Web3ReactHooks['useChainId']>
    isActivating: ReturnType<Web3ReactHooks['useIsActivating']>
    isActive: ReturnType<Web3ReactHooks['useIsActive']>
    error: Error | undefined
    setError: (error: Error | undefined) => void
}) {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', color: 'white', alignItems: 'center' }}>
            {isActive ? (
                error ? (
                    <div>{getStatusIcon(connector)}</div>
                ) : (
                    <div
                        onClick={() => {
                            if (connector?.deactivate) {
                                void connector.deactivate()
                            } else {
                                void connector.resetState()
                            }
                        }}
                    >
                        <div>{getStatusIcon(connector)}</div>
                    </div>
                )
            ) : (
                <div>{getStatusIcon(connector)}</div>
            )}
        </div>
    )
}
