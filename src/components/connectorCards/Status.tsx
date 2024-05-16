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
import styled from 'styled-components'
import { useStoreActions, useStoreState } from '~/store'
import { useEffect } from 'react'

export function Status({
    userInitiatedConnection,
    isActivating,
    isActive,
    error,
}: {
    userInitiatedConnection: boolean
    isActivating: ReturnType<Web3ReactHooks['useIsActivating']>
    isActive: ReturnType<Web3ReactHooks['useIsActive']>
    error?: Error
}) {
    const { popupsModel: popupsActions } = useStoreActions((state) => state)
    const { popupsModel: popupsState } = useStoreState((state) => state)

    // Close the wallet modal if the user is connected and not changing wallets
    useEffect(() => {
        if (isActive) {
            if (!popupsState.isChangeWalletActive) {
                popupsActions.setIsConnectorsWalletOpen(false)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive])

    return (
        <StatusText>
            {isActive ? (
                <>Connected</>
            ) : error ? (
                <></>
            ) : isActivating && userInitiatedConnection ? (
                <>Awaiting Connection...</>
            ) : (
                <></>
            )}
        </StatusText>
    )
}

const StatusText = styled.div`
    font-weight: 400;
    font-family: 'Open Sans', serif;
    font-size: 16px;
    line-height: 24px;
    color: #e2f1ff;
`
