import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Info } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import ReactTooltip from 'react-tooltip'
import { ApprovalState, useTokenApproval } from 'src/hooks/useTokenApproval'
import styled from 'styled-components'
import Button from '../../components/Button'
import Dropdown from '../../components/Dropdown'
import Modal from '../../components/Modals/Modal'
import TokenInput from '../../components/TokenInput'
import { useActiveWeb3React } from '../../hooks'
import { handleTransactionError } from '../../hooks/TransactionHooks'
import { useTokenBalanceInUSD } from '../../hooks/useGeb'
import { StatsType, useInputsHandlers, useSafeInfo } from '../../hooks/useSafe'
import { useStoreActions, useStoreState } from '../../store'
import { DEFAULT_SAFE_STATE } from '../../utils/constants'
import { formatNumber } from '../../utils/helper'
import { TOKENS } from '../../utils/tokens'
import Review from './Review'
import { ethers } from 'ethers'

const CollateralTypes = [
    TOKENS.WETH,
]

const CreateSafe = () => {
    const {
        liquidationData,
        stats,
        error,
        balances,
        availableHai,
        parsedAmounts,
        totalCollateral,
        totalDebt,
        collateralRatio,
        liquidationPrice,
    } = useSafeInfo('create')
    const [selectedItem, setSelectedItem] = useState<string>(CollateralTypes[0].name);
    const selectedCollateral = TOKENS[selectedItem]
    const { library, account } = useActiveWeb3React()
    const [showPreview, setShowPreview] = useState(false)
    const { safeModel: safeState } = useStoreState((state) => state)
    const history = useHistory()
    const {
        safeModel: safeActions,
        connectWalletModel: connectWalletActions,
        popupsModel: popupsActions,
    } = useStoreActions((state) => state)
    const { leftInput, rightInput } = parsedAmounts
    const { onLeftInput, onRightInput } = useInputsHandlers()
    const { t } = useTranslation()
    const isValid = !error

    const { connectWalletModel: {proxyAddress, tokensData} } =
        useStoreState((state) => state)

    const parsedWethBalance = tokensData.WETH.balance ? ethers.utils.formatEther(tokensData.WETH.balance) : '0'
    const wethBalanceUSD = useTokenBalanceInUSD('WETH', parsedWethBalance)

    const haiBalanceUSD = useTokenBalanceInUSD(
        'HAI',
        rightInput ? rightInput : availableHai
    )

    const formattedBalance = useMemo(() => {
        return {
            weth: formatNumber(balances.weth, 2),
            hai: formatNumber(balances.hai, 2),
        }
    }, [balances])

    const selectedTokenBalance = useMemo(() => {
        const parsedNumber = ethers.utils.formatEther(tokensData[selectedCollateral.name]?.balance)
        return formatNumber(parsedNumber, 2)
    }, [balances, selectedItem])

    const formattedBalanceInUSD = useMemo(() => {
        return {
            weth: wethBalanceUSD,
            hai: haiBalanceUSD,
        }
    }, [wethBalanceUSD, haiBalanceUSD])

    const onMaxLeftInput = () => onLeftInput(formattedBalance.weth.toString())
    const onMaxRightInput = () => onRightInput(availableHai.toString())

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
            collateral: selectedItem
        })

        setShowPreview(true)
    }

    useEffect(() => {
        reset()
    }, [selectedItem])

    const reset = () => {
        onClearAll()
        safeActions.setSafeData({ ...DEFAULT_SAFE_STATE, collateral: selectedItem })
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
                history.push('/')
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

    let [approvalState, approve] = useTokenApproval(leftInput,
        selectedCollateral.address,
        proxyAddress);


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
                        <Btn className="clear" onClick={onClearAll}>
                            Clear All
                        </Btn>
                    </Header>

                    <Box>
                        <Col>
                            <DropDownContainer>
                                <SideLabel>{`Select Collateral Type`}</SideLabel>
                                <Dropdown
                                    items={CollateralTypes}
                                    itemSelected={CollateralTypes[0]}
                                    getSelectedItem={setSelectedItem}
                                />
                            </DropDownContainer>

                            <Inputs>
                                <SideLabel>{`Deposit ${selectedItem} and Borrow HAI`}</SideLabel>

                                <TokenInput
                                    token={{ name: selectedCollateral.name, icon: selectedCollateral.icon }}
                                    label={`Balance: ${selectedTokenBalance} ${selectedCollateral.name}`}
                                    rightLabel={`~$${formattedBalanceInUSD.weth}`}
                                    onChange={onLeftInput}
                                    value={leftInput}
                                    handleMaxClick={onMaxLeftInput}
                                    data_test_id="deposit_borrow"
                                />

                                <br />
                                <TokenInput
                                    token={TOKENS.HAI}
                                    label={`Borrow HAI: ${formatNumber(
                                        availableHai,
                                        2
                                    )} ${TOKENS.HAI.name}`}
                                    rightLabel={`~$${formattedBalanceInUSD.hai}`}

                                    onChange={onRightInput}
                                    value={rightInput}
                                    handleMaxClick={onMaxRightInput}
                                    data_test_id="repay_withdraw"
                                />
                            </Inputs>
                        </Col>

                        <Col>
                            <Stats>
                                {Object.keys(stats).map((key) => {
                                    const isPrimary = key === 'data'
                                    return (
                                        <div key={key} className="blockie">
                                            {stats[key as StatsType].map(
                                                (item) => {
                                                    return (
                                                        <Flex key={item.label}>
                                                            <Label
                                                                color={
                                                                    isPrimary
                                                                        ? 'primary'
                                                                        : 'secondary'
                                                                }
                                                            >
                                                                {item.tip ? (
                                                                    <InfoIcon
                                                                        data-tip={
                                                                            item.tip
                                                                        }
                                                                    >
                                                                        <Info size="13" />
                                                                    </InfoIcon>
                                                                ) : null}
                                                                {item.label}
                                                            </Label>
                                                            <Value>
                                                                {item.value}
                                                            </Value>
                                                        </Flex>
                                                    )
                                                }
                                            )}
                                        </div>
                                    )
                                })}
                            </Stats>
                        </Col>
                    </Box>

                    <Flex className="hasBtn">
                        <Note data-test-id="debt_floor_note">
                            <span>Note:</span>
                            {` The minimum amount to mint per safe is ${Math.ceil(
                                Number(formatNumber(liquidationData.debtFloor))
                            )} HAI`}
                        </Note>
                        {(approvalState === ApprovalState.APPROVED) ?
                            <Button onClick={handleSubmit} disabled={!isValid}>
                                {error ?? 'Review Transaction'}
                            </Button>
                            :
                            (approvalState === ApprovalState.PENDING) ?
                                <Button disabled={true}>
                                    Pending Approval..
                                </Button>
                                :
                                <Button onClick={approve} disabled={!isValid}>
                                    {error ?? `Approve ${selectedItem}`}
                                </Button>
                        }
                    </Flex>
                    <ReactTooltip multiline type="light" data-effect="solid" />
                </Content>
            </InnerContent>
        </Container>
    )
}

export default CreateSafe

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

const SideLabel = styled.div`
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
    color: ${({ theme, color }) =>
        color ? theme.colors[color] : theme.colors.primary};
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
