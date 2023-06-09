import React, { useEffect } from 'react'
import { AlertTriangle, CheckCircle } from 'react-feather'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { ExternalLinkArrow } from '../../GlobalStyle'
import { useActiveWeb3React } from '../../hooks'
import { useStoreActions, useStoreState } from '../../store'
import { getEtherscanLink } from '../../utils/helper'
import Button from '../Button'
import Loader from '../Loader'
import Modal from './Modal'

const WaitingModal = () => {
    const { t } = useTranslation()

    const { popupsModel: popupsState, safeModel: safeState } = useStoreState(
        (state) => state
    )
    const { popupsModel: popupsActions } = useStoreActions((state) => state)
    const { chainId } = useActiveWeb3React()
    const { title, text, hint, status, hash, isCreate } =
        popupsState.waitingPayload

    const { list } = safeState

    useEffect(() => {
        if (isCreate) {
            popupsActions.setIsWaitingModalOpen(false)
        }
        // eslint-disable-next-line
    }, [list.length])

    const returnStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return <CheckCircle width={'60px'} className={status} />
            case 'error':
                return <AlertTriangle width={'60px'} className={status} />
            default:
                return <Loader width={'60px'} />
        }
    }
    return (
        <Modal
            width={'350px'}
            isModalOpen={popupsState.isWaitingModalOpen}
            handleModalContent
        >
            <InnerContainer data-test-id="waiting-modal">
                {returnStatusIcon(status)}
                {
                    <Title
                        data-test-id="waiting-modal-title"
                        className={status}
                    >
                        {title ? title : t('initializing')}
                    </Title>
                }

                {text || (status === 'success' && !isCreate) ? (
                    <Text className={status}>
                        {status === 'success' && chainId && hash ? (
                            <a
                                href={getEtherscanLink(
                                    chainId,
                                    hash,
                                    'transaction'
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {t('view_etherscan')}
                            </a>
                        ) : status === 'success' && isCreate ? (
                            <CreateNew>
                                <Loader width={'14px'} /> {text}
                            </CreateNew>
                        ) : (
                            text
                        )}
                    </Text>
                ) : null}
                {hint && <Hint>{hint}</Hint>}

                {status !== 'loading' && !isCreate ? (
                    <BtnContainer>
                        <Button
                            text={status === 'success' ? 'close' : 'dismiss'}
                            onClick={() =>
                                popupsActions.setIsWaitingModalOpen(false)
                            }
                        />
                    </BtnContainer>
                ) : null}
            </InnerContainer>
        </Modal>
    )
}

export default WaitingModal

const InnerContainer = styled.div`
    background: ${(props) => props.theme.colors.foreground};
    text-align: center;
    border-radius: 20px;
    padding: 20px 20px 35px 20px;
    svg {
        margin: 25px auto;
        stroke: #4ac6b2;
        path {
            stroke-width: 1 !important;
        }
        &.error {
            stroke: rgb(255, 104, 113);
            stroke-width: 2;
            width: 60px !important;
            height: 60px !important;
            margin-bottom: 20px;
        }
    }
`

const Title = styled.div`
    font-size: ${(props) => props.theme.font.medium};
    color: ${(props) => props.theme.colors.neutral};
    font-weight: 600;
    &.error {
        color: rgb(255, 104, 113);
        font-weight: normal;
    }
`

const Text = styled.div`
    font-size: ${(props) => props.theme.font.small};
    color: ${(props) => props.theme.colors.neutral};
    margin: 10px 0;
    a {
        ${ExternalLinkArrow}
    }
`

const Hint = styled.div`
    font-size: ${(props) => props.theme.font.extraSmall};
    color: ${(props) => props.theme.colors.secondary};
`

const BtnContainer = styled.div`
    padding: 20px;
    margin: 20px -20px -38px;
    background-color: ${(props) => props.theme.colors.border};
    border-radius: 0 0 20px 20px;
    text-align: center;
`

const CreateNew = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
        margin-right: 5px;
    }
`
