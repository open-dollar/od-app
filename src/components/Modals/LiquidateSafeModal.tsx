import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { handleTransactionError } from '~/hooks'
import useGeb from '~/hooks/useGeb'
import { liquidateSafe } from '~/services/blockchain'
import { useStoreActions, useStoreState } from '~/store'
import AlertLabel from '../AlertLabel'
import Button from '../Button'
import CheckBox from '../CheckBox'
import Modal from './Modal'

const LiquidateSafeModal = () => {
    const { liquidateSafePayload, isLiquidateSafeModalOpen } = useStoreState((state) => state.popupsModel)
    const { popupsModel, transactionsModel } = useStoreActions((state) => state)
    const { t } = useTranslation()
    const [accepted, setAccepted] = useState(false)
    const geb = useGeb()
    const history = useHistory()

    const closeModal = () => {
        setAccepted(false)
        popupsModel.closeLiquidateSafeModal()
    }

    const startSafeLiquidation = async () => {
        if (liquidateSafePayload && geb) {
            popupsModel.setIsWaitingModalOpen(true)
            popupsModel.setWaitingPayload({
                text: `Starting liquidation for safe #${liquidateSafePayload.safeId}...`,
                title: 'Waiting For Confirmation',
                hint: 'Confirm this transaction in your wallet',
                status: 'loading',
            })
            liquidateSafe(geb, liquidateSafePayload.safeId)
                .then((txResponse) => {
                    if (txResponse) {
                        const { hash, chainId } = txResponse
                        transactionsModel.addTransaction({
                            chainId,
                            hash,
                            from: txResponse.from,
                            summary: `Liquidate Safe #${liquidateSafePayload.safeId}`,
                            addedTime: new Date().getTime(),
                            originalTx: txResponse,
                        })
                        popupsModel.setWaitingPayload({
                            title: 'Transaction Submitted',
                            text: `Starting liquidation for safe #${liquidateSafePayload.safeId}...`,
                            hash: txResponse.hash,
                            status: 'loading',
                        })
                        txResponse.wait().then(() => {
                            popupsModel.setIsWaitingModalOpen(false)
                            history.push('/safes')
                            closeModal()
                        })
                    }
                })
                .catch((error) => {
                    handleTransactionError(error)
                })
        }
    }

    return (
        <Modal
            title="Liquidate Safe"
            maxWidth="400px"
            borderRadius="20px"
            isModalOpen={isLiquidateSafeModalOpen}
            closeModal={closeModal}
            showXButton
            backDropClose
        >
            <div>
                <AlertContainer>
                    <AlertLabel isBlock={false} text={t('liquidate_safe_warning')} type="danger" />
                </AlertContainer>
                <CheckboxContainer>
                    <CheckBox checked={accepted} onChange={setAccepted} />
                    <span onClick={() => setAccepted(!accepted)}>{t('liquidate_confirmation')}</span>
                </CheckboxContainer>
                <ButtonContainer>
                    <Button disabled={!accepted} onClick={startSafeLiquidation}>
                        {t('liquidate_button')}
                        {liquidateSafePayload?.safeId}
                    </Button>
                </ButtonContainer>
            </div>
        </Modal>
    )
}

export default LiquidateSafeModal

const AlertContainer = styled.div`
    margin-bottom: 20px;
    div {
        font-size: 13px;
        ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-left:0;
 
  `}
    }
    ${({ theme }) => theme.mediaWidth.upToSmall`
      margin-top:10px;
      margin-bottom:10px;
  `}
`

const CheckboxContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    span {
        margin-left: 10px;
        position: relative;
        font-size: 13px;
        top: -3px;
    }
`

const ButtonContainer = styled.div`
    button {
        width: 100%;
    }
`
