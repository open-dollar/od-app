import React from 'react'
import { useStoreActions, useStoreState } from '../../store'
import ConnectedWalletInfo from '../ConnectedWalletInfo'
import Modal from './Modal'

const ConnectedWalletModal = () => {
    const { popupsModel: popupsState } = useStoreState((state) => state)
    const { popupsModel: popupsActions } = useStoreActions((state) => state)
    return (
        <Modal
            title={'account_details'}
            maxWidth="400px"
            borderRadius={'20px'}
            isModalOpen={popupsState.isConnectedWalletModalOpen}
            closeModal={() =>
                popupsActions.setIsConnectedWalletModalOpen(false)
            }
            showXButton
            backDropClose
        >
            <ConnectedWalletInfo />
        </Modal>
    )
}

export default ConnectedWalletModal
