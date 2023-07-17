import { useEffect, useState } from 'react'
import { BigNumber, ethers } from 'ethers'
import styled from 'styled-components'

import { formatNumber, TOKEN_LOGOS, DEFAULT_SAFE_STATE } from '~/utils'
import { useStoreActions, useStoreState } from '~/store'
import TokenInput from '~/components/TokenInput'
import Modal from '~/components/Modals/Modal'
import { gnosisSafe } from '~/connectors'
import Button from '~/components/Button'
import useGeb from '~/hooks/useGeb'
import Review from './Review'
import {
    handleTransactionError,
    useTokenBalanceInUSD,
    useActiveWeb3React,
    useInputsHandlers,
    useTokenApproval,
    useProxyAddress,
    ApprovalState,
    useSafeInfo,
} from '~/hooks'

const ModifySafe = ({ isDeposit, isOwner }: { isDeposit: boolean; isOwner: boolean }) => {
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
        availableCollateral,
        availableHai,
        parsedAmounts,
        totalCollateral,
        totalDebt,
        collateralRatio,
        liquidationPrice,
    } = useSafeInfo(type)

    const tokenBalances = connectWalletModel.tokensFetchedData
    const tokensData = connectWalletModel.tokensData
    const depositTokenBalance = singleSafe
        ? ethers.utils.formatEther(tokenBalances[singleSafe.collateralName].balanceE18)
        : '-'

    const leftInputBalance = isDeposit ? depositTokenBalance : availableCollateral
    const collateralUnitPriceUSD = formatNumber(
        safeState.liquidationData!.collateralLiquidationData[singleSafe!.collateralName].currentPrice.value
    )
    const selectedTokenBalanceInUSD = formatNumber(
        (Number(collateralUnitPriceUSD) * Number(leftInputBalance)).toString(),
        2
    )
    const selectedTokenDecimals = singleSafe ? tokenBalances[singleSafe.collateralName].decimals : '18'

    const [unlockState, approveUnlock] = useTokenApproval(
        parsedAmounts.rightInput,
        tokensData?.HAI.address,
        proxyAddress,
        '18',
        true
    )

    const [collateralUnlockState, collateralApproveUnlock] = useTokenApproval(
        parsedAmounts.leftInput,
        singleSafe ? tokensData[singleSafe?.collateralName!].address : undefined,
        proxyAddress,
        selectedTokenDecimals,
        true
    )

    const { onLeftInput, onRightInput, onClearAll } = useInputsHandlers()

    useEffect(() => {
        return onClearAll
    }, [])

    const { leftInput, rightInput } = parsedAmounts

    const isValid = !error

    const haiBalance = ethers.utils.formatEther(tokenBalances.HAI?.balanceE18 || '0')

    const haiBalanceUSD = useTokenBalanceInUSD('HAI', rightInput ? rightInput : availableHai)

    const onMaxLeftInput = () => {
        if (isDeposit) {
            onLeftInput(depositTokenBalance.toString())
        } else {
            onLeftInput(availableCollateral as string)
        }
    }

    const onMaxRightInput = () => {
        if (isDeposit) {
            onRightInput(availableHai)
        } else {
            const availableHaiBN = ethers.utils.parseEther(availableHai)

            const haiBalanceBN = tokenBalances.HAI.balanceE18 ? tokenBalances.HAI.balanceE18 : BigNumber.from('0')

            const isMoreDebt = availableHaiBN.gt(haiBalanceBN)

            onRightInput(isMoreDebt ? ethers.utils.formatEther(haiBalanceBN) : availableHai)
        }
    }

    const handleWaitingTitle = () => {
        return 'Modifying Safe'
    }

    const handleSubmit = () => {
        safeActions.setSafeData({
            leftInput: parsedAmounts.leftInput ? parsedAmounts.leftInput : '0',
            rightInput: parsedAmounts.rightInput ? parsedAmounts.rightInput : '0',
            totalCollateral,
            totalDebt,
            collateralRatio: collateralRatio as number,
            liquidationPrice: liquidationPrice as number,
            collateral: singleSafe?.collateralName!,
        })

        setShowPreview(true)
    }

    const reset = () => {
        onClearAll()
        safeActions.setSafeData(DEFAULT_SAFE_STATE)
        connectWalletActions.setIsStepLoading(true)
        safeActions.setIsSafeCreated(true)
        safeActions.fetchUserSafes({
            address: account as string,
            geb,
            tokensData: tokensData,
        })
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
            {singleSafe && (
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
                                {isDeposit
                                    ? `Deposit ${singleSafe?.collateralName}`
                                    : `Withdraw ${singleSafe?.collateralName}`}
                            </SideLabel>

                            <TokenInput
                                data_test_id={`${isDeposit ? 'deposit_borrow' : 'repay_withdraw'}_left`}
                                token={{
                                    name: singleSafe.collateralName,
                                    icon: TOKEN_LOGOS[singleSafe.collateralName],
                                }}
                                label={
                                    isDeposit
                                        ? `Balance: ${leftInputBalance} ${singleSafe.collateralName}`
                                        : `Available: ${leftInputBalance} ${singleSafe.collateralName}`
                                }
                                rightLabel={`~$${selectedTokenBalanceInUSD}`}
                                onChange={onLeftInput}
                                value={leftInput}
                                handleMaxClick={onMaxLeftInput}
                                disabled={!isDeposit && !isOwner}
                                decimals={Number(selectedTokenDecimals)}
                            />
                        </InputBlock>
                        <InputBlock>
                            <SideLabel>{isDeposit ? `Borrow HAI` : 'Repay HAI'}</SideLabel>
                            <TokenInput
                                data_test_id={`${isDeposit ? 'deposit_borrow' : 'repay_withdraw'}_right`}
                                token={
                                    tokensData.HAI && {
                                        icon: TOKEN_LOGOS[tokensData.HAI.symbol],
                                        name: tokensData.HAI.symbol,
                                    }
                                }
                                label={
                                    isDeposit
                                        ? `Borrow HAI: ${formatNumber(availableHai, 2)} ${tokensData.HAI.symbol}`
                                        : `Balance: ${formatNumber(haiBalance, 2)} ${tokensData.HAI.symbol}`
                                }
                                rightLabel={
                                    isDeposit
                                        ? `~$${haiBalanceUSD}`
                                        : `HAI Owed: ${formatNumber(availableHai, 4, true)}`
                                }
                                onChange={onRightInput}
                                value={rightInput}
                                handleMaxClick={onMaxRightInput}
                                disabled={isDeposit && !isOwner}
                            />
                        </InputBlock>
                    </Inner>
                    <ButtonContainer>
                        {!isValid ? (
                            <Button onClick={handleSubmit} disabled={!isValid}>
                                {error}
                            </Button>
                        ) : !isDeposit ? (
                            unlockState === ApprovalState.PENDING || unlockState === ApprovalState.NOT_APPROVED ? (
                                <Button
                                    disabled={!isValid || unlockState === ApprovalState.PENDING}
                                    text={unlockState === ApprovalState.PENDING ? 'Pending Approval..' : 'Unlock HAI'}
                                    onClick={approveUnlock}
                                />
                            ) : (
                                <Button onClick={handleSubmit} disabled={!isValid}>
                                    {'Review Transaction'}
                                </Button>
                            )
                        ) : collateralUnlockState === ApprovalState.PENDING ||
                          collateralUnlockState === ApprovalState.NOT_APPROVED ? (
                            <Button
                                disabled={!isValid || collateralUnlockState === ApprovalState.PENDING}
                                text={
                                    collateralUnlockState === ApprovalState.PENDING
                                        ? 'Pending Approval..'
                                        : `Unlock ${singleSafe?.collateralName}`
                                }
                                onClick={collateralApproveUnlock}
                            />
                        ) : (
                            <Button onClick={handleSubmit} disabled={!isValid}>
                                {'Review Transaction'}
                            </Button>
                        )}
                    </ButtonContainer>
                </Container>
            )}
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
