import MetaMaskCard from "~/components/connectorCards/MetaMaskCard";
import CoinbaseWalletCard from "~/components/connectorCards/CoinbaseWalletCard";
import WalletConnectV2Card from "~/components/connectorCards/WalletConnectV2Card";
import React from "react";

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