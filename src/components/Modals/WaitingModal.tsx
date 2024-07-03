import React from 'react'
import styled from 'styled-components'

import { useStoreState } from '../../store'

import Loader from '../Loader'
import Modal from './Modal'

const WaitingModal = () => {
    const { popupsModel: popupsState } = useStoreState((state) => state)

    return (
        <Modal isModalOpen={popupsState.isWaitingModalOpen} handleModalContent>
            <Container>
                <Loader width={'150px'} color="#1A74EC" />
            </Container>
        </Modal>
    )
}

export default WaitingModal

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
`
