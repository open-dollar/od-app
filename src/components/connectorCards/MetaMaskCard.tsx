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

import { useEffect, useState } from 'react'

import { hooks, metaMask } from '../../connectors/metaMask'
import { Card } from '~/components/connectorCards/Card'
import { useStoreActions } from '~/store'

const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider } = hooks

interface MetaMaskCardProps {
    error: Error | undefined
    setError: (error: Error | undefined) => void
}

export default function MetaMaskCard({ error, setError }: MetaMaskCardProps) {
    const [userInitiatedConnection, setUserInitiatedConnection] = useState(false)
    const chainId = useChainId()
    const accounts = useAccounts()
    const isActivating = useIsActivating()

    const isActive = useIsActive()

    const provider = useProvider()

    const { popupsModel: popupsActions } = useStoreActions((state) => state)

    useEffect(() => {
        metaMask.connectEagerly().catch(() => {})
        if (provider?.provider.isMetaMask && accounts) {
            popupsActions.setIsConnectorsWalletOpen(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleUserInitiatedConnection = () => {
        setUserInitiatedConnection(true)
    }

    return (
        <Card
            userInitiatedConnection={userInitiatedConnection}
            onUserInitiatedConnection={handleUserInitiatedConnection}
            connector={metaMask}
            activeChainId={chainId}
            isActivating={isActivating}
            isActive={isActive}
            error={error}
            setError={setError}
            accounts={accounts}
            provider={provider}
        />
    )
}
