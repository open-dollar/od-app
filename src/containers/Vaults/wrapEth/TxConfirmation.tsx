import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { useActiveWeb3React, handleTransactionError } from '~/hooks'
import TransactionOverview from '~/components/TransactionOverview'
import { returnConnectorName } from '~/utils'
import { useStoreActions, useStoreState } from '~/store'
import Button from '~/components/Button'
import Results from './Results'
import useGeb from '~/hooks/useGeb'

const TxConfirmation = () => {
    const { t } = useTranslation()
    const { connector, account, library } = useActiveWeb3React()
    const { safeModel: safeState } = useStoreState((state) => state)
    const {
        popupsModel: popupsActions,
        safeModel: safeActions,
        connectWalletModel: connectWalletActions,
    } = useStoreActions((state) => state)
    const geb = useGeb()

    const handleBack = () => safeActions.setOperation(0)

    const reset = async () => {
        safeActions.setAmount('')
        safeActions.setOperation(0)
        popupsActions.setSafeOperationPayload({
            isOpen: false,
            type: '',
            isCreate: false,
        })

        if (account && geb) {
            connectWalletActions.fetchTokenData({ geb, user: account })
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
                    text: 'Wrapping ETH',
                    hint: 'Confirm this transaction in your wallet',
                    status: 'loading',
                })
                const signer = library.getSigner(account)

                await safeActions.wrapEther({
                    signer,
                    title: 'Wrapping ETH',
                    amount: safeState.amount,
                })
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
                            (returnConnectorName(connector) ? 'on ' + returnConnectorName(connector) : '')
                        }
                    />
                    <Results amount={safeState.amount} />
                </Body>

                <Footer>
                    <Button dimmedWithArrow text={t('back')} onClick={handleBack} />
                    <Button withArrow text={t('confirm_transaction')} onClick={handleConfirm} />
                </Footer>
            </>
        </Container>
    )
}

export default TxConfirmation

const Container = styled.div``

const Body = styled.div`
    padding: 20px;
`

const Footer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px;
`
