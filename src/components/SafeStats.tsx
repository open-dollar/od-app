import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'
import { Info } from 'react-feather'
import Numeral from 'numeral'

import { useTokenBalanceInUSD, useSafeInfo } from '~/hooks'
import { formatNumber, getRatePercentage, ratioChecker, returnState } from '~/utils'
import { useStoreState } from '~/store'

const SafeStats = ({
    isModifying,
    isDeposit,
    isOwner,
}: {
    isModifying: boolean
    isDeposit: boolean
    isOwner: boolean
}) => {
    const { t } = useTranslation()
    const {
        totalDebt: newDebt,
        totalCollateral: newCollateral,
        collateralRatio: newCollateralRatio,
        parsedAmounts,
        liquidationPrice: newLiquidationPrice,
    } = useSafeInfo(isModifying ? (isDeposit ? 'deposit_borrow' : 'repay_withdraw') : 'info')

    const { safeModel: safeState } = useStoreState((state) => state)

    const { singleSafe } = safeState

    const collateral = formatNumber(singleSafe?.collateral || '0')
    const totalDebt = formatNumber(singleSafe?.totalDebt || '0')

    const totalDebtInUSD = useTokenBalanceInUSD('HAI', totalDebt as string)

    const collateralName = singleSafe!.collateralName
    const collateralUnitPriceUSD = formatNumber(
        safeState.liquidationData!.collateralLiquidationData[collateralName].currentPrice.value
    )
    const collateralInUSD = formatNumber((Number(collateralUnitPriceUSD) * Number(collateral)).toString())
    const collateralRatio =
        Number(safeState.liquidationData!.collateralLiquidationData[collateralName].safetyCRatio) * 100

    const liquidationPenalty = getRatePercentage(
        safeState.liquidationData!.collateralLiquidationData[collateralName].liquidationPenalty,
        10
    )
    const haiPrice = singleSafe ? formatNumber(singleSafe.currentRedemptionPrice, 3) : '0'

    const returnRedRate = () => {
        const currentRedemptionRate = singleSafe ? getRatePercentage(singleSafe.currentRedemptionRate, 10) : '0'
        if (Number(currentRedemptionRate) > 0 && Number(currentRedemptionRate) < 0.001) {
            return '< 0.001'
        } else if (Number(currentRedemptionRate) < 0 && Number(currentRedemptionRate) > -0.001) {
            return '> -0.001'
        } else if (Number(currentRedemptionRate) === 0) {
            return '0'
        } else {
            return Numeral(currentRedemptionRate).format('0.0000')
        }
    }

    // const handleCollectSurplus = async () => {
    //     if (!library || !account) throw new Error('No library or account')
    //     if (!singleSafe) throw new Error('no safe')
    //     setIsLoading(true)
    //     try {
    //         popupsActions.setIsWaitingModalOpen(true)
    //         popupsActions.setWaitingPayload({
    //             title: 'Waiting For Confirmation',
    //             text: 'Collecting ETH',
    //             hint: 'Confirm this transaction in your wallet',
    //             status: 'loading',
    //         })
    //         const signer = library.getSigner(account)
    //         await safeActions.collectETH({ signer, safe: singleSafe })
    //         await timeout(3000)
    //     } catch (e) {
    //         handleTransactionError(e)
    //     } finally {
    //         setIsLoading(false)
    //     }
    // }

    const modified = useMemo(() => {
        if (isModifying) {
            return parsedAmounts.rightInput || parsedAmounts.leftInput
        }
        return false
    }, [isModifying, parsedAmounts.leftInput, parsedAmounts.rightInput])

    return (
        <>
            <Flex>
                <Left>
                    <Inner className="main">
                        <Main>
                            <MainLabel>{singleSafe?.collateralName} Collateral</MainLabel>
                            <MainValue>
                                {collateral} <span>{singleSafe?.collateralName}</span>
                            </MainValue>
                            <MainChange>
                                {modified ? (
                                    <>
                                        After:{' '}
                                        <span className={isDeposit ? 'green' : 'yellow'}>
                                            {newCollateral} {singleSafe?.collateralName}
                                        </span>
                                    </>
                                ) : (
                                    `$${collateralInUSD}`
                                )}
                            </MainChange>
                        </Main>

                        <Main className="mid">
                            <MainLabel>HAI Debt</MainLabel>
                            <MainValue>
                                {totalDebt} <span>HAI</span>
                            </MainValue>
                            <MainChange>
                                {' '}
                                {modified ? (
                                    <>
                                        After: <span className={isDeposit ? 'green' : 'yellow'}>{newDebt} HAI</span>
                                    </>
                                ) : (
                                    `$${totalDebtInUSD}`
                                )}
                            </MainChange>
                        </Main>

                        <Main>
                            <MainLabel>
                                <Circle
                                    data-tip={`${
                                        singleSafe && returnState(singleSafe.riskState)
                                            ? returnState(singleSafe.riskState)
                                            : 'No'
                                    } Risk`}
                                    className={
                                        singleSafe && returnState(singleSafe.riskState)
                                            ? returnState(singleSafe.riskState).toLowerCase()
                                            : 'dimmed'
                                    }
                                />{' '}
                                Ratio (min {collateralRatio}%)
                            </MainLabel>
                            <MainValue>{singleSafe?.collateralRatio}%</MainValue>
                            <MainChange>
                                {modified ? (
                                    <>
                                        After:{' '}
                                        <span
                                            className={returnState(
                                                ratioChecker(Number(newCollateralRatio), Number(collateralRatio))
                                            ).toLowerCase()}
                                        >
                                            {newCollateralRatio}%
                                        </span>
                                    </>
                                ) : (
                                    ''
                                )}
                            </MainChange>
                        </Main>
                    </Inner>
                </Left>

                <Right>
                    <Inner>
                        <Side>
                            <InfoIcon data-tip={t('eth_osm_tip')}>
                                <Info size="16" />
                            </InfoIcon>
                            <SideTitle>{singleSafe?.collateralName} Price (Delayed)</SideTitle>
                            <SideValue>${collateralUnitPriceUSD}</SideValue>
                        </Side>

                        <Side>
                            <InfoIcon data-tip={t('hai_red_price_tip')}>
                                <Info size="16" />
                            </InfoIcon>
                            <SideTitle>HAI Redemption Price</SideTitle>
                            <SideValue>{haiPrice}</SideValue>
                        </Side>

                        <Side>
                            <InfoIcon data-tip={t('liquidation_price_tip')}>
                                <Info size="16" />
                            </InfoIcon>
                            <SideTitle>
                                Liquidation Price
                                {modified ? (
                                    <div className="sideNote">
                                        After:{' '}
                                        <span className={`${isDeposit ? 'green' : 'yellow'}`}>
                                            ${newLiquidationPrice}
                                        </span>
                                    </div>
                                ) : null}
                            </SideTitle>
                            <SideValue>{`$${singleSafe?.liquidationPrice || '-'}`}</SideValue>
                        </Side>

                        <Side>
                            <InfoIcon data-tip={t('liquidation_penalty_tip')}>
                                <Info size="16" />
                            </InfoIcon>
                            <SideTitle>Liquidation Penalty</SideTitle>
                            <SideValue>{`${liquidationPenalty}%`}</SideValue>
                        </Side>

                        <Side>
                            <InfoIcon data-tip={t('stability_fee_tip')}>
                                <Info size="16" />
                            </InfoIcon>
                            <SideTitle>Stability Fee</SideTitle>
                            <SideValue>{`${
                                singleSafe?.totalAnnualizedStabilityFee
                                    ? getRatePercentage(singleSafe?.totalAnnualizedStabilityFee, 2)
                                    : 0
                            }%`}</SideValue>
                        </Side>

                        <Side>
                            <InfoIcon data-tip={t('annual_redemption_tip')}>
                                <Info size="16" />
                            </InfoIcon>
                            <SideTitle>Annual Redemption Rate</SideTitle>
                            <SideValue>{`${returnRedRate()}%`}</SideValue>
                        </Side>
                    </Inner>
                </Right>
            </Flex>

            <ReactTooltip multiline type="light" data-effect="solid" />
        </>
    )
}

export default SafeStats

const Flex = styled.div`
    display: flex;
    @media (max-width: 767px) {
        flex-direction: column;
    }
`
const Inner = styled.div`
    background: ${(props) => props.theme.colors.colorSecondary};
    padding: 20px;
    border-radius: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &.main {
        padding: 30px;
    }
`

const Left = styled.div`
    flex: 0 0 55%;
    padding-right: 10px;
    margin-top: 20px;
    @media (max-width: 767px) {
        flex: 0 0 100%;
        padding-right: 0;
    }
`
const Right = styled.div`
    flex: 0 0 45%;
    padding-left: 10px;
    margin-top: 20px;
    @media (max-width: 767px) {
        flex: 0 0 100%;
        padding-left: 0;
    }
`

const Main = styled.div`
    &.mid {
        margin: 30px 0;
    }
`

const MainLabel = styled.div`
    font-size: ${(props) => props.theme.font.small};
    color: ${(props) => props.theme.colors.secondary};
    display: flex;
    align-items: center;
`

const MainValue = styled.div`
    font-size: 25px;
    color: ${(props) => props.theme.colors.primary};
    font-family: 'Montserrat', sans-serif;
    margin: 2px 0;
    span {
        font-size: ${(props) => props.theme.font.small};
    }
`

const MainChange = styled.div`
    font-size: 13px;
    color: ${(props) => props.theme.colors.customSecondary};
    span {
        &.green,
        &.low {
            color: ${(props) => props.theme.colors.blueish};
        }
        &.yellow {
            color: ${(props) => props.theme.colors.yellowish};
        }
        &.dimmed {
            color: ${(props) => props.theme.colors.secondary};
        }
        &.medium {
            color: ${(props) => props.theme.colors.yellowish};
        }
        &.high {
            color: ${(props) => props.theme.colors.dangerColor};
        }
    }
`
const Circle = styled.div`
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: ${(props) => props.theme.colors.successColor};
    margin-right: 5px;
    cursor: pointer;
    &.dimmed {
        background: ${(props) => props.theme.colors.secondary};
    }
    &.medium {
        background: ${(props) => props.theme.colors.yellowish};
    }
    &.high {
        background: ${(props) => props.theme.colors.dangerColor};
    }
    &.liquidation {
        background: ${(props) => props.theme.colors.dangerColor};
    }
`

const Side = styled.div`
    display: flex;
    align-items: flex-start;
    margin-bottom: 20px;
    &:last-child {
        margin-bottom: 0;
    }
`

const SideTitle = styled.div`
    color: ${(props) => props.theme.colors.secondary};
    .sideNote {
        font-size: 12px;
        span {
            &.green {
                color: ${(props) => props.theme.colors.blueish};
            }
            &.yellow {
                color: ${(props) => props.theme.colors.yellowish};
            }
        }
    }
`
const SideValue = styled.div`
    margin-left: auto;
    color: ${(props) => props.theme.colors.customSecondary};
    font-family: 'Montserrat', sans-serif;
`

// const SurplusBlock = styled.div``

// const StateInner = styled.div`
//     border: 1px solid ${(props) => props.theme.colors.border};
//     border-radius: 15px;
//     background: #1e3b58;
//     text-align: center;
//     padding: 20px;
//     position: relative;
//     margin-top: 20px;
//     button {
//         background: ${(props) => props.theme.colors.greenish};
//         color: ${(props) => props.theme.colors.primary};
//     }
// `

// const Text = styled.div`
//     font-size: ${(props) => props.theme.font.small};
// `

// const Inline = styled.div`
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
// `

const InfoIcon = styled.div`
    cursor: pointer;
    svg {
        fill: ${(props) => props.theme.colors.secondary};
        color: ${(props) => props.theme.colors.foreground};
        position: relative;
        top: 2px;
        margin-right: 5px;
    }
`
