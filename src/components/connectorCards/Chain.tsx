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
import { CHAINS } from '~/chains'
import styled from "styled-components";

export function Chain({ chainId }: { chainId: ReturnType<Web3ReactHooks['useChainId']> }) {
    if (chainId === undefined) return null

    const name = chainId ? CHAINS[chainId]?.name : undefined

    if (name) {
        return (
            <ChainHeader>
                Chain:{' '}
                <b>
                    {name} ({chainId})
                </b>
            </ChainHeader>
        )
    }

    return (
        <ChainHeader>
            Chain Id: <b>{chainId}</b>
        </ChainHeader>
    )
}

const ChainHeader = styled.div`
    font-weight: 400;
    font-family: 'Open Sans', serif;
    font-size: 16px;
    line-height: 24px;
    color: #E2F1FF;
`
