import React from 'react'
import { useStoreActions, useStoreState } from '../../store'
import AuctionsOperations from '../AuctionsOperations'
import Modal from './Modal'

const AuctionsModal = () => {
    const { popupsModel: popupsState } = useStoreState((state) => state)
    const {
        popupsModel: popupsActions,
        auctionsModel: auctionsActions,
    } = useStoreActions((state) => state)

    const handleCancel = () => {
        popupsActions.setAuctionOperationPayload({
            isOpen: false,
            type: '',
            auctionType: '',
        })
        auctionsActions.setOperation(0)
        popupsActions.setReturnProxyFunction(() => {})
        auctionsActions.setAmount('')
        auctionsActions.setSelectedAuction(null)
    }

    return (
        <Modal
            isModalOpen={popupsState.auctionOperationPayload.isOpen}
            handleModalContent
            backDropClose={!popupsState.blockBackdrop}
            closeModal={handleCancel}
        >
            <AuctionsOperations />
        </Modal>
    )
}

export default AuctionsModal
