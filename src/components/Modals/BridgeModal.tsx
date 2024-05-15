import { useStoreActions, useStoreState } from '~/store'
import BridgeFundsForm from '~/containers/Bridge/BridgeFundsForm'
import Modal from './Modal'
import styled from 'styled-components'

const BridgeModal = () => {
    const { popupsModel: popupsState } = useStoreState((state) => state)
    const { popupsModel: popupsActions } = useStoreActions((state) => state)

    const handleCancel = () => {
        popupsActions.setIsBridgeModalOpen(false)
    }

    return (
        <WhiteModal
            isModalOpen={popupsState.isBridgeModalOpen}
            handleModalContent
            backDropClose={!popupsState.blockBackdrop}
            closeModal={handleCancel}
        >
            <BridgeFundsForm />
        </WhiteModal>
    )
}

export default BridgeModal

const WhiteModal = styled(Modal)`
    background-color: ${({ theme }) => theme.colors.white};
    border: 2px solid red;
    width: 1050px;
`
