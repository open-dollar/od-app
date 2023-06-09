import React, { useCallback, useMemo, useState } from 'react'
import { ArrowLeft, Info } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'
import Button from '../../components/Button'
import Dropdown from '../../components/Dropdown'
import Modal from '../../components/Modals/Modal'
import TokenInput from '../../components/TokenInput'
import { useActiveWeb3React } from '../../hooks'
import { handleTransactionError } from '../../hooks/TransactionHooks'
import { useTokenBalanceInUSD } from '../../hooks/useGeb'
import { useSafeInfo, StatsType, useInputsHandlers } from '../../hooks/useSafe'
import { useStoreActions, useStoreState } from '../../store'
import { DEFAULT_SAFE_STATE } from '../../utils/constants'
import { TOKENS } from '../../utils/tokens'
import { formatNumber } from '../../utils/helper'
import Review from './Review'

const CollateralTypes = [
    { item: 'ETH-A', img: require('../../assets/eth-img.svg').default },
]

const CreateSafe = () => {
    const { library, account } = useActiveWeb3React()
    const [showPreview, setShowPreview] = useState(false)
    const { safeModel: safeState } = useStoreState((state) => state)
    const history = useHistory()
    const {
        safeModel: safeActions,
        connectWalletModel: connectWalletActions,
        popupsModel: popupsActions,
    } = useStoreActions((state) => state)
    const {
        liquidationData,
        stats,
        error,
        balances,
        availableRai,
        parsedAmounts,
        totalCollateral,
        totalDebt,
        collateralRatio,
        liquidationPrice,
    } = useSafeInfo('create')
    const { leftInput, rightInput } = parsedAmounts
    const { onLeftInput, onRightInput } = useInputsHandlers()
    const { t } = useTranslation()
    const isValid = !error

    const ethBalanceUSD = useTokenBalanceInUSD('ETH', balances.eth)
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

    const onMaxLeftInput = () => onLeftInput(formattedBalance.eth.toString())
    const onMaxRightInput = () => onRightInput(availableRai.toString())

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
                                />
                            </DropDownContainer>

                            <Inputs>
                                <SideLabel>{`Deposit ETH and Borrow RAI`}</SideLabel>

                                <TokenInput
                                    token={TOKENS.eth}
                                    label={`Balance: ${formattedBalance.eth} ${TOKENS.eth.name}`}
                                    rightLabel={`~$${formattedBalanceInUSD.eth}`}
                                    onChange={onLeftInput}
                                    value={leftInput}
                                    handleMaxClick={onMaxLeftInput}
                                    data_test_id="deposit_borrow"
                                />

                                <br />
                                <TokenInput
                                    token={TOKENS.rai}
                                    label={`Borrow RAI: ${formatNumber(
                                        availableRai,
                                        2
                                    )} ${TOKENS.rai.name}`}
                                    rightLabel={`~$${formattedBalanceInUSD.rai}`}
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
                            )} RAI`}
                        </Note>
                        <Button onClick={handleSubmit} disabled={!isValid}>
                            {error ?? 'Review Transaction'}
                        </Button>
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
