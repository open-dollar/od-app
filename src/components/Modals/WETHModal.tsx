import { useStoreActions, useStoreState } from '~/store'
import AuctionsOperations from '~/containers/Safes/wrapEth'
import Modal from './Modal'

const WethModal = () => {
    const { popupsModel: popupsState } = useStoreState((state) => state)
    const { popupsModel: popupsActions, safeModel: safeActions } = useStoreActions((state) => state)

    const handleCancel = () => {
        popupsActions.setSafeOperationPayload({
            isOpen: false,
            type: '',
            isCreate: false,
        })
        safeActions.setOperation(0)
        popupsActions.setReturnProxyFunction(() => {})
    }

    return (
        <Modal
            isModalOpen={popupsState.safeOperationPayload.isOpen}
            handleModalContent
            backDropClose={!popupsState.blockBackdrop}
            closeModal={handleCancel}
        >
            <AuctionsOperations />
        </Modal>
    )
}

export default WethModal
