import { useCallback, useEffect, useMemo, useState } from 'react'
import { TokenData } from '@opendollar/sdk/lib/contracts/addreses'
import { ChevronLeft, Info, Loader } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import styled from 'styled-components'
import { ethers } from 'ethers'

import { DEFAULT_SAFE_STATE, getTokenLogo, formatNumber, formatWithCommas } from '~/utils'
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

const CreateVault = ({
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
    const { provider, account } = useActiveWeb3React()
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

    const formattedCollateralBalances = useMemo(() => {
        return collaterals.reduce((acc, collateral) => {
            const balance = tokensFetchedData[collateral.symbol]?.balanceE18 || '0'
            const formattedBalance = ethers.utils.formatEther(balance)
            return { ...acc, [collateral.symbol]: formattedBalance }
        }, {} as { [symbol: string]: string })
    }, [collaterals, tokensFetchedData])

    const collateralsDropdown = collaterals.map((collateral) => {
        return {
            name: collateral.symbol,
            icon: getTokenLogo(collateral.symbol),
            value: formatWithCommas(formattedCollateralBalances[collateral.symbol]),
        }
    })

    const dropdownSelected = collateralsDropdown.find((item) => item.name === selectedItem)!

    const selectedCollateral = tokensData && tokensData[selectedItem]
    const selectedCollateralBalance = formattedCollateralBalances[selectedItem]
    const selectedCollateralDecimals = tokensFetchedData[selectedItem].decimals
    const haiBalanceUSD = useTokenBalanceInUSD('OD', rightInput ? rightInput : availableHai)

    const redirectToWrapEth = () => {
        const url = 'https://wrapeth.com/'
        window.open(url, '_blank')
    }

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
        return 'Creating Vault'
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
        redirectToWrapEth()
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
            safeActions.setSafeData({
                ...safeState.safeData,
                leftInput: parsedAmounts.leftInput || '0',
                rightInput: parsedAmounts.rightInput || '0',
                totalCollateral,
                totalDebt,
            })
            const signer = provider.getSigner(account)
            try {
                connectWalletActions.setIsStepLoading(true)
                await safeActions.depositAndBorrow({
                    safeData: safeState.safeData,
                    signer,
                })
                history.push('/vaults')
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
                            <FlexBtn>
                                <ChevronLeft onClick={() => history.goBack()} />
                                <span>Back</span>
                            </FlexBtn>
                        </Btn>
                        <span className="title"> {t('create_safe')}</span>
                    </Header>
                    <Box>
                        <ColWrapper>
                            {selectedCollateral ? (
                                <Col>
                                    <DropDownContainer>
                                        <SideLabel>{`Select Collateral Type`}</SideLabel>
                                        <Dropdown
                                            items={collateralsDropdown}
                                            itemSelected={dropdownSelected}
                                            getSelectedItem={setSelectedItem}
                                            fontSize="14px"
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
                                        <SideLabel>{`Deposit ${selectedItem} and Borrow OD`}</SideLabel>

                                        <TokenInput
                                            token={
                                                selectedCollateral?.symbol
                                                    ? {
                                                          name: selectedCollateral?.symbol || '-',
                                                          icon: getTokenLogo(selectedCollateral?.symbol),
                                                      }
                                                    : undefined
                                            }
                                            label={`Balance: ${formatWithCommas(selectedTokenBalance, 2)} ${
                                                selectedCollateral?.symbol
                                            }`}
                                            rightLabel={`~$${formatWithCommas(selectedTokenBalanceInUSD, 2)}`}
                                            onChange={onLeftInput}
                                            value={leftInput}
                                            handleMaxClick={onMaxLeftInput}
                                            data_test_id="deposit_borrow"
                                            decimals={Number(selectedCollateralDecimals)}
                                        />

                                        <br />
                                        <TokenInput
                                            token={
                                                tokensData.OD && {
                                                    icon: getTokenLogo(tokensData.OD.symbol),
                                                    name: tokensData.OD.symbol,
                                                }
                                            }
                                            label={`Borrow OD: ${formatWithCommas(availableHai)} ${
                                                tokensData.OD?.symbol
                                            }`}
                                            rightLabel={`~$${formatWithCommas(haiBalanceUSD)}`}
                                            onChange={onRightInput}
                                            value={rightInput}
                                            handleMaxClick={onMaxRightInput}
                                            data_test_id="repay_withdraw"
                                        />
                                    </Inputs>
                                    <Note data-test-id="debt_floor_note">
                                        {` The minimum amount to mint per vault is ${debtFloor} OD`}
                                    </Note>
                                </Col>
                            ) : (
                                <Col>
                                    <Loader width={'100%'} />
                                </Col>
                            )}

                            <Col>
                                <Stats>
                                    <SubTitle>Overview</SubTitle>
                                    {Object.keys(stats).map((key) => {
                                        const isPrimary = key === 'data'
                                        return (
                                            <div key={key} className="blockie">
                                                {stats[key as StatsType].map((item) => {
                                                    return (
                                                        <StatItemWrapper key={item.label}>
                                                            <Flex>
                                                                <Label color={isPrimary ? 'primary' : 'secondary'}>
                                                                    {item.label}
                                                                    {item.tip ? (
                                                                        <InfoIcon
                                                                            data-tooltip-id="tooltip-create-vault"
                                                                            data-tooltip-content={item.tip}
                                                                        >
                                                                            <Info size="13" color="#1C293A" />
                                                                        </InfoIcon>
                                                                    ) : null}
                                                                </Label>
                                                                <Value>
                                                                    {item.value !== '-' &&
                                                                    item.label.toLowerCase().includes('collateral') &&
                                                                    item.label.toLowerCase().includes('total')
                                                                        ? formatWithCommas(item.value)
                                                                        : item.value}
                                                                </Value>
                                                            </Flex>
                                                        </StatItemWrapper>
                                                    )
                                                })}
                                            </div>
                                        )
                                    })}
                                </Stats>
                            </Col>
                        </ColWrapper>
                        <FooterWrapper>
                            <Btn className="clear" onClick={reset}>
                                Clear All
                            </Btn>
                            <Flex className="hasBtn">
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
                        </FooterWrapper>
                    </Box>

                    <ReactTooltip
                        style={{ zIndex: 99 }}
                        id="tooltip-create-vault"
                        variant="light"
                        data-effect="solid"
                    />
                </Content>
            </InnerContent>
        </>
    )
}

const CreateVaultContainer = () => {
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
                <CreateVault selectedItem={selectedItem} setSelectedItem={setSelectedItem} collaterals={collaterals} />
            )}
        </Container>
    )
}

export default CreateVaultContainer

const ReviewContainer = styled.div`
    padding: 20px;
    border-radius: 4px;
    background: linear-gradient(to bottom, #1a74ec, #6396ff);
`
const Container = styled.div`
    max-width: 1362px;
    margin: 80px auto;
    padding: 0 15px;
    @media (max-width: 767px) {
        margin: 50px auto;
    }
`
const InnerContent = styled.div`
    border-radius: 20px;
    background: ${(props) => props.theme.colors.colorSecondary};
    font-family: 'Open Sans', sans-serif;
`

const Content = styled.div`
    padding: 20px;
`

const StatItemWrapper = styled.div`
    border-bottom: 1px solid #1a74ec4d;

    &:last-child {
        border: 0;
    }
`

const BtnContainer = styled.div`
    margin-top: 24px;
    text-align: center;
    border: 2px solid #e2f1ff;
    width: 100%;
    border-radius: 4px;
    font-family: 'Barlow', sans-serif;
    font-size: 18px;
    font-weight: 600;
    line-height: 22px;
`
const Header = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 55px;

    span {
        flex: 0 0 55px;
        font-size: 14px;

        &.title {
            display: block;
            flex: 1;
            font-family: 'Barlow', sans-serif;
            text-align: center;
            font-weight: bold;
            font-size: ${(props) => props.theme.font.xxLarge};
            color: #1c293a;
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
`

const FlexBtn = styled.div`
    display: flex;
    align-items: center;

    span {
        color: ${(props) => props.theme.colors.accent};
        text-transform: uppercase;
        font-weight: 700;
    }

    svg {
        color: ${(props) => props.theme.colors.accent};
        cursor: pointer;
        width: 50px;
    }
`

const WrapBtn = styled(Btn)`
    color: ${(props) => props.theme.colors.accent};
`

const WrapBox = styled.div`
    margin-top: 12px;
    font-size: 14px;
`

const Box = styled.div`
    display: flex;
    flex-direction: column;
    box-shadow: 0px 4px 6px 0px #0d4b9d33;

    padding: 22px;
    border-radius: 8px;
    background: white;
`

const FooterWrapper = styled.div`
    display: flex;
    justify-content: space-between;

    .clear {
        cursor: pointer;
        color: ${(props) => props.theme.colors.accent};
        font-size: 14px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 2px;
    }

    @media (max-width: 767px) {
        flex-direction: column;
        padding: 15px 0;
    }
`

const ColWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;

    @media (max-width: 767px) {
        flex-direction: column;
        padding: 15px 0;
    }
`

const Col = styled.div`
    flex: 0 0 48%;
    z-index: 1;
`

const DropDownContainer = styled.div``

export const SideLabel = styled.div`
    font-weight: 400;
    font-size: ${(props) => props.theme.font.default};
    color: ${(props) => props.theme.colors.tertiary};
    margin-bottom: 10px;
`

const Inputs = styled.div`
    margin-top: 30px;
`

const Stats = styled.div`
    background: ${(props) => props.theme.colors.background};
    padding: 24px;
    border-radius: 4px;
    .blockie {
        border-bottom: 1px solid #1a74ec4d;
        &:last-child {
            border: 0;
        }
    }
    @media (max-width: 767px) {
        margin-top: 20px;
    }
`
const SubTitle = styled.div`
    color: ${(props) => props.theme.colors.accent};
    font-size: 22px;
    font-weight: 700;
    font-family: 'Barlow', sans-serif;
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
    font-size: ${(props) => props.theme.font.default};
    font-weight: 400;
    color: ${(props) => props.theme.colors.accent};
    display: flex;
    align-items: center;
`

const Value = styled.div`
    font-size: ${(props) => props.theme.font.small};
    font-weight: 700;
    color: ${(props) => props.theme.colors.accent};
`

const InfoIcon = styled.div`
    cursor: pointer;
    svg {
        /* fill: ${(props) => props.theme.colors.secondary}; */
        color: ${(props) => props.theme.colors.placeholder};
        position: relative;
        width: 20px;
        height: 20px;
        margin-left: 8px;
    }
`

const Note = styled.div`
    color: ${(props) => props.theme.colors.accent};
    background-color: ${(props) => props.theme.colors.background};
    padding-left: 18px;
    padding-top: 15px;
    padding-bottom: 15px;
    margin-top: 20px;
    border-radius: 4px;
    border-left: 3px solid ${(props) => props.theme.colors.primary};
    font-size: 15px;
    font-weight: 600;
    color: ${(props) => props.theme.colors.primary};
`
