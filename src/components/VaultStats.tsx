import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Info } from 'react-feather'
import Numeral from 'numeral'

import { useTokenBalanceInUSD, useSafeInfo } from '~/hooks'
import { formatNumber, formatWithCommas, getRatePercentage, ratioChecker, returnState } from '~/utils'
import { useStoreState } from '~/store'
import { Tooltip as ReactTooltip } from 'react-tooltip'
//@ts-ignore
import { generateSvg } from '@opendollar/svg-generator'

const VaultStats = ({ isModifying, isDeposit }: { isModifying: boolean; isDeposit: boolean; isOwner: boolean }) => {
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

    const totalDebtInUSD = useTokenBalanceInUSD('OD', totalDebt as string)

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
    const ODPrice = singleSafe ? formatNumber(singleSafe.currentRedemptionPrice, 3) : '0'
    const [svg, setSvg] = useState('')

    const statsForSVG = useMemo(
        () => ({
            vaultID: singleSafe?.id,
            stabilityFee:
                Math.floor(
                    Number(
                        getRatePercentage(
                            singleSafe?.totalAnnualizedStabilityFee ? singleSafe?.totalAnnualizedStabilityFee : '0',
                            2
                        )
                    )
                ).toString() + '%',
            debtAmount: formatWithCommas(totalDebt) + ' OD',
            collateralAmount: formatWithCommas(collateral) + ' ' + collateralName,
            collateralizationRatio: singleSafe?.collateralRatio === '∞' ? '∞' : Number(singleSafe?.collateralRatio),
            safetyRatio: Number(safeState.liquidationData!.collateralLiquidationData[collateralName].safetyCRatio),
            liqRatio: Number(safeState.liquidationData!.collateralLiquidationData[collateralName].liquidationCRatio),
        }),
        [singleSafe, totalDebt, collateral, collateralName, safeState.liquidationData]
    )

    useEffect(() => {
        setSvg(generateSvg(statsForSVG))
    }, [singleSafe, totalDebt, collateral, collateralName, safeState.liquidationData, statsForSVG])

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
                    <InnerLeft className="main">
                        <Main>
                            <SVGContainer>
                                <div
                                    style={{
                                        maxWidth: '100%',
                                        height: 'auto',
                                        border: '1px solid #00374E',
                                        borderRadius: '0px',
                                    }}
                                    dangerouslySetInnerHTML={{ __html: svg }}
                                ></div>
                            </SVGContainer>
                        </Main>
                    </InnerLeft>
                </Left>

                <Right>
                    <Inner>
                        <Side style={{ borderTop: '1px solid #00587E', paddingTop: '8px' }}>
                            <InfoIcon data-tooltip-id="vault-stats" data-tooltip-content={t('debt_owed_tip')}>
                                <Info size="16" />
                            </InfoIcon>
                            <SideTitle>
                                Debt Owed
                                {modified ? (
                                    <div className="sideNote">
                                        After:{' '}
                                        <span className={isDeposit ? 'green' : 'yellow'}>
                                            {formatWithCommas(newDebt, 2)}
                                        </span>
                                    </div>
                                ) : null}
                            </SideTitle>
                            <SideValue>
                                {formatWithCommas(totalDebt)} OD
                                <DollarValue>${formatWithCommas(totalDebtInUSD)}</DollarValue>
                            </SideValue>
                        </Side>
                        <Side>
                            <InfoIcon
                                data-tooltip-id="vault-stats"
                                data-tooltip-content={t('collateral_deposited_tip')}
                            >
                                <Info size="16" />
                            </InfoIcon>
                            <SideTitle>
                                Collateral Deposited
                                {modified ? (
                                    <div className="sideNote">
                                        After:{' '}
                                        <span className={isDeposit ? 'green' : 'yellow'}>
                                            {formatWithCommas(newCollateral)}
                                        </span>
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </SideTitle>
                            <SideValue>
                                {formatWithCommas(collateral)} {singleSafe?.collateralName}
                                <DollarValue>${formatWithCommas(collateralInUSD, 2, 2)}</DollarValue>
                            </SideValue>
                        </Side>
                        <Side>
                            <InfoIcon
                                data-tooltip-id="vault-stats"
                                data-tooltip-content={t('collateral_deposited_tip')}
                            >
                                <Info size="16" />
                            </InfoIcon>
                            <SideTitle>
                                Collateral Ratio (min {collateralRatio}%)
                                <div>
                                    <span
                                        style={{
                                            color: '#FCBF3B',
                                            fontSize: '12px',
                                            fontWeight: '400',
                                            lineHeight: '15.6px',
                                            opacity: '60%',
                                        }}
                                    >
                                        Safety:{' '}
                                        {Number(
                                            safeState.liquidationData!.collateralLiquidationData[collateralName]
                                                .safetyCRatio
                                        ) * 100}
                                        %
                                    </span>{' '}
                                    &nbsp;
                                    <span
                                        style={{
                                            color: '#E45200',
                                            fontSize: '12px',
                                            fontWeight: '400',
                                            lineHeight: '15.6px',
                                            opacity: '60%',
                                        }}
                                    >
                                        Minimum:{' '}
                                        {Number(
                                            safeState.liquidationData!.collateralLiquidationData[collateralName]
                                                .liquidationCRatio
                                        ) * 100}
                                        %
                                    </span>
                                </div>
                                {modified ? (
                                    <div className="sideNote">
                                        After:{' '}
                                        <span
                                            className={
                                                isDeposit
                                                    ? 'green'
                                                    : 'yellow' &&
                                                      returnState(
                                                          ratioChecker(
                                                              Number(newCollateralRatio),
                                                              Number(
                                                                  safeState.liquidationData!.collateralLiquidationData[
                                                                      collateralName
                                                                  ].liquidationCRatio
                                                              ),
                                                              Number(
                                                                  safeState.liquidationData!.collateralLiquidationData[
                                                                      collateralName
                                                                  ].safetyCRatio
                                                              )
                                                          )
                                                      ).toLowerCase()
                                            }
                                        >
                                            {formatWithCommas(newCollateralRatio)}%
                                        </span>
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </SideTitle>
                            <SideValue>{singleSafe ? formatWithCommas(singleSafe?.collateralRatio) : '-'}%</SideValue>
                        </Side>
                        <Side>
                            <InfoIcon data-tooltip-id="vault-stats" data-tooltip-content={t('eth_osm_tip')}>
                                <Info size="16" />
                            </InfoIcon>
                            <SideTitle>{singleSafe?.collateralName} Price (Delayed)</SideTitle>
                            <SideValue>${formatWithCommas(collateralUnitPriceUSD, 2, 2)}</SideValue>
                        </Side>

                        <Side>
                            <InfoIcon data-tooltip-id="vault-stats" data-tooltip-content={t('hai_red_price_tip')}>
                                <Info size="16" />
                            </InfoIcon>
                            <SideTitle>OD Redemption Price</SideTitle>
                            <SideValue>${ODPrice}</SideValue>
                        </Side>

                        <Side>
                            <InfoIcon data-tooltip-id="vault-stats" data-tooltip-content={t('liquidation_price_tip')}>
                                <Info size="16" />
                            </InfoIcon>
                            <SideTitle>
                                Liquidation Price
                                {modified ? (
                                    <div className="sideNote">
                                        After:{' '}
                                        <span className={`${isDeposit ? 'green' : 'yellow'}`}>
                                            ${formatWithCommas(newLiquidationPrice, 2, 2)}
                                        </span>
                                    </div>
                                ) : null}
                            </SideTitle>
                            <SideValue>
                                ${singleSafe ? formatWithCommas(singleSafe.liquidationPrice, 2, 2) : '-'}
                            </SideValue>
                        </Side>

                        <Side>
                            <InfoIcon data-tooltip-id="vault-stats" data-tooltip-content={t('liquidation_penalty_tip')}>
                                <Info size="16" />
                            </InfoIcon>
                            <SideTitle>Liquidation Penalty</SideTitle>
                            <SideValue>{`${liquidationPenalty}%`}</SideValue>
                        </Side>

                        <Side>
                            <InfoIcon data-tooltip-id="vault-stats" data-tooltip-content={t('stability_fee_tip')}>
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
                            <InfoIcon data-tooltip-id="vault-stats" data-tooltip-content={t('annual_redemption_tip')}>
                                <Info size="16" />
                            </InfoIcon>
                            <SideTitle>Annual Redemption Rate</SideTitle>
                            <SideValue>{`${returnRedRate()}%`}</SideValue>
                        </Side>
                    </Inner>
                </Right>
            </Flex>

            <ReactTooltip variant="light" data-effect="solid" id="vault-stats" />
        </>
    )
}

export default VaultStats

const SVGContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
        width: 0;
        background: transparent;
    }
`

const Flex = styled.div`
    display: flex;
    @media (max-width: 767px) {
        flex-direction: column;
    }
`

const InnerLeft = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
`

const Inner = styled.div`
    background: ${(props) => props.theme.colors.colorPrimary};
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

const DollarValue = styled.div`
    font-size: 13px;
    color: ${(props) => props.theme.colors.blueish};
`

const Side = styled.div`
    display: flex;
    &:last-child {
        margin-bottom: 0;
    }
    border-bottom: 1px solid #00587e;
    padding-bottom: 4px;
    @media (max-width: 767px) {
        padding-top: 4px;
    }
    svg {
        border: 1px solid #00374e;
    }
`

const SideTitle = styled.div`
    color: ${(props) => props.theme.colors.secondary};
    font-size: 16px;
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
    text-align: right;
    color: ${(props) => props.theme.colors.customSecondary};
    font-size: 16px;
`

const InfoIcon = styled.div`
    cursor: pointer;
    svg {
        fill: ${(props) => props.theme.colors.secondary};
        color: ${(props) => props.theme.colors.foreground};
        position: relative;
        top: 4px;
        margin-right: 5px;
    }
`
