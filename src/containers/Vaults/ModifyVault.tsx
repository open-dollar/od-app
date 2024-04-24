import { useEffect, useState } from 'react'
import { BigNumber, ethers } from 'ethers'
import styled from 'styled-components'
import { DEFAULT_SAFE_STATE, formatNumber, formatWithCommas, getTokenLogo } from '~/utils'
import useGeb from '~/hooks/useGeb'
import Review from './Review'
import { useStoreActions, useStoreState } from '~/store'
import TokenInput from '~/components/TokenInput'
import Button from '~/components/Button'
import Modal from '~/components/Modals/Modal'
import LinkButton from '~/components/LinkButton'
import {
    handleTransactionError,
    useTokenBalanceInUSD,
    useActiveWeb3React,
    useInputsHandlers,
    useSafeInfo,
} from '~/hooks'

const ModifyVault = ({ isDeposit, isOwner, vaultId }: { isDeposit: boolean; isOwner: boolean; vaultId: string }) => {
    const { safeModel: safeState, connectWalletModel } = useStoreState((state) => state)
    const { provider, account } = useActiveWeb3React()
    const geb = useGeb()
    const [showPreview, setShowPreview] = useState(false)
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
        ? ethers.utils.formatEther(tokenBalances[singleSafe?.collateralName]?.balanceE18 ?? 0)
        : '-'

    const leftInputBalance = isDeposit ? depositTokenBalance : availableCollateral

    const [collateralInUSD, setCollateralInUSD] = useState('0')

    const selectedTokenDecimals = singleSafe ? tokenBalances[singleSafe?.collateralName]?.decimals : '18'

    const { onLeftInput, onRightInput, onClearAll } = useInputsHandlers()

    useEffect(() => {
        return onClearAll
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const collateralName = singleSafe?.collateralName || ''

    const collateralUnitPriceUSD = formatNumber(
        safeState.liquidationData!.collateralLiquidationData[collateralName].currentPrice.value
    ).toString()

    useEffect(() => {
        const calculateCollateralInUSD = () => {
            const unitPriceUSD = parseFloat(collateralUnitPriceUSD)
            const collateralAmount = parseFloat(parsedAmounts.leftInput || '0')
            const totalInUSD = unitPriceUSD * collateralAmount
            setCollateralInUSD(formatWithCommas(totalInUSD.toFixed(2)))
        }

        calculateCollateralInUSD()
    }, [parsedAmounts.leftInput, collateralUnitPriceUSD])

    const { leftInput, rightInput } = parsedAmounts

    const isValid = !error

    const haiBalance = ethers.utils.formatEther(tokenBalances.OD?.balanceE18 || '0')

    const haiBalanceUSD = useTokenBalanceInUSD('OD', rightInput ? rightInput : availableHai)

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

            const haiBalanceBN = tokenBalances.OD.balanceE18 ? tokenBalances.OD.balanceE18 : BigNumber.from('0')

            const isMoreDebt = availableHaiBN.gt(haiBalanceBN)

            onRightInput(isMoreDebt ? ethers.utils.formatEther(haiBalanceBN) : availableHai)
        }
    }
    const handleWaitingTitle = () => {
        return 'Modifying Vault'
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
        if (account && provider) {
            safeActions.setIsSuccessfulTx(false)
            setShowPreview(false)
            popupsActions.setIsWaitingModalOpen(true)
            popupsActions.setWaitingPayload({
                title: 'Waiting For Confirmation',
                text: handleWaitingTitle(),
                hint: 'Confirm this transaction in your wallet',
                status: 'loading',
            })

            const signer = provider.getSigner(account)
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
                            isGnosisSafe: false,
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
                    <ButtonsRow>
                        <LinkButton
                            id="deposit_borrow"
                            text={'Deposit & Borrow'}
                            url={`/vaults/${vaultId}/deposit`}
                            //@ts-ignore
                            color={isDeposit ? (props) => props.theme.colors.gradientBg : 'blueish'}
                            border={isDeposit.toString()}
                        />
                        <LinkButton
                            id="repay_withdraw"
                            text={'Repay & Withdraw'}
                            url={`/vaults/${vaultId}/withdraw`}
                            //@ts-ignore
                            color={!isDeposit ? (props) => props.theme.colors.gradientBg : 'blueish'}
                            border={(!isDeposit).toString()}
                        />
                    </ButtonsRow>
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
                    <ContainerUnderBottonsRow>
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
                                        icon: getTokenLogo(singleSafe.collateralName),
                                    }}
                                    label={
                                        isDeposit ? (
                                            <>
                                                Balance:{' '}
                                                <Bold>
                                                    &nbsp;{formatWithCommas(leftInputBalance)}{' '}
                                                    {singleSafe.collateralName}
                                                </Bold>
                                            </>
                                        ) : (
                                            <>
                                                Available:{' '}
                                                <Bold>
                                                    &nbsp;{formatWithCommas(leftInputBalance)}{' '}
                                                    {singleSafe.collateralName}
                                                </Bold>
                                            </>
                                        )
                                    }
                                    rightLabel={`~$${collateralInUSD}`}
                                    onChange={onLeftInput}
                                    value={leftInput}
                                    handleMaxClick={onMaxLeftInput}
                                    disabled={!isDeposit && !isOwner}
                                    decimals={Number(selectedTokenDecimals)}
                                />
                            </InputBlock>
                            <InputBlock>
                                <SideLabel>{isDeposit ? `Borrow OD` : 'Repay OD'}</SideLabel>
                                <TokenInput
                                    data_test_id={`${isDeposit ? 'deposit_borrow' : 'repay_withdraw'}_right`}
                                    token={
                                        tokensData.OD && {
                                            icon: getTokenLogo(tokensData.OD.symbol),
                                            name: tokensData.OD.symbol,
                                        }
                                    }
                                    label={
                                        isDeposit ? (
                                            <>
                                                Borrow OD:{' '}
                                                <Bold>
                                                    &nbsp;{formatWithCommas(availableHai, 2)} {tokensData.OD.symbol}
                                                </Bold>
                                            </>
                                        ) : (
                                            <>
                                                Balance:{' '}
                                                <Bold>
                                                    &nbsp;{formatWithCommas(haiBalance, 2)} {tokensData.OD.symbol}
                                                </Bold>
                                            </>
                                        )
                                    }
                                    rightLabel={
                                        isDeposit
                                            ? `~$${formatWithCommas(haiBalanceUSD, 2)}`
                                            : `OD Owed: ${formatWithCommas(availableHai, 2)}`
                                    }
                                    onChange={onRightInput}
                                    value={rightInput}
                                    handleMaxClick={onMaxRightInput}
                                    disabled={isDeposit && !isOwner}
                                    decimals={5}
                                />
                            </InputBlock>
                        </Inner>
                        <Row>
                            <ButtonContainer>
                                <Button onClick={handleSubmit} disabled={!isValid} maxSize={'250px'}>
                                    {'Review Transaction'}
                                </Button>
                            </ButtonContainer>
                            {error && (
                                <ErrorContainer>
                                    <p>Error: {error}</p>
                                </ErrorContainer>
                            )}
                        </Row>
                    </ContainerUnderBottonsRow>
                </Container>
            )}
        </>
    )
}

export default ModifyVault

const Row = styled.div`
    display: flex;
    align-items: center;
    column-gap: 20px;
    justify-content: space-between;
    @media (max-width: 767px) {
        align-items: start;
        flex-direction: column;
    }
`
const ErrorContainer = styled.div`
    background: rgba(26, 116, 236, 0.2);
    color: #1a74ec;
    border-left: 3px solid #1a74ec;
    padding: 10px;
    border-radius: 4px;
    margin-top: 20px;
    font-family: 'Open Sans', sans-serif;
    font-weight: 600;
    font-size: 16px;
`

const ContainerUnderBottonsRow = styled.div`
    background: white;
    padding: 20px;
`

const Bold = styled.span`
    font-weight: bold;
`

const ReviewContainer = styled.div`
    padding: 20px;
    border-radius: 4px;
    background: ${(props) => props.theme.colors.gradientBg};
`

const BtnContainer = styled.div`
    margin-top: 24px;
    text-align: center;
    border: 2px solid #e2f1ff;
    border-radius: 4px;
    font-family: 'Barlow', sans-serif;
    font-size: 18px;
    font-weight: 600;
    line-height: 22px;
`

const ButtonsRow = styled.div`
    display: flex;
    align-items: center;
    a {
        min-width: 100px;
        padding: 4px 12px;
        &:first-child {
            margin-right: 10px;
        }
    }
    @media (max-width: 767px) {
        min-width: 100%;
        margin-top: 20px;
        justify-content: space-between;
        &:first-child {
            margin-right: 0;
        }
        a {
            min-width: 49%;
            display: flex;
            justify-content: center;
        }
    }
`

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
    border-radius: 4px;
    padding: 20px;
    margin-top: 20px;
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

const SideLabel = styled.div`
    font-weight: 700;
    color: #1c293a;
    font-family: 'Barlow', sans-serif;
    font-size: 18px;
    line-height: 26.4px;
    margin-bottom: 10px;
`
