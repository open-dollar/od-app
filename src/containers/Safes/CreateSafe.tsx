import { useCallback, useEffect, useMemo, useState } from 'react'
import { TokenData } from '@hai-on-op/sdk/lib/contracts/addreses'
import { ArrowLeft, Info, Loader } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'
import { ethers } from 'ethers'

import { DEFAULT_SAFE_STATE, TOKEN_LOGOS, formatNumber } from '~/utils'
import { useStoreActions, useStoreState } from '~/store'
import TokenInput from '~/components/TokenInput'
import Modal from '~/components/Modals/Modal'
import Dropdown from '~/components/Dropdown'
import Button from '~/components/Button'
import Review from './Review'
import {
    handleTransactionError,
    useTokenBalanceInUSD,
    useActiveWeb3React,
    useInputsHandlers,
    useTokenApproval,
    ApprovalState,
    useSafeInfo,
    StatsType,
} from '~/hooks'

const CreateSafe = ({
    selectedItem,
    setSelectedItem,
    collaterals,
}: {
    selectedItem: string
    setSelectedItem: (item: string) => void
    collaterals: TokenData[]
}) => {
    const { stats, error, availableHai, parsedAmounts, totalCollateral, totalDebt, collateralRatio, liquidationPrice } =
        useSafeInfo('create')
    const { library, account } = useActiveWeb3React()
    const [showPreview, setShowPreview] = useState(false)
    const {
        safeModel: safeState,
        connectWalletModel: { proxyAddress, tokensData, tokensFetchedData },
    } = useStoreState((state) => state)
    const history = useHistory()
    const {
        safeModel: safeActions,
        connectWalletModel: connectWalletActions,
        popupsModel: popupsActions,
    } = useStoreActions((state) => state)
    const { leftInput, rightInput } = parsedAmounts
    const { onLeftInput, onRightInput, onClearAll: clearAll } = useInputsHandlers()
    const { t } = useTranslation()
    const isValid = !error

    const collateralsDropdown = collaterals.map((collateral) => {
        return { name: collateral.symbol, icon: TOKEN_LOGOS[collateral.symbol] }
    })

    const dropdownSelected = collateralsDropdown.find((item) => item.name === selectedItem)!

    const selectedCollateral = tokensData && tokensData[selectedItem]
    const selectedCollateralBalance = ethers.utils.formatEther(tokensFetchedData[selectedItem].balanceE18)
    const selectedCollateralDecimals = tokensFetchedData[selectedItem].decimals
    const haiBalanceUSD = useTokenBalanceInUSD('HAI', rightInput ? rightInput : availableHai)

    const selectedTokenBalance = useMemo(() => {
        if (selectedCollateralBalance) {
            return formatNumber(selectedCollateralBalance, 2)
        }
        return formatNumber('0', 2)
    }, [selectedCollateralBalance])

    const collateralUnitPriceUSD = formatNumber(
        safeState.liquidationData?.collateralLiquidationData[selectedCollateral.symbol]?.currentPrice?.value || '0'
    )

    const selectedTokenBalanceInUSD = formatNumber(
        (Number(collateralUnitPriceUSD) * Number(selectedCollateralBalance)).toString()
    )

    const debtFloor = Math.ceil(
        Number(
            formatNumber(
                safeState.liquidationData?.collateralLiquidationData[selectedCollateral.symbol]?.debtFloor || '0'
            )
        )
    )

    const onMaxLeftInput = () => onLeftInput(selectedTokenBalance.toString())
    const onMaxRightInput = () => onRightInput(availableHai.toString())

    const onClearAll = useCallback(() => {
        clearAll()
    }, [clearAll])

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
            collateral: selectedItem,
        })

        setShowPreview(true)
    }

    const reset = () => {
        onClearAll()
        safeActions.setSafeData({
            ...DEFAULT_SAFE_STATE,
            collateral: selectedItem,
        })
        connectWalletActions.setIsStepLoading(true)
        safeActions.setIsSafeCreated(true)
    }

    const wrapEth = () => {
        popupsActions.setSafeOperationPayload({
            isOpen: true,
            type: '',
            isCreate: false,
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
            safeActions.setSafeData({
                ...safeState.safeData,
                leftInput: parsedAmounts.leftInput || '0',
                rightInput: parsedAmounts.rightInput || '0',
                totalCollateral,
                totalDebt,
            })
            const signer = library.getSigner(account)
            try {
                connectWalletActions.setIsStepLoading(true)
                await safeActions.depositAndBorrow({
                    safeData: safeState.safeData,
                    signer,
                })
                history.push('/safes')
                safeActions.setIsSuccessfulTx(true)
                popupsActions.setIsWaitingModalOpen(false)
            } catch (e) {
                safeActions.setIsSuccessfulTx(false)
                handleTransactionError(e)
            } finally {
                reset()
            }
        }
    }

    let [approvalState, approve] = useTokenApproval(
        leftInput,
        selectedCollateral?.address,
        proxyAddress,
        selectedCollateralDecimals,
        true
    )

    return (
        <>
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
                    <Review type={'create'} />
                    <BtnContainer>
                        <Button id="create_confirm" onClick={handleConfirm}>
                            {'Confirm Transaction'}
                        </Button>{' '}
                    </BtnContainer>
                </ReviewContainer>
            </Modal>
            <InnerContent>
                <Content>
                    <Header>
                        <Btn>
                            <ArrowLeft onClick={() => history.goBack()} />
                        </Btn>
                        <span className="title"> {t('create_safe')}</span>
                        <Btn className="clear" onClick={reset}>
                            Clear All
                        </Btn>
                    </Header>
                    <Box>
                        {selectedCollateral ? (
                            <Col>
                                <DropDownContainer>
                                    <SideLabel>{`Select Collateral Type`}</SideLabel>
                                    <Dropdown
                                        items={collateralsDropdown}
                                        itemSelected={dropdownSelected}
                                        getSelectedItem={setSelectedItem}
                                    />
                                    {dropdownSelected.name === 'WETH' && (
                                        <WrapBox>
                                            Don't have WETH?{' '}
                                            <WrapBtn onClick={wrapEth} color="secondary">
                                                Wrap ETH
                                            </WrapBtn>
                                        </WrapBox>
                                    )}
                                </DropDownContainer>

                                <Inputs>
                                    <SideLabel>{`Deposit ${selectedItem} and Borrow HAI`}</SideLabel>

                                    <TokenInput
                                        token={
                                            selectedCollateral?.symbol
                                                ? {
                                                      name: selectedCollateral?.symbol || '-',
                                                      icon: TOKEN_LOGOS[selectedCollateral?.symbol],
                                                  }
                                                : undefined
                                        }
                                        label={`Balance: ${selectedTokenBalance} ${selectedCollateral?.symbol}`}
                                        rightLabel={`~$${selectedTokenBalanceInUSD}`}
                                        onChange={onLeftInput}
                                        value={leftInput}
                                        handleMaxClick={onMaxLeftInput}
                                        data_test_id="deposit_borrow"
                                        decimals={Number(selectedCollateralDecimals)}
                                    />

                                    <br />
                                    <TokenInput
                                        token={
                                            tokensData.HAI && {
                                                icon: TOKEN_LOGOS[tokensData.HAI.symbol],
                                                name: tokensData.HAI.symbol,
                                            }
                                        }
                                        label={`Borrow HAI: ${formatNumber(availableHai, 2)} ${tokensData.HAI?.symbol}`}
                                        rightLabel={`~$${haiBalanceUSD}`}
                                        onChange={onRightInput}
                                        value={rightInput}
                                        handleMaxClick={onMaxRightInput}
                                        data_test_id="repay_withdraw"
                                    />
                                </Inputs>
                            </Col>
                        ) : (
                            <Col>
                                <Loader width={'100%'} />
                            </Col>
                        )}

                        <Col>
                            <Stats>
                                {Object.keys(stats).map((key) => {
                                    const isPrimary = key === 'data'
                                    return (
                                        <div key={key} className="blockie">
                                            {stats[key as StatsType].map((item) => {
                                                return (
                                                    <Flex key={item.label}>
                                                        <Label color={isPrimary ? 'primary' : 'secondary'}>
                                                            {item.tip ? (
                                                                <InfoIcon data-tip={item.tip}>
                                                                    <Info size="13" />
                                                                </InfoIcon>
                                                            ) : null}
                                                            {item.label}
                                                        </Label>
                                                        <Value>{item.value}</Value>
                                                    </Flex>
                                                )
                                            })}
                                        </div>
                                    )
                                })}
                            </Stats>
                        </Col>
                    </Box>

                    <Flex className="hasBtn">
                        <Note data-test-id="debt_floor_note">
                            <span>Note:</span>
                            {` The minimum amount to mint per safe is ${debtFloor} HAI`}
                        </Note>
                        {approvalState === ApprovalState.APPROVED ? (
                            <Button onClick={handleSubmit} disabled={!isValid}>
                                {error ?? 'Review Transaction'}
                            </Button>
                        ) : approvalState === ApprovalState.PENDING ? (
                            <Button disabled={true}>Pending Approval..</Button>
                        ) : (
                            <Button onClick={approve} disabled={!isValid}>
                                {error ?? `Approve ${selectedItem}`}
                            </Button>
                        )}
                    </Flex>
                    <ReactTooltip multiline type="light" data-effect="solid" />
                </Content>
            </InnerContent>
        </>
    )
}

const CreateSafeContainer = () => {
    const {
        safeModel: {
            liquidationData,
            safeData: { collateral },
        },
        connectWalletModel: { tokensData, tokensFetchedData },
    } = useStoreState((state) => state)
    const collaterals = tokensData ? Object.values(tokensData).filter((token) => token.isCollateral) : []
    const [selectedItem, setSelectedItem] = useState<string>('')

    const { safeModel: safeActions } = useStoreActions((state) => state)

    useEffect(() => {
        safeActions.setSafeData({ ...DEFAULT_SAFE_STATE, collateral: selectedItem })
        return () => safeActions.setSafeData(DEFAULT_SAFE_STATE)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedItem])

    useEffect(() => {
        if (collaterals.length > 0 && selectedItem === '') setSelectedItem(collaterals[0].symbol)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collaterals])

    return (
        <Container>
            {liquidationData && tokensData && collateral && collateral !== '' && tokensFetchedData[selectedItem] && (
                <CreateSafe selectedItem={selectedItem} setSelectedItem={setSelectedItem} collaterals={collaterals} />
            )}
        </Container>
    )
}

export default CreateSafeContainer

const ReviewContainer = styled.div`
    padding: 20px;
    border-radius: 10px;
    background: ${(props) => props.theme.colors.colorSecondary};
`
const Container = styled.div`
    max-width: 880px;
    margin: 80px auto;
    padding: 0 15px;
    @media (max-width: 767px) {
        margin: 50px auto;
    }
`
const InnerContent = styled.div`
    border-radius: 20px;
    background: ${(props) => props.theme.colors.colorSecondary};
`

const Content = styled.div`
    padding: 20px;
`
const BtnContainer = styled.div`
    padding-top: 20px;
    text-align: center;
`
const Header = styled.div`
    border-bottom: 1px solid ${(props) => props.theme.colors.border};
    display: flex;
    align-items: center;
    padding: 10px 0 20px 0;

    .clear {
        cursor: pointer;
        color: ${(props) => props.theme.colors.blueish};
    }
    span {
        flex: 0 0 55px;
        font-size: 14px;

        &.title {
            display: block;
            flex: 1;
            text-align: center;
            font-weight: bold;
            font-size: ${(props) => props.theme.font.medium};
        }
    }
`
const Btn = styled.button`
    border: 0;
    padding: 0;
    border-radius: 0;
    box-shadow: none;
    outline: none;
    background: transparent;
    svg {
        color: ${(props) => props.theme.colors.customSecondary};
        cursor: pointer;
    }
`

const WrapBtn = styled(Btn)`
    color: ${(props) => props.theme.colors.blueish};
`

const WrapBox = styled.div`
    margin-top: 12px;
    font-size: 14px;
`

const Box = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 30px 0;
    @media (max-width: 767px) {
        flex-direction: column;
        padding: 15px 0;
    }
`

const Col = styled.div`
    flex: 0 0 48%;
`

const DropDownContainer = styled.div``

export const SideLabel = styled.div`
    font-weight: 600;
    font-size: ${(props) => props.theme.font.default};
    margin-bottom: 10px;
`

const Inputs = styled.div`
    margin-top: 30px;
`

const Stats = styled.div`
    padding: 20px;
    border-radius: 10px;
    background: ${(props) => props.theme.colors.placeholder};
    .blockie {
        border-bottom: 1px solid ${(props) => props.theme.colors.border};
        &:last-child {
            border: 0;
        }
    }
    @media (max-width: 767px) {
        margin-top: 20px;
    }
`

const Flex = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 13px 0;
    &.hasBtn {
        margin: 0 0 20px 0;
        button {
            width: 100%;
            text-align: center;
            flex: 0 0 48%;
        }
        @media (max-width: 767px) {
            flex-direction: column;
            button {
                margin-top: 20px;
            }
        }
    }
`
const Label = styled.div<{ color?: 'primary' | 'secondary' }>`
    font-size: ${(props) => props.theme.font.small};
    color: ${({ theme, color }) => (color ? theme.colors[color] : theme.colors.primary)};
    display: flex;
    align-items: center;
    svg {
        margin-right: 5px;
    }
`

const Value = styled.div`
    font-size: ${(props) => props.theme.font.small};
    color: ${(props) => props.theme.colors.primary};
`

const InfoIcon = styled.div`
    cursor: pointer;
    svg {
        fill: ${(props) => props.theme.colors.secondary};
        color: ${(props) => props.theme.colors.placeholder};
        position: relative;
        top: 2px;
    }
`

const Note = styled.div`
    color: ${(props) => props.theme.colors.secondary};
    font-size: ${(props) => props.theme.font.extraSmall};
    span {
        color: ${(props) => props.theme.colors.yellowish};
    }
`
