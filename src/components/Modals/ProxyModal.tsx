import React, { useEffect, useState } from 'react'
import { AlertTriangle, ArrowUpCircle, CheckCircle } from 'react-feather'
import { useTranslation } from 'react-i18next'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import {
    handlePreTxGasEstimate,
    handleTransactionError,
    useTransactionAdder,
} from '../../hooks/TransactionHooks'
import { use10BlocksConfirmations } from '../../hooks/useBlocksConfirmations'
import useGeb from '../../hooks/useGeb'
import { useStoreState, useStoreActions } from '../../store'
import { timeout } from '../../utils/helper'
import Button from '../Button'
import Loader from '../Loader'
import Modal from './Modal'

const ProxyModal = () => {
    const [status, setStatus] = useState('stateless')
    const { t } = useTranslation()
    const { account, library, chainId } = useActiveWeb3React()
    const geb = useGeb()
    const addTransaction = useTransactionAdder()
    const blocksSinceCheck = use10BlocksConfirmations()

    const { popupsModel: popupsState, connectWalletModel: connectWalletState } =
        useStoreState((state) => state)
    const storeActions = useStoreActions((state) => state)
    const {
        popupsModel: popupsActions,
        connectWalletModel: connectWalletActions,
    } = storeActions

    const { ctHash } = connectWalletState

    useEffect(() => {
        async function blocksChecker() {
            if (ctHash && blocksSinceCheck === 10) {
                await timeout(2000)
                popupsActions.setIsProxyModalOpen(false)
                popupsState.returnProxyFunction(storeActions)
                localStorage.removeItem('ctHash')
                connectWalletActions.setCtHash('')
                connectWalletActions.setStep(2)
            }
        }
        blocksChecker()
    }, [
        account,
        blocksSinceCheck,
        popupsActions,
        ctHash,
        popupsState,
        connectWalletActions,
        storeActions,
    ])

    const handleCreateAccount = async () => {
        const { blockNumber } = connectWalletState

        if (!account || !library || !chainId) return false
        const txData = geb.deployProxy()
        const signer = library.getSigner(account)

        try {
            setStatus('loading')
            popupsActions.setBlockBackdrop(true)
            const tx = await handlePreTxGasEstimate(signer, txData)
            const txResponse = await signer.sendTransaction(tx)
            connectWalletActions.setCtHash(txResponse.hash)
            addTransaction(
                { ...txResponse, blockNumber: blockNumber[chainId] },
                'Creating an account'
            )
            setStatus('success')
            await txResponse.wait()
            popupsActions.setBlockBackdrop(false)
        } catch (e) {
            popupsActions.setBlockBackdrop(false)
            handleTransactionError(e)
        }
    }

    const returnStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return <CheckCircle width={'40px'} className={status} />
            case 'error':
                return <AlertTriangle width={'40px'} className={status} />
            case 'loading':
                return <Loader width={'40px'} />
            default:
                return <ArrowUpCircle width={'40px'} className={'stateless'} />
        }
    }

    return (
        <Modal
            maxWidth={'400px'}
            isModalOpen={popupsState.isProxyModalOpen}
            handleModalContent
            backDropClose={!popupsState.blockBackdrop}
            closeModal={() => popupsActions.setIsProxyModalOpen(false)}
        >
            <Container>
                <InnerContainer>
                    <ImgContainer>{returnStatusIcon(status)}</ImgContainer>
                    <Title className={status}>{t('create_account')}</Title>
                    <Text>
                        {ctHash ? (
                            <>
                                <Confirmations>
                                    {`WATITING FOR CONFIRMATIONS... ${
                                        !blocksSinceCheck
                                            ? 0
                                            : blocksSinceCheck > 10
                                            ? 10
                                            : blocksSinceCheck
                                    } of 10`}{' '}
                                    <InfoBtn data-tip={t('confirmations_info')}>
                                        ?
                                    </InfoBtn>
                                </Confirmations>
                                <ReactTooltip
                                    multiline
                                    type="light"
                                    data-effect="solid"
                                />
                            </>
                        ) : (
                            t('proxy_wallet_text')
                        )}
                    </Text>

                    {ctHash ? null : (
                        <BtnContainer>
                            <Button
                                text={'create_account'}
                                onClick={handleCreateAccount}
                            />
                        </BtnContainer>
                    )}
                </InnerContainer>
            </Container>
        </Modal>
    )
}

export default ProxyModal

const Container = styled.div`
    max-width: 400px;
    background: ${(props) => props.theme.colors.foreground};
    border-radius: 25px;
    margin: 0 auto;
`

const InnerContainer = styled.div`
    background: ${(props) => props.theme.colors.background};
    text-align: center;
    border-radius: 20px;
    padding: 20px 20px 35px 20px;
`
const ImgContainer = styled.div`
    svg {
        margin: 25px auto;
        height: 40px;
        stroke: #4ac6b2;
        path {
            stroke-width: 1 !important;
        }
        &.stateless {
            stroke: orange;
        }
        &.success {
            stroke: #4ac6b2;
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
    color: ${(props) => props.theme.colors.primary};
    font-weight: 600;
    &.error {
        color: rgb(255, 104, 113);
        font-weight: normal;
    }
`

const Text = styled.div`
    font-size: ${(props) => props.theme.font.small};
    color: ${(props) => props.theme.colors.primary};
    margin: 10px 0;
`

const BtnContainer = styled.div`
    padding: 20px;
    margin: 20px -20px -35px;
    background-color: ${(props) => props.theme.colors.background};
    border-radius: 0 0 20px 20px;
    text-align: center;
    svg {
        stroke: white;
        margin: 0;
    }
`

const Confirmations = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-top: 10px;
    font-size: ${(props) => props.theme.font.extraSmall};
    font-weight: 600;
    color: ${(props) => props.theme.colors.secondary};
`

const InfoBtn = styled.div`
    cursor: pointer;
    background: ${(props) => props.theme.colors.secondary};
    color: ${(props) => props.theme.colors.neutral};
    width: 15px;
    height: 15px;
    border-radius: 50%;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 7px;
`
