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

import { coinbaseWallet, hooks } from '../../connectors/coinbaseWallet'
import { Card } from './Card'

const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider } = hooks

export default function CoinbaseWalletCard() {
    const chainId = useChainId()
    const accounts = useAccounts()
    const isActivating = useIsActivating()

    const isActive = useIsActive()

    const provider = useProvider()

    const [error, setError] = useState(undefined)

    // attempt to connect eagerly on mount
    useEffect(() => {
        void coinbaseWallet.connectEagerly().catch(() => {})
    }, [])

    return (
        <Card
            connector={coinbaseWallet}
            activeChainId={chainId}
            isActivating={isActivating}
            isActive={isActive}
            error={error}
            // @ts-ignore
            setError={setError}
            accounts={accounts}
            provider={provider}
        />
    )
}
