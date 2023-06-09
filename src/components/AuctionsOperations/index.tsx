import React from 'react'
import { useTranslation } from 'react-i18next'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import styled from 'styled-components'
import { useStoreActions, useStoreState } from '../../store'
import { COIN_TICKER } from '../../utils/constants'
import _ from '../../utils/lodash'
import ApproveToken from '../ApproveToken'
import AuctionsPayment from './AuctionsPayment'
import AuctionsTransactions from './AuctionsTransactions'

const AuctionsOperations = () => {
    const { t } = useTranslation()
    const nodeRef = React.useRef(null)
    const { auctionsModel: auctionsActions } = useStoreActions((state) => state)
    const {
        auctionsModel: auctionsState,
        popupsModel: popupsState,
        connectWalletModel: connectWalletState,
    } = useStoreState((state) => state)

    const raiCoinAllowance = _.get(connectWalletState, 'coinAllowance', '0')
    const flxAllowance = _.get(connectWalletState, 'protAllowance', '0')

    const auctionType = _.get(
        auctionsState,
        'selectedAuction.englishAuctionType',
        'DEBT'
    )

    const amount = _.get(auctionsState, 'amount', '0')

    const returnBody = () => {
        switch (auctionsState.operation) {
            case 0:
                return <AuctionsPayment />
            case 2:
                return <AuctionsTransactions />
            default:
                break
        }
    }

    return (
        <SwitchTransition mode={'out-in'}>
            <CSSTransition
                nodeRef={nodeRef}
                key={auctionsState.operation}
                timeout={250}
                classNames="fade"
            >
                <Fade
                    ref={nodeRef}
                    style={{
                        width: '100%',
                        maxWidth: '720px',
                    }}
                >
                    {auctionsState.operation === 1 ? (
                        <ApproveToken
                            handleBackBtn={() =>
                                auctionsActions.setOperation(0)
                            }
                            handleSuccess={() =>
                                auctionsActions.setOperation(2)
                            }
                            amount={amount}
                            allowance={
                                auctionType === 'DEBT' ||
                                auctionType === 'STAKED_TOKEN'
                                    ? raiCoinAllowance
                                    : flxAllowance
                            }
                            coinName={
                                auctionType === 'DEBT' ||
                                auctionType === 'STAKED_TOKEN'
                                    ? (COIN_TICKER as string)
                                    : 'FLX'
                            }
                            methodName={
                                auctionType === 'DEBT' ||
                                auctionType === 'STAKED_TOKEN'
                                    ? 'coin'
                                    : 'protocolToken'
                            }
                        />
                    ) : (
                        <ModalContent
                            style={{
                                width: '100%',
                                maxWidth: '720px',
                            }}
                        >
                            <Header>
                                {t(popupsState.auctionOperationPayload.type, {
                                    rai: COIN_TICKER,
                                })}
                            </Header>
                            {returnBody()}
                        </ModalContent>
                    )}
                </Fade>
            </CSSTransition>
        </SwitchTransition>
    )
}

export default AuctionsOperations

const ModalContent = styled.div`
    background: ${(props) => props.theme.colors.background};
    border-radius: ${(props) => props.theme.global.borderRadius};
    border: 1px solid ${(props) => props.theme.colors.border};
`

const Header = styled.div`
    padding: 20px;
    font-size: ${(props) => props.theme.font.large};
    font-weight: 600;
    color: ${(props) => props.theme.colors.primary};
    border-bottom: 1px solid ${(props) => props.theme.colors.border};
    letter-spacing: -0.47px;
    span {
        text-transform: capitalize;
    }
`

const Fade = styled.div`
    &.fade-enter {
        opacity: 0;
        transform: translateX(50px);
    }
    &.fade-enter-active {
        opacity: 1;
        transform: translateX(0);
    }
    &.fade-exit {
        opacity: 1;
        transform: translateX(0);
    }
    &.fade-exit-active {
        opacity: 0;
        transform: translateX(-50px);
    }
    &.fade-enter-active,
    &.fade-exit-active {
        transition: opacity 300ms, transform 300ms;
    }
`
