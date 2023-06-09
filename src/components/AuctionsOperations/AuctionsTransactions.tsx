import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { handleTransactionError } from '../../hooks/TransactionHooks'
import { useStoreActions, useStoreState } from '../../store'
import { returnConnectorName } from '../../utils/helper'
import Button from '../Button'
import TransactionOverview from '../TransactionOverview'
import Results from './Results'
import _ from '../../utils/lodash'
import { COIN_TICKER } from '../../utils/constants'

type AuctionTypes = 'DEBT' | 'SURPLUS' | 'STAKED_TOKEN'
const AuctionsTransactions = () => {
    const { t } = useTranslation()
    const { connector, account, library } = useActiveWeb3React()

    const {
        auctionsModel: auctionsActions,
        popupsModel: popupsActions,
    } = useStoreActions((state) => state)

    const {
        auctionsModel: auctionsState,
        popupsModel: popupsState,
    } = useStoreState((state) => state)
    const { amount, selectedAuction } = auctionsState

    const auctionId = _.get(selectedAuction, 'auctionId', '')
    const auctionType = _.get(selectedAuction, 'englishAuctionType', 'DEBT')
    const isClaim = popupsState.auctionOperationPayload.type.includes('claim')
    const isSettle = popupsState.auctionOperationPayload.type.includes('settle')
    const sectionType = popupsState.auctionOperationPayload.auctionType
    const handleBack = () => auctionsActions.setOperation(0)

    const reset = () => {
        auctionsActions.setAmount('')
        auctionsActions.setOperation(0)
        auctionsActions.setSelectedAuction(null)
    }

    const handleWaitingTitle = () => {
        switch (auctionType) {
            case 'DEBT':
                return isSettle
                    ? 'Claiming FLX'
                    : isClaim
                    ? 'Claiming Tokens'
                    : `Bid ${COIN_TICKER} and Receive FLX`

            case 'SURPLUS':
                return isSettle
                    ? 'Claiming RAI'
                    : isClaim
                    ? 'Claiming Tokens'
                    : `Bid FLX and Receive ${COIN_TICKER}`
            case 'STAKED_TOKEN':
                return isSettle
                    ? 'Claiming FLX/ETH LP'
                    : isClaim
                    ? 'Claiming Tokens'
                    : `Bid RAI and Receive FLX/ETH LP`
            default:
                return ''
        }
    }

    const handleConfirm = async () => {
        try {
            if (account && library) {
                popupsActions.setAuctionOperationPayload({
                    isOpen: false,
                    type: '',
                    auctionType: '',
                })
                popupsActions.setIsWaitingModalOpen(true)
                popupsActions.setWaitingPayload({
                    title: 'Waiting For Confirmation',
                    text: handleWaitingTitle(),
                    hint: 'Confirm this transaction in your wallet',
                    status: 'loading',
                })
                const signer = library.getSigner(account)
                if (isSettle) {
                    await auctionsActions.auctionClaim({
                        signer,
                        auctionId,
                        title: handleWaitingTitle(),
                        auctionType,
                    })
                } else if (isClaim) {
                    await auctionsActions.auctionClaimInternalBalance({
                        signer,
                        auctionId,
                        title: handleWaitingTitle(),
                        auctionType,
                        amount,
                        type: sectionType as AuctionTypes,
                    })
                } else {
                    await auctionsActions.auctionBid({
                        signer,
                        auctionId,
                        title: handleWaitingTitle(),
                        auctionType,
                        amount,
                    })
                }
            }
            reset()
        } catch (e) {
            reset()
            handleTransactionError(e)
        } finally {
        }
    }

    return (
        <Container>
            <>
                <Body>
                    <TransactionOverview
                        title={t('confirm_transaction_details')}
                        description={
                            t('confirm_details_text') +
                            (returnConnectorName(connector)
                                ? 'on ' + returnConnectorName(connector)
                                : '')
                        }
                    />
                    <Results />
                </Body>

                <Footer>
                    <Button
                        dimmedWithArrow
                        text={t('back')}
                        onClick={handleBack}
                    />
                    <Button
                        withArrow
                        text={t('confirm_transaction')}
                        onClick={handleConfirm}
                    />
                </Footer>
            </>
        </Container>
    )
}

export default AuctionsTransactions

const Container = styled.div``

const Body = styled.div`
    padding: 20px;
`

const Footer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px;
`
