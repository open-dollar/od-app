import { BigNumber, ethers } from 'ethers'
import { useCallback, useMemo, useState } from 'react'
import { gnosisSafe } from 'src/connectors'
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
import { useInputsHandlers, useSafeInfo } from '../../hooks/useSafe'
import { ApprovalState, useTokenApproval } from '../../hooks/useTokenApproval'
import { useStoreActions, useStoreState } from '../../store'
import { DEFAULT_SAFE_STATE } from '../../utils/constants'
import { formatNumber } from '../../utils/helper'
import { TOKENS } from '../../utils/tokens'
import Review from './Review'

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
    const { safeModel: safeState, connectWalletModel } = useStoreState((state) => state)
    const { singleSafe } = safeState
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
        availableHai,
        parsedAmounts,
        totalCollateral,
        totalDebt,
        collateralRatio,
        liquidationPrice,
    } = useSafeInfo(type)

    const tokenBalances = connectWalletModel.tokensData
    const depositTokenBalance = singleSafe ? ethers.utils.formatEther(tokenBalances[singleSafe.collateralName].balance) : '-'

    const [unlockState, approveUnlock] = useTokenApproval(
        parsedAmounts.rightInput,
        TOKENS.HAI.address,
        proxyAddress
    )

    const [collateralUnlockState, collateralApproveUnlock] = useTokenApproval(
        parsedAmounts.leftInput,
        singleSafe ? TOKENS[singleSafe?.collateralName!].address : undefined,
        proxyAddress
    )

    const { leftInput, rightInput } = parsedAmounts

    const { onLeftInput, onRightInput } = useInputsHandlers()
    const isValid = !error

    const haiBalance = ethers.utils.formatEther(tokenBalances.HAI.balance)
    const parsedWethBalance = ethers.utils.formatEther(tokenBalances.WETH.balance)
    const wethBalanceUSD = useTokenBalanceInUSD(
        'WETH',
        isDeposit ? parsedWethBalance : (availableEth as string)
    )
    const haiBalanceUSD = useTokenBalanceInUSD(
        'HAI',
        rightInput ? rightInput : availableHai
    )

    const formattedBalanceInUSD = useMemo(() => {
        return {
            weth: wethBalanceUSD,
            hai: haiBalanceUSD,
        }
    }, [wethBalanceUSD, haiBalanceUSD])

    const onMaxLeftInput = () => {
        if (isDeposit) {
            onLeftInput(depositTokenBalance.toString())
        } else {
            onLeftInput(availableEth as string)
        }
    }

    const onMaxRightInput = () => {
        if (isDeposit) {
            onRightInput(availableHai.toString())
        } else {
            const availableHaiBN = ethers.utils.parseEther(availableHai)

            const haiBalanceBN = balances.hai
                ? ethers.utils.parseEther(balances.hai.toString())
                : BigNumber.from('0')

            const isMore = haiBalanceBN.gt(availableHaiBN)

            onRightInput(
                isMore
                    ? availableHai.toString()
                    : tokenBalances.HAI.balance
                        ? tokenBalances.HAI.balance
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
            collateral: singleSafe?.collateralName!
        })

        setShowPreview(true)
    }

    const reset = () => {
        onClearAll()
        safeActions.setSafeData(DEFAULT_SAFE_STATE)
        connectWalletActions.setIsStepLoading(true)
        safeActions.setIsSafeCreated(true)
        safeActions.fetchUserSafes({ address: account as string, geb })
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
        <>
            {singleSafe &&
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
                                {isDeposit ? `Deposit ${singleSafe?.collateralName}` : `Withdraw ${singleSafe?.collateralName}`}
                            </SideLabel>

                            <TokenInput
                                data_test_id={`${isDeposit ? 'deposit_borrow' : 'repay_withdraw'
                                    }_left`}
                                token={{ name: singleSafe.collateralName, icon: TOKENS[singleSafe.collateralName].icon }}
                                label={
                                    isDeposit
                                        ? `Balance: ${depositTokenBalance} ${singleSafe.collateralName}`
                                        : `Available: ${availableEth} ${singleSafe.collateralName}`
                                }
                                rightLabel={`~$${formattedBalanceInUSD.weth}`}
                                onChange={onLeftInput}
                                value={leftInput}
                                handleMaxClick={onMaxLeftInput}
                                disabled={!isDeposit && !isOwner}
                            />
                        </InputBlock>
                        <InputBlock>
                            <SideLabel>
                                {isDeposit ? `Borrow HAI` : 'Repay HAI'}
                            </SideLabel>
                            <TokenInput
                                data_test_id={`${isDeposit ? 'deposit_borrow' : 'repay_withdraw'
                                    }_right`}
                                token={TOKENS.HAI}
                                label={
                                    isDeposit
                                        ? `Borrow HAI: ${formatNumber(
                                            availableHai,
                                            2
                                        )} ${TOKENS.HAI.name}`
                                        : `Balance: ${formatNumber(haiBalance, 2)} ${TOKENS.HAI.name}`
                                }
                                rightLabel={
                                    isDeposit
                                        ? `~$${formattedBalanceInUSD.hai}`
                                        : `HAI Owed: ${formatNumber(
                                            availableHai,
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
                            !isDeposit ?
                            (unlockState === ApprovalState.PENDING ||
                                unlockState === ApprovalState.NOT_APPROVED) ? (
                                <Button
                                    disabled={
                                        !isValid || unlockState === ApprovalState.PENDING
                                    }
                                    text={
                                        unlockState === ApprovalState.PENDING
                                            ? 'Pending Approval..'
                                            : 'Unlock HAI'
                                    }
                                    onClick={approveUnlock}
                                />
                            ) : <Button onClick={handleSubmit} disabled={!isValid}>
                                {error ?? 'Review Transaction'}
                            </Button> :
                            (
                                (collateralUnlockState === ApprovalState.PENDING ||
                                    collateralUnlockState === ApprovalState.NOT_APPROVED) ?
                                    <Button
                                        disabled={
                                            !isValid || collateralUnlockState === ApprovalState.PENDING
                                        }
                                        text={
                                            collateralUnlockState === ApprovalState.PENDING
                                                ? 'Pending Approval..'
                                                : `Unlock ${singleSafe?.collateralName}`
                                        }
                                        onClick={collateralApproveUnlock}
                                    /> :
                                    <Button onClick={handleSubmit} disabled={!isValid}>
                                        {error ?? 'Review Transaction'}
                                    </Button>
                            )}
                    </ButtonContainer>
                </Container>}
        </>
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
