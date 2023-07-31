import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import ApproveToken from '~/components/ApproveToken'
import { useStoreActions, useStoreState } from '~/store'
import AuctionsTransactions from './AuctionsTransactions'
import AuctionsPayment from './AuctionsPayment'
import { COIN_TICKER } from '~/utils'
import _ from '~/utils/lodash'

const AuctionsOperations = () => {
    const { t } = useTranslation()
    const nodeRef = React.useRef(null)
    const { auctionModel: auctionsActions } = useStoreActions((state) => state)
    const {
        auctionModel: auctionsState,
        popupsModel: popupsState,
        connectWalletModel: connectWalletState,
    } = useStoreState((state) => state)

    const { selectedAuction: surplusOrDebtAuction, selectedCollateralAuction } = auctionsState
    const selectedAuction = surplusOrDebtAuction ? surplusOrDebtAuction : selectedCollateralAuction

    const raiCoinAllowance = _.get(connectWalletState, 'coinAllowance', '0')
    const flxAllowance = _.get(connectWalletState, 'protAllowance', '0')
    const auctionType = _.get(selectedAuction, 'englishAuctionType', 'DEBT')
    const bids = _.get(selectedAuction, 'englishAuctionBids', '[]')
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
            <CSSTransition nodeRef={nodeRef} key={auctionsState.operation} timeout={250} classNames="fade">
                <Fade
                    ref={nodeRef}
                    style={{
                        width: '100%',
                        maxWidth: '720px',
                    }}
                >
                    {auctionsState.operation === 1 ? (
                        <ApproveToken
                            handleBackBtn={() => auctionsActions.setOperation(0)}
                            handleSuccess={() => auctionsActions.setOperation(2)}
                            amount={amount}
                            bids={bids}
                            allowance={
                                auctionType === 'DEBT' || auctionType === 'COLLATERAL' ? raiCoinAllowance : flxAllowance
                            }
                            coinName={
                                auctionType === 'DEBT' || auctionType === 'COLLATERAL'
                                    ? (COIN_TICKER as string)
                                    : 'KITE'
                            }
                            methodName={
                                auctionType === 'DEBT' || auctionType === 'COLLATERAL' ? 'coin' : 'protocolToken'
                            }
                            auctionType={auctionType}
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
                                    hai: COIN_TICKER,
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
