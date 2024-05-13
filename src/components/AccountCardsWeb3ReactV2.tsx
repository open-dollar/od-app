import React, { useState } from 'react'
import MetaMaskCard from '~/components/connectorCards/MetaMaskCard'
import CoinbaseWalletCard from '~/components/connectorCards/CoinbaseWalletCard'
import WalletConnectV2Card from '~/components/connectorCards/WalletConnectV2Card'
import GnosisSafeCard from '~/components/connectorCards/GnosisCard'
import styled from 'styled-components'
import { Chain } from '~/components/connectorCards/Chain'
import { useActiveWeb3React } from '~/hooks'
import { MetaMask } from '@web3-react/metamask'
import { Network } from '@web3-react/network'

export default function AccountCardsWeb3ReactV2() {
    const [error, setError] = useState<Error | undefined>(undefined)
    const { chainId } = useActiveWeb3React()
    const { connector } = useActiveWeb3React()

    return (
        <>
            <div
                style={{ display: 'flex', flexFlow: 'wrap', fontFamily: 'Barlow', textAlign: 'start', rowGap: '12px' }}
            >
                <ErrorContainer>
                    {error && connector instanceof MetaMask ? (
                        <ErrorText>{`Either Metamask is not installed, or you have multiple plugin wallets. Please refresh page and try again`}</ErrorText>
                    ) : (
                        <></>
                    )}
                    {error && !(connector instanceof MetaMask) ? <ErrorText>Error: {error?.message}</ErrorText> : <></>}
                    {String(chainId) !== process.env.REACT_APP_NETWORK_ID && chainId !== undefined ? (
                        <ErrorText>{'Wrong Network'}</ErrorText>
                    ) : (
                        <></>
                    )}
                </ErrorContainer>
                {connector instanceof Network ? <></> : <Chain chainId={chainId} />}
                <WalletConnectV2Card error={error} setError={setError} />
                <MetaMaskCard error={error} setError={setError} />
                <CoinbaseWalletCard error={error} setError={setError} />
                <GnosisSafeCard error={error} setError={setError} />
            </div>
        </>
    )
}

const ErrorContainer = styled.div`
    display: flex;
    text-align: start;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    width: 100%;
    min-height: 63px;
`

const ErrorText = styled.div`
    font-family: 'Barlow', sans-serif;
    font-size: ${(props: any) => props.theme.font.small};
    color: ${(props: any) => props.theme.colors.tertiary};
    justify-content: start;
    text-align: center;
`
