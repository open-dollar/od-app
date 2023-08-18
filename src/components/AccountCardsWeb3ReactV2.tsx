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

import MetaMaskCard from '~/components/connectorCards/MetaMaskCard'
import CoinbaseWalletCard from '~/components/connectorCards/CoinbaseWalletCard'
import WalletConnectV2Card from '~/components/connectorCards/WalletConnectV2Card'
import React from 'react'

export default function AccountCardsWeb3ReactV2() {
    return (
        <>
            <div style={{ display: 'flex', flexFlow: 'wrap', fontFamily: 'sans-serif' }}>
                <MetaMaskCard />
                <WalletConnectV2Card />
                <CoinbaseWalletCard />
            </div>
        </>
    )
}
