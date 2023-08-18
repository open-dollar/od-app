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

import type { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import type { Web3ReactHooks } from '@web3-react/core'
import { useEffect, useState } from 'react'

function useBalances(
    provider?: ReturnType<Web3ReactHooks['useProvider']>,
    accounts?: string[]
): BigNumber[] | undefined {
    const [balances, setBalances] = useState<BigNumber[] | undefined>()

    useEffect(() => {
        if (provider && accounts?.length) {
            let stale = false

            void Promise.all(accounts.map((account) => provider.getBalance(account))).then((balances) => {
                if (stale) return
                setBalances(balances)
            })

            return () => {
                stale = true
                setBalances(undefined)
            }
        }
    }, [provider, accounts])

    return balances
}

export function Accounts({
    accounts,
    provider,
    ENSNames,
}: {
    accounts: ReturnType<Web3ReactHooks['useAccounts']>
    provider: ReturnType<Web3ReactHooks['useProvider']>
    ENSNames: ReturnType<Web3ReactHooks['useENSNames']>
}) {
    const balances = useBalances(provider, accounts)

    if (accounts === undefined) return null

    return (
        <div>
            Accounts:{' '}
            <b>
                {accounts.length === 0
                    ? 'None'
                    : accounts?.map((account, i) => (
                          <ul key={account} style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {ENSNames?.[i] ?? account}
                              {balances?.[i] ? ` (Ξ${formatEther(balances[i])})` : null}
                          </ul>
                      ))}
            </b>
        </div>
    )
}
