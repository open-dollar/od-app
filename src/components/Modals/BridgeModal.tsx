import { useStoreActions, useStoreState } from '~/store'
import BridgeFundsForm from '~/containers/Bridge/BridgeFundsForm'
import Modal from './Modal'

const BridgeModal = () => {
    const { popupsModel: popupsState } = useStoreState((state) => state)
    const {
      popupsModel: popupsActions,
    } = useStoreActions((state) => state)

    const handleCancel = () => {
        popupsActions.setAuctionOperationPayload({
            isOpen: false,
            type: '',
            auctionType: '',
        })
        popupsActions.setReturnProxyFunction(() => {})
    }

    return (
        <Modal
            isModalOpen={popupsState.isBridgeModalOpen}
            handleModalContent
            backDropClose={!popupsState.blockBackdrop}
            closeModal={handleCancel}
        >
            <BridgeFundsForm />
        </Modal>
    )
}

export default BridgeModal
