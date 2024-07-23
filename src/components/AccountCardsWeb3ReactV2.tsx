import React, { useState, useEffect, useRef } from 'react'
import MetaMaskCard from '~/components/connectorCards/MetaMaskCard'
import CoinbaseWalletCard from '~/components/connectorCards/CoinbaseWalletCard'
import WalletConnectV2Card from '~/components/connectorCards/WalletConnectV2Card'
import GnosisSafeCard from '~/components/connectorCards/GnosisCard'
import styled from 'styled-components'
import { useActiveWeb3React } from '~/hooks'
import { MetaMask } from '@web3-react/metamask'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { Info } from 'react-feather'

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
                        <ErrorMessage
                            error={`Either Metamask is not installed, or you have multiple plugin wallets. Please refresh page and try again`}
                        />
                    ) : null}
                    {error && !(connector instanceof MetaMask) ? (
                        <ErrorMessage error={`Error: ${error?.message}`} />
                    ) : null}
                    {String(chainId) !== process.env.REACT_APP_NETWORK_ID && chainId !== undefined ? (
                        <ErrorMessage error={'Wrong Network'} />
                    ) : null}
                </ErrorContainer>
                <WalletConnectV2Card error={error} setError={setError} />
                <MetaMaskCard error={error} setError={setError} />
                <CoinbaseWalletCard error={error} setError={setError} />
                <GnosisSafeCard error={error} setError={setError} />
            </div>
        </>
    )
}

const ErrorMessage = ({ error }: { error: string }) => {
    const [isOverflowing, setIsOverflowing] = useState(false)
    const errorTextRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (errorTextRef.current) {
            setIsOverflowing(errorTextRef.current.scrollWidth > errorTextRef.current.clientWidth)
        }
    }, [error])

    return (
        <ErrorTextContainer>
            <ErrorText ref={errorTextRef}>{error}</ErrorText>
            {isOverflowing && (
                <>
                    <InfoIcon data-tooltip-id={`tooltip-${error}`} data-tooltip-content={error}>
                        <Info size={16} />
                    </InfoIcon>
                    <TooltipText>
                        <ReactTooltip id={`tooltip-${error}`} variant="light" data-effect="solid" place="top" />
                    </TooltipText>
                </>
            )}
        </ErrorTextContainer>
    )
}

const TooltipText = styled.div`
    font-family: 'Open Sans', sans-serif;
    font-weight: normal;
`

const ErrorContainer = styled.div`
    display: flex;
    text-align: start;
    flex-direction: column;
    justify-content: end;
    align-items: start;
    width: 100%;
    min-height: 21px;
`

const ErrorTextContainer = styled.div`
    display: flex;
    align-items: center;
    max-width: 100%;
    overflow: hidden;
`

const ErrorText = styled.div`
    font-family: 'Open Sans', sans-serif;
    font-weight: 400;
    font-size: ${(props) => props.theme.font.xxSmall};
    color: #ddf08b;
    justify-content: start;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`

const InfoIcon = styled.div`
    cursor: pointer;
    margin-left: 5px;
    display: flex;
    align-items: center;

    svg {
        color: #ddf08b;
    }
`
