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

import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'

import { useEagerConnect, useInactiveListener } from '../../hooks'
import { network } from '~/connectors/network'
import { IS_IN_IFRAME } from '~/utils'
import { GnosisSafe } from '@web3-react/gnosis-safe'
import { gnosisSafe } from '~/connectors/gnosisSafe'

export default function Web3ReactManager({ children }: { children: JSX.Element }) {
    const { isActive, connector } = useWeb3React()

    // try to eagerly connect to an injected provider, if it exists and has granted access already
    const triedEager = useEagerConnect()

    // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
    useInactiveListener(!triedEager)

    // handle delayed loader state
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_showLoader, setShowLoader] = useState(false)
    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowLoader(true)
        }, 600)

        return () => {
            clearTimeout(timeout)
        }
    }, [])

    // If the RPC connection isn't active, and we've tried connecting eagerly already, and we're not in Gnosis Safe context, connect to RPC
    useEffect(() => {
        if (!isActive && triedEager && !(connector instanceof GnosisSafe) && !IS_IN_IFRAME) {
            void network.activate().catch(() => {
                console.debug('Failed to connect to network')
            })
        } else if (!isActive && triedEager && IS_IN_IFRAME) {
            void gnosisSafe.activate().catch(() => {
                console.debug('Failed to connect to gnosis safe')
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return children
}
