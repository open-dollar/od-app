import { useEffect, useState } from 'react'
import { BigNumber, ethers } from 'ethers'
import styled from 'styled-components'
import {
    DEFAULT_SAFE_STATE,
    formatNumber,
    formatWithCommas,
    getTokenLogo,
    checkUserHasBalance,
    bridgeTokens,
} from '~/utils'
import useGeb, { useProxyAddress } from '~/hooks/useGeb'
import Review from './Review'
import { useStoreActions, useStoreState } from '~/store'
import TokenInput from '~/components/TokenInput'
import Button from '~/components/Button'
import Modal from '~/components/Modals/Modal'
import LinkButton from '~/components/LinkButton'
import BridgeModal from '~/components/Modals/BridgeModal'
import {
    handleTransactionError,
    useTokenBalanceInUSD,
    useActiveWeb3React,
    useInputsHandlers,
    useSafeInfo,
    useTokenApproval,
    ApprovalState,
} from '~/hooks'
import { useHistory } from 'react-router-dom'

const ModifyVault = ({ isDeposit, isOwner, vaultId }: { isDeposit: boolean; isOwner: boolean; vaultId: string }) => {
    const [needsBridge, setNeedsBridge] = useState(false)
    const { safeModel: safeState, connectWalletModel } = useStoreState((state) => state)
    const { provider, account, chainId } = useActiveWeb3React()
    const geb = useGeb()
    const [showPreview, setShowPreview] = useState(false)
    const { singleSafe } = safeState
    const history = useHistory()
    const type = isDeposit ? 'deposit_borrow' : 'repay_withdraw'
    const {
        safeModel: safeActions,
        connectWalletModel: connectWalletActions,
        popupsModel: popupsActions,
        bridgeModel: bridgeModelActions,
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

    const proxyAddress = useProxyAddress()

    const [collateralUnlockState, collateralApproveUnlock] = useTokenApproval(
        parsedAmounts.leftInput,
        singleSafe ? tokensData[singleSafe?.collateralName!].address : undefined,
        proxyAddress,
        selectedTokenDecimals,
        true
    )

    const [unlockState, approveUnlock] = useTokenApproval(
        parsedAmounts.rightInput,
        tokensData?.OD.address,
        proxyAddress,
        '18',
        true,
        parsedAmounts.rightInput === availableHai && availableHai !== '0'
    )
    useEffect(() => {
        if (!account || !provider || !singleSafe?.collateralName || !chainId || !bridgeTokens[chainId]) return
        const token = bridgeTokens[chainId].tokens.find((token: any) => token.name === singleSafe?.collateralName)
        const checkNeedsBridge = async () => {
            setNeedsBridge(await checkUserHasBalance(token.address, account, provider, parsedAmounts.leftInput))
        }
        checkNeedsBridge()
    }, [account, provider, chainId, singleSafe?.collateralName, parsedAmounts.leftInput])

    const onMaxLeftInput = () => {
        if (isDeposit) {
            const roundedDownBalance = ethers.utils.formatUnits(
                ethers.utils.parseUnits(depositTokenBalance, selectedTokenDecimals),
                selectedTokenDecimals
            )
            if (parseFloat(roundedDownBalance) > 1) {
                onLeftInput(Math.floor(parseFloat(roundedDownBalance)).toString())
            } else {
                onLeftInput(depositTokenBalance.toString())
            }
        } else {
            const roundedDownCollateral = ethers.utils.formatUnits(
                ethers.utils.parseUnits(availableCollateral.toString(), selectedTokenDecimals),
                selectedTokenDecimals
            )
            if (parseFloat(roundedDownCollateral) > 1) {
                onLeftInput(Math.floor(parseFloat(roundedDownCollateral)).toString())
            } else {
                onLeftInput(availableCollateral.toString())
            }
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
                        geb,
                        account,
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
                        geb,
                        account,
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

    const setBridge = (reason: string) => {
        if (!singleSafe) return
        bridgeModelActions.setReason(reason)
        bridgeModelActions.setFromTokenSymbol(singleSafe?.collateralName)
        history.push('/bridge')
    }

    return (
        <>
            {singleSafe && (
                <Container>
                    <BridgeModal />
                    <ButtonsRow>
                        <LinkButton
                            id="deposit_borrow"
                            text={'Deposit & Borrow'}
                            url={`/vaults/${vaultId}/deposit`}
                            disabled={!isOwner}
                            //@ts-ignore
                            color={isDeposit ? (props) => props.theme.colors.gradientBg : 'rgb(71, 86, 98, 0.4)'}
                            border={isDeposit.toString()}
                        />
                        <LinkButton
                            id="repay_withdraw"
                            text={'Repay & Withdraw'}
                            url={`/vaults/${vaultId}/withdraw`}
                            //@ts-ignore
                            color={!isDeposit ? (props) => props.theme.colors.gradientBg : 'rgb(71, 86, 98, 0.4)'}
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
                                                    &nbsp;{formatWithCommas(availableHai, 4)} {tokensData.OD.symbol}
                                                </Bold>
                                            </>
                                        ) : (
                                            <>
                                                Balance:{' '}
                                                <Bold>
                                                    &nbsp;{formatWithCommas(haiBalance, 4)} {tokensData.OD.symbol}
                                                </Bold>
                                            </>
                                        )
                                    }
                                    rightLabel={
                                        isDeposit
                                            ? `~$${formatWithCommas(haiBalanceUSD, 4)}`
                                            : `OD Owed: ${formatWithCommas(availableHai, 4)}`
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
                                {isDeposit ? (
                                    collateralUnlockState === ApprovalState.PENDING ||
                                    collateralUnlockState === ApprovalState.NOT_APPROVED ? (
                                        <Button
                                            onClick={collateralApproveUnlock}
                                            disabled={collateralUnlockState === ApprovalState.PENDING}
                                        >
                                            {collateralUnlockState === ApprovalState.PENDING
                                                ? 'Unlocking...'
                                                : `Unlock ${singleSafe?.collateralName}`}
                                        </Button>
                                    ) : (
                                        <Button onClick={handleSubmit} disabled={!isValid}>
                                            Review Transaction
                                        </Button>
                                    )
                                ) : unlockState === ApprovalState.PENDING ||
                                  unlockState === ApprovalState.NOT_APPROVED ? (
                                    <Button onClick={approveUnlock} disabled={unlockState === ApprovalState.PENDING}>
                                        {unlockState === ApprovalState.PENDING ? 'Approving...' : 'Approve OD'}
                                    </Button>
                                ) : (
                                    <Button onClick={handleSubmit} disabled={!isValid}>
                                        Review Transaction
                                    </Button>
                                )}
                            </ButtonContainer>

                            {error && (leftInput || rightInput) && (
                                <ErrorContainer>
                                    {needsBridge && parsedAmounts.leftInput && (
                                        <BridgeLabel>
                                            {`Insufficient funds. Move assets to Arbitrum using the `}
                                            <BridgeButton
                                                onClick={() => {
                                                    setBridge(
                                                        `Insufficient Collateral Balance: ${singleSafe.collateralName}`
                                                    )
                                                }}
                                            >
                                                Bridge
                                            </BridgeButton>
                                        </BridgeLabel>
                                    )}
                                    {!needsBridge && (leftInput || rightInput) && <p>Error: {error}</p>}
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
    border-radius: 4px;
    border-top-left-radius: 0;
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
    padding: 20px 0;
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
const BridgeLabel = styled.div`
    color: #e39806;
    font-size: 14px;
    margin-top: 10px;
`

const BridgeButton = styled.span`
    color: ${(props) => props.theme.colors.primary};
    cursor: pointer;
`
