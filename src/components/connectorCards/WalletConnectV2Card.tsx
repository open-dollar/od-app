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

import { URI_AVAILABLE } from '@web3-react/walletconnect-v2'
import { useEffect, useState } from 'react'
import { MAINNET_CHAINS } from '../../chains'
import { hooks, walletConnectV2 } from '../../connectors/walletConnectV2'
import { Card } from './Card'
import { useActiveWeb3React } from '~/hooks'
import { useStoreActions } from '~/store'

const CHAIN_IDS = Object.keys(MAINNET_CHAINS).map(Number)
const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider } = hooks

interface WalletConnectV2CardProps {
    error: Error | undefined
    setError: (error: Error | undefined) => void
}

export default function WalletConnectV2Card({ error, setError }: WalletConnectV2CardProps) {
    const [userInitiatedConnection, setUserInitiatedConnection] = useState(false)
    const chainId = useChainId()
    const accounts = useAccounts()
    const isActivating = useIsActivating()
    const isActive = useIsActive()
    const provider = useProvider()
    const { popupsModel: popupsActions } = useStoreActions((state) => state)
    const { connector } = useActiveWeb3React()

    // attempt to connect eagerly on mount
    useEffect(() => {
        walletConnectV2
            .connectEagerly()
            .then(() => userInitiatedConnection && popupsActions.setIsConnectorsWalletOpen(false))
            .catch(() => {})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connector])

    // log URI when available
    useEffect(() => {
        walletConnectV2.events.on(URI_AVAILABLE, (uri: string) => {
            console.log(`uri: ${uri}`)
        })
    }, [])

    const handleUserInitiatedConnection = () => {
        setUserInitiatedConnection(true)
    }

    return (
        <Card
            userInitiatedConnection={userInitiatedConnection}
            onUserInitiatedConnection={handleUserInitiatedConnection}
            connector={walletConnectV2}
            activeChainId={chainId}
            chainIds={CHAIN_IDS}
            isActivating={isActivating}
            isActive={isActive}
            error={error}
            setError={setError}
            accounts={accounts}
            provider={provider}
        />
    )
}
