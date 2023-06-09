import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useStoreActions, useStoreState } from '../../store'
import SafeManager from '../SafeManager'
import Modal from './Modal'

const SafeManagerModal = () => {
    const { t } = useTranslation()
    const { popupsModel: popupsState } = useStoreState((state) => state)
    const { popupsModel: popupsActions } = useStoreActions((state) => state)
    return (
        <Modal
            title={'settings'}
            isModalOpen={popupsState.isSafeManagerOpen}
            closeModal={() => popupsActions.setIsSafeManagerOpen(false)}
            backDropClose
            handleModalContent
        >
            <ModalContent
                style={{
                    width: '100%',
                    maxWidth: '720px',
                }}
            >
                <Header>{t('manage_other_safes')}</Header>
                <SafeManager />
            </ModalContent>
        </Modal>
    )
}

export default SafeManagerModal

const ModalContent = styled.div`
    background: ${(props) => props.theme.colors.background};
    border-radius: ${(props) => props.theme.global.borderRadius};
    border: 1px solid ${(props) => props.theme.colors.border};
`

const Header = styled.div`
    padding: 20px;
    font-size: ${(props) => props.theme.font.large};
    font-weight: 600;
    color: ${(props) => props.theme.colors.neutral};
    border-bottom: 1px solid ${(props) => props.theme.colors.border};
    letter-spacing: -0.47px;
    span {
        text-transform: capitalize;
    }
`
