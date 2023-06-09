import { BigNumber, ethers } from 'ethers'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import Button from '../../components/Button'
import Modal from '../../components/Modals/Modal'
import TokenInput from '../../components/TokenInput'
import { useActiveWeb3React } from '../../hooks'
import { handleTransactionError } from '../../hooks/TransactionHooks'
import useGeb, {
    useProxyAddress,
    useTokenBalanceInUSD,
} from '../../hooks/useGeb'
import { useSafeInfo, useInputsHandlers } from '../../hooks/useSafe'
import { ApprovalState, useTokenApproval } from '../../hooks/useTokenApproval'
import { useStoreActions, useStoreState } from '../../store'
import { DEFAULT_SAFE_STATE } from '../../utils/constants'
import { TOKENS } from '../../utils/tokens'
import { formatNumber } from '../../utils/helper'
import Review from './Review'
import { gnosisSafe } from 'src/connectors'

const ModifySafe = ({
    isDeposit,
    isOwner,
}: {
    isDeposit: boolean
    isOwner: boolean
}) => {
    const { library, account, connector } = useActiveWeb3React()
    const geb = useGeb()
    const proxyAddress = useProxyAddress()
    const [showPreview, setShowPreview] = useState(false)
    const { safeModel: safeState } = useStoreState((state) => state)
    const type = isDeposit ? 'deposit_borrow' : 'repay_withdraw'
    const {
        safeModel: safeActions,
        connectWalletModel: connectWalletActions,
        popupsModel: popupsActions,
    } = useStoreActions((state) => state)

    const {
        error,
        balances,
        availableEth,
        availableRai,
        parsedAmounts,
        totalCollateral,
        totalDebt,
        collateralRatio,
        liquidationPrice,
    } = useSafeInfo(type)

    const [unlockState, approveUnlock] = useTokenApproval(
        parsedAmounts.rightInput,
        geb?.contracts.coin.address,
        proxyAddress
    )

    const { leftInput, rightInput } = parsedAmounts

    const { onLeftInput, onRightInput } = useInputsHandlers()
    const isValid = !error

    const ethBalanceUSD = useTokenBalanceInUSD(
        'ETH',
        isDeposit ? balances.eth : (availableEth as string)
    )
    const raiBalanceUSD = useTokenBalanceInUSD(
        'RAI',
        rightInput ? rightInput : availableRai
    )

    const formattedBalance = useMemo(() => {
        return {
            eth: formatNumber(balances.eth, 2),
            rai: formatNumber(balances.rai, 2),
        }
    }, [balances])

    const formattedBalanceInUSD = useMemo(() => {
        return {
            eth: ethBalanceUSD,
            rai: raiBalanceUSD,
        }
    }, [ethBalanceUSD, raiBalanceUSD])

    const onMaxLeftInput = () => {
        if (isDeposit) {
            onLeftInput(balances.eth.toString())
        } else {
            onLeftInput(availableEth as string)
        }
    }

    const onMaxRightInput = () => {
        if (isDeposit) {
            onRightInput(availableRai.toString())
        } else {
            const availableRaiBN = ethers.utils.parseEther(availableRai)

            const raiBalanceBN = balances.rai
                ? ethers.utils.parseEther(balances.rai.toString())
                : BigNumber.from('0')

            const isMore = raiBalanceBN.gt(availableRaiBN)

            onRightInput(
                isMore
                    ? availableRai.toString()
                    : balances.rai
                    ? balances.rai.toString()
                    : '0'
            )
        }
    }

    const onClearAll = useCallback(() => {
        onLeftInput('')
        onRightInput('')
    }, [onLeftInput, onRightInput])

    const handleWaitingTitle = () => {
        return 'Modifying Safe'
    }

    const handleSubmit = () => {
        safeActions.setSafeData({
            leftInput: parsedAmounts.leftInput ? parsedAmounts.leftInput : '0',
            rightInput: parsedAmounts.rightInput
                ? parsedAmounts.rightInput
                : '0',
            totalCollateral,
            totalDebt,
            collateralRatio: collateralRatio as number,
            liquidationPrice: liquidationPrice as number,
        })

        setShowPreview(true)
    }

    const reset = () => {
        onClearAll()
        safeActions.setSafeData(DEFAULT_SAFE_STATE)
        connectWalletActions.setIsStepLoading(true)
        safeActions.setIsSafeCreated(true)
    }

    const handleConfirm = async () => {
        if (account && library) {
            safeActions.setIsSuccessfulTx(false)
            setShowPreview(false)
            popupsActions.setIsWaitingModalOpen(true)
            popupsActions.setWaitingPayload({
                title: 'Waiting For Confirmation',
                text: handleWaitingTitle(),
                hint: 'Confirm this transaction in your wallet',
                status: 'loading',
            })

            const signer = library.getSigner(account)
            try {
                connectWalletActions.setIsStepLoading(true)
                if (safeState.singleSafe && isDeposit) {
                    await safeActions.depositAndBorrow({
                        safeData: safeState.safeData,
                        signer,
                        safeId: safeState.singleSafe.id,
                    })
                }

                if (safeState.singleSafe && !isDeposit) {
                    await safeActions.repayAndWithdraw({
                        safeData: {
                            ...safeState.safeData,
                            isGnosisSafe: connector === gnosisSafe,
                        },
                        signer,
                        safeId: safeState.singleSafe.id,
                    })
                }

                safeActions.setIsSuccessfulTx(true)
                popupsActions.setIsWaitingModalOpen(false)
                reset()
            } catch (e) {
                safeActions.setIsSuccessfulTx(false)
                handleTransactionError(e)
            } finally {
                reset()
            }
        }
    }
    return (
        <Container>
            <Modal
                isModalOpen={showPreview}
                closeModal={() => setShowPreview(false)}
                maxWidth={'450px'}
                backDropClose
                hideHeader
                hideFooter
                handleModalContent
            >
                <ReviewContainer>
                    <Review type={type} />
                    <BtnContainer>
                        <Button id="confirm_tx" onClick={handleConfirm}>
                            {'Confirm Transaction'}
                        </Button>{' '}
                    </BtnContainer>
                </ReviewContainer>
            </Modal>
            <Inner>
                <InputBlock>
                    <SideLabel>
                        {isDeposit ? `Deposit ETH` : 'Withdraw ETH'}
                    </SideLabel>

                    <TokenInput
                        data_test_id={`${
                            isDeposit ? 'deposit_borrow' : 'repay_withdraw'
                        }_left`}
                        token={TOKENS.eth}
                        label={
                            isDeposit
                                ? `Balance: ${formattedBalance.eth} ${TOKENS.eth.name}`
                                : `Available: ${availableEth} ${TOKENS.eth.name}`
                        }
                        rightLabel={`~$${formattedBalanceInUSD.eth}`}
                        onChange={onLeftInput}
                        value={leftInput}
                        handleMaxClick={onMaxLeftInput}
                        disabled={!isDeposit && !isOwner}
                    />
                </InputBlock>
                <InputBlock>
                    <SideLabel>
                        {isDeposit ? `Borrow RAI` : 'Repay RAI'}
                    </SideLabel>
                    <TokenInput
                        data_test_id={`${
                            isDeposit ? 'deposit_borrow' : 'repay_withdraw'
                        }_right`}
                        token={TOKENS.rai}
                        label={
                            isDeposit
                                ? `Borrow RAI: ${formatNumber(
                                      availableRai,
                                      2
                                  )} ${TOKENS.rai.name}`
                                : `Balance: ${formatNumber(balances.rai, 2)} ${
                                      TOKENS.rai.name
                                  }`
                        }
                        rightLabel={
                            isDeposit
                                ? `~$${formattedBalanceInUSD.rai}`
                                : `RAI Owed: ${formatNumber(
                                      availableRai,
                                      4,
                                      true
                                  )}`
                        }
                        onChange={onRightInput}
                        value={rightInput}
                        handleMaxClick={onMaxRightInput}
                        disabled={isDeposit && !isOwner}
                    />
                </InputBlock>
            </Inner>
            <ButtonContainer>
                {isValid &&
                !isDeposit &&
                (unlockState === ApprovalState.PENDING ||
                    unlockState === ApprovalState.NOT_APPROVED) ? (
                    <Button
                        disabled={
                            !isValid || unlockState === ApprovalState.PENDING
                        }
                        text={
                            unlockState === ApprovalState.PENDING
                                ? 'Pending Approval..'
                                : 'Unlock RAI'
                        }
                        onClick={approveUnlock}
                    />
                ) : (
                    <Button onClick={handleSubmit} disabled={!isValid}>
                        {error ?? 'Review Transaction'}
                    </Button>
                )}
            </ButtonContainer>
        </Container>
    )
}

export default ModifySafe

const ButtonContainer = styled.div`
    text-align: right;
    margin-top: 20px;
    @media (max-width: 767px) {
        button {
            width: 100%;
        }
    }
`
const Container = styled.div`
    border-radius: 15px;
    padding: 20px;
    margin-top: 20px;
    background: ${(props) => props.theme.colors.colorSecondary};
`

const Inner = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    @media (max-width: 767px) {
        flex-direction: column;
    }
`
const InputBlock = styled.div`
    flex: 0 0 48%;
    @media (max-width: 767px) {
        flex: 0 0 100%;
        margin-top: 20px;
        min-width: 100%;
    }
`

const ReviewContainer = styled.div`
    padding: 20px;
    border-radius: 10px;
    background: ${(props) => props.theme.colors.colorSecondary};
`

const BtnContainer = styled.div`
    padding-top: 20px;
    text-align: center;
`

const SideLabel = styled.div`
    font-weight: 600;
    font-size: ${(props) => props.theme.font.default};
    margin-bottom: 10px;
`
