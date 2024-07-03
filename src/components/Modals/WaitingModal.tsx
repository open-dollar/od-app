import React, { useEffect, useRef } from 'react'
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
    const modalRef = useRef<HTMLDivElement>(null)

    const { popupsModel: popupsState, safeModel: safeState } = useStoreState((state) => state)
    const { popupsModel: popupsActions } = useStoreActions((state) => state)
    const { chainId } = useActiveWeb3React()
    const { title, text, hint, status, hash, isCreate } = popupsState.waitingPayload

    const { list } = safeState

    useEffect(() => {
        if (isCreate) {
            popupsActions.setIsWaitingModalOpen(false)
        }
        // eslint-disable-next-line
    }, [list.length])

    useEffect(() => {
        const handleClickOutside = (event: { target: any }) => {
            if (modalRef?.current && !modalRef?.current?.contains(event.target)) {
                popupsActions.setIsWaitingModalOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [modalRef]) // eslint-disable-line react-hooks/exhaustive-deps

    const returnStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return (
                    <img
                        src={require('../../assets/tx-submitted-icon.svg').default}
                        width={106}
                        height={165}
                        alt="error"
                    />
                )
            case 'error':
                return (
                    <img
                        src={require('../../assets/tx-failed-icon.svg').default}
                        width={106}
                        height={165}
                        alt="error"
                    />
                )
            default:
                return (
                    <img
                        src={require('../../assets/tx-waiting-for-confirmation-icon.svg').default}
                        width={106}
                        height={165}
                        alt="error"
                    />
                )
        }
    }
    return (
        <Modal width={'445px'} isModalOpen={popupsState.isWaitingModalOpen} handleModalContent>
            <InnerContainer data-test-id="waiting-modal" ref={modalRef}>
                {returnStatusIcon(status)}
                <TextColumnContainer>
                    {
                        <Title data-test-id="waiting-modal-title" className={status}>
                            {title ? title : t('initializing')}
                        </Title>
                    }

                    {text || (status === 'success' && !isCreate) ? (
                        <Text className={status}>
                            {status === 'success' && chainId && hash ? (
                                <a
                                    href={getEtherscanLink(chainId, hash, 'transaction')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {t('view_arbiscan')}
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
                                onClick={() => popupsActions.setIsWaitingModalOpen(false)}
                            />
                        </BtnContainer>
                    ) : null}
                </TextColumnContainer>
            </InnerContainer>
        </Modal>
    )
}

export default WaitingModal

const TextColumnContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    gap: 10px;
`

const InnerContainer = styled.div`
    display: flex;
    justify-content: space-between;
    background: linear-gradient(to bottom, #1a74ec, #6396ff);
    text-align: center;
    border-radius: 4px;
    padding: 20px 50px 35px 50px;
    svg {
        margin: 25px auto;
        stroke: #4ac6b2;
        path {
            strokewidth: 1 !important;
        }
        &.error {
            stroke: rgb(255, 104, 113);
            strokewidth: 2;
            width: 60px !important;
            height: 60px !important;
            margin-bottom: 20px;
        }
    }
`

const Title = styled.div`
    color: ${(props) => props.theme.colors.neutral};
    font-weight: 700;
    font-size: 23px;
    font-family: 'Barlow', serif;
    &.error {
        color: white;
        font-weight: 700;
        font-size: 23px;
        font-family: 'Barlow', serif;
    }
`

const Text = styled.div`
    font-size: 18px;
    font-family: 'Open Sans', sans-serif;
    color: ${(props) => props.theme.colors.neutral};
    margin: 10px 0;
    a {
        color: white;
        ${ExternalLinkArrow}
    }
`

const Hint = styled.div`
    color: white;
    font-family: 'Open Sans', sans-serif;
    font-size: 18px;
    font-weight: 400;
    line-height: 27px;
`

const BtnContainer = styled.div`
    border-radius: 4px;
    text-align: center;
    border: #e2f1ff 2px solid;
    width: 100%;
`

const CreateNew = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
        margin-right: 5px;
    }
`
