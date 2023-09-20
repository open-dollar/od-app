import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { useActiveWeb3React, handleTransactionError } from '~/hooks'
import TransactionOverview from '~/components/TransactionOverview'
import { returnConnectorName, COIN_TICKER } from '~/utils'
import { useStoreActions, useStoreState } from '~/store'
import { AuctionEventType } from '~/types'
import Button from '~/components/Button'
import Results from './Results'
import _ from '~/utils/lodash'
import useGeb from '~/hooks/useGeb'

const AuctionsTransactions = () => {
    const { t } = useTranslation()
    const { connector, account, provider } = useActiveWeb3React()
    const geb = useGeb()

    const { auctionModel: auctionsActions, popupsModel: popupsActions } = useStoreActions((state) => state)

    const {
        auctionModel: auctionsState,
        popupsModel: popupsState,
        connectWalletModel: { proxyAddress },
    } = useStoreState((state) => state)

    const {
        amount,
        selectedAuction: surplusOrDebtAuction,
        protInternalBalance,
        internalBalance,
        selectedCollateralAuction,
        collateralAmount,
    } = auctionsState

    const selectedAuction = surplusOrDebtAuction ? surplusOrDebtAuction : selectedCollateralAuction

    const auctionId = _.get(selectedAuction, 'auctionId', '')
    const auctionType = _.get(selectedAuction, 'englishAuctionType', 'DEBT')
    const tokenSymbol = _.get(selectedAuction, 'tokenSymbol', 'WETH')
    const isClaim = popupsState.auctionOperationPayload.type.includes('claim')
    const isSettle = popupsState.auctionOperationPayload.type.includes('settle')
    const isBuy = popupsState.auctionOperationPayload.type.includes('buy')
    const sectionType = popupsState.auctionOperationPayload.auctionType
    const handleBack = () => auctionsActions.setOperation(0)

    const reset = async () => {
        // after execute any action we refetch auctions and auctionsData again to update the bidding list
        if (geb && proxyAddress) {
            auctionsActions.fetchAuctionsData({ geb, proxyAddress })
            auctionsActions.fetchAuctions({ geb, type: sectionType as AuctionEventType, tokenSymbol })
        }

        auctionsActions.setAmount('')
        auctionsActions.setOperation(0)
        auctionsActions.setSelectedAuction(null)
        auctionsActions.setIsSubmitting(false)

        // after execute a transaction, fetch auctions again to update the bidding list
        auctionsActions.fetchAuctions({ geb, type: sectionType as AuctionEventType })
    }

    const handleWaitingTitle = (function () {
        switch (auctionType) {
            case 'DEBT':
                return isSettle ? 'Claiming ODG' : isClaim ? 'Claiming Tokens' : `Bid ${COIN_TICKER} and Receive ODG`

            case 'SURPLUS':
                return isSettle ? 'Claiming OD' : isClaim ? 'Claiming Tokens' : `Bid ODG and Receive ${COIN_TICKER}`

            case 'COLLATERAL':
                return 'Buying Collateral'

            default:
                return ''
        }
    })()

    const handleConfirm = async () => {
        try {
            if (account && provider) {
                popupsActions.setAuctionOperationPayload({
                    isOpen: false,
                    type: '',
                    auctionType: '',
                })
                popupsActions.setIsWaitingModalOpen(true)
                popupsActions.setWaitingPayload({
                    title: 'Waiting For Confirmation',
                    text: handleWaitingTitle,
                    hint: 'Confirm this transaction in your wallet',
                    status: 'loading',
                })
                const signer = provider.getSigner(account)

                if (isBuy) {
                    await auctionsActions.auctionBuy({
                        signer,
                        auctionId,
                        title: handleWaitingTitle,
                        haiAmount: amount,
                        collateral: tokenSymbol,
                        collateralAmount: collateralAmount,
                    })
                } else if (isSettle) {
                    await auctionsActions.auctionClaim({
                        signer,
                        auctionId,
                        title: handleWaitingTitle,
                        auctionType,
                    })
                } else if (isClaim) {
                    await auctionsActions.auctionClaimInternalBalance({
                        signer,
                        auctionId,
                        title: handleWaitingTitle,
                        auctionType,
                        bid: Number(internalBalance) > 0 ? internalBalance : protInternalBalance,
                        token: Number(internalBalance) > 0 ? 'COIN' : 'PROTOCOL_TOKEN',
                    })
                } else {
                    await auctionsActions.auctionBid({
                        signer,
                        auctionId,
                        title: handleWaitingTitle,
                        auctionType,
                        bid: amount,
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
                            // @ts-ignore
                            (returnConnectorName(connector) ? 'on ' + returnConnectorName(connector) : '')
                        }
                    />
                    <Results />
                </Body>

                <Footer>
                    <Button dimmedWithArrow text={t('back')} onClick={handleBack} />
                    <Button withArrow text={t('confirm_transaction')} onClick={handleConfirm} />
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
