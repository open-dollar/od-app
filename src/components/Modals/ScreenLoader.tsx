import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useStoreState, useStoreActions } from '../../store'
import Loader from '../Loader'
import Modal from './Modal'

const ScreenLoader = () => {
    const { t } = useTranslation()
    const { popupsModel: popupsState } = useStoreState((state) => state)
    const { popupsModel: popupsActions } = useStoreActions((state) => state)
    return (
        <Modal
            maxWidth="350px"
            isModalOpen={popupsState.isScreenModalOpen}
            borderRadius={'20px'}
            closeModal={() => popupsActions.setIsScreenModalOpen(false)}
            showXButton
        >
            <LoaderContainer>
                <Loader text={t('Initializing...')} />
            </LoaderContainer>
        </Modal>
    )
}

export default ScreenLoader

const LoaderContainer = styled.div`
    padding: 1rem;
    border-radius: 12px;
    border: 1px solid ${(props) => props.theme.colors.border};
`
