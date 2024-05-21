import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { ExternalLink, Info } from 'react-feather'
import Numeral from 'numeral'

import { useTokenBalanceInUSD, useSafeInfo } from '~/hooks'
import {
    formatNumber,
    formatWithCommas,
    getEtherscanLink,
    getRatePercentage,
    ratioChecker,
    returnState,
    returnTotalDebt,
    returnWalletAddress,
} from '~/utils'
import { useStoreState } from '~/store'
import { Tooltip as ReactTooltip } from 'react-tooltip'
//@ts-ignore
import { generateSvg } from '@opendollar/svg-generator'
import { useWeb3React } from '@web3-react/core'

const VaultStats = ({ isModifying, isDeposit }: { isModifying: boolean; isDeposit: boolean; isOwner: boolean }) => {
    const { t } = useTranslation()
    const { chainId, account } = useWeb3React()
    const {
        collateralRatio: newCollateralRatio,
        parsedAmounts,
        liquidationPrice: newLiquidationPrice,
        account: safeAccount,
    } = useSafeInfo(isModifying ? (isDeposit ? 'deposit_borrow' : 'repay_withdraw') : 'info')

    const { safeModel: safeState } = useStoreState((state) => state)
    const { singleSafe, liquidationData } = safeState

    const collateral = formatNumber(singleSafe?.collateral || '0')

    const collateralLiquidationData = liquidationData!.collateralLiquidationData[singleSafe?.collateralName as string]

    const totalDebtCalc = returnTotalDebt(
        singleSafe?.debt as string,
        collateralLiquidationData.accumulatedRate,
        true
    ) as string

    const totalDebt = formatWithCommas(totalDebtCalc, 3)

    const totalDebtInUSD = useTokenBalanceInUSD('OD', totalDebtCalc, 2)

    const collateralName = singleSafe!.collateralName
    const collateralUnitPriceUSD = formatNumber(
        safeState.liquidationData!.collateralLiquidationData[collateralName].currentPrice.value
    )
    const collateralInUSD = formatNumber((Number(collateralUnitPriceUSD) * Number(collateral)).toString())

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
                Number(
                    getRatePercentage(
                        singleSafe?.totalAnnualizedStabilityFee ? singleSafe?.totalAnnualizedStabilityFee : '0',
                        4
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
                                    }}
                                    dangerouslySetInnerHTML={{ __html: svg }}
                                ></div>
                            </SVGContainer>
                        </Main>
                    </InnerLeft>
                </Left>

                <Right>
                    <Inner>
                        <StatsGrid>
                            <StatSection>
                                <StatHeader>
                                    <StatTitle>Debt Owed</StatTitle>
                                    <InfoIcon data-tooltip-id="vault-stats" data-tooltip-content={t('debt_owed_tip')}>
                                        <Info size="16" />
                                    </InfoIcon>
                                </StatHeader>
                                <StatValue>{formatWithCommas(totalDebt)} OD</StatValue>
                                <DollarValue>${formatWithCommas(totalDebtInUSD)}</DollarValue>
                            </StatSection>
                            <StatSection>
                                <StatHeader>
                                    <StatTitle>Collateral Deposited</StatTitle>
                                    <InfoIcon
                                        data-tooltip-id="vault-stats"
                                        data-tooltip-content={t('collateral_deposited_tip')}
                                    >
                                        <Info size="16" />
                                    </InfoIcon>
                                </StatHeader>
                                <StatValue>
                                    {formatWithCommas(collateral)} {singleSafe?.collateralName}
                                </StatValue>
                                <DollarValue>${formatWithCommas(collateralInUSD, 2, 2)}</DollarValue>
                            </StatSection>

                            <StatSection>
                                <StatHeader>
                                    <StatTitle>Collateral Ratio</StatTitle>
                                    <InfoIcon
                                        data-tooltip-id="vault-stats"
                                        data-tooltip-content={t('collateral_ratio_tip')}
                                    >
                                        <Info size="16" />
                                    </InfoIcon>
                                </StatHeader>
                                <StatValue>
                                    {singleSafe ? formatWithCommas(singleSafe?.collateralRatio) : '-'}%
                                </StatValue>
                                {modified ? (
                                    <DollarValue className="sideNote">
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
                                    </DollarValue>
                                ) : (
                                    <></>
                                )}
                                <div>
                                    <span
                                        style={{
                                            color: '#FFAF1D',
                                            fontSize: '12px',
                                            fontWeight: '400',
                                            lineHeight: '15.6px',
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
                                            color: '#E75966',
                                            fontSize: '12px',
                                            fontWeight: '400',
                                            lineHeight: '15.6px',
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
                            </StatSection>
                            {safeAccount && (
                                <StatSection>
                                    <StatHeader>
                                        <StatTitle>NFV Owner</StatTitle>
                                        <InfoIcon
                                            data-tooltip-id="vault-stats"
                                            data-tooltip-content={'Owner address for this Non Fungible Vault'}
                                        >
                                            <Info size="16" />
                                        </InfoIcon>
                                    </StatHeader>
                                    <StatValue>
                                        {chainId && account && (
                                            <AccountLink
                                                href={getEtherscanLink(chainId, safeAccount, 'address')}
                                                target="_blank"
                                            >
                                                {returnWalletAddress(safeAccount)} <ExternalLink />
                                            </AccountLink>
                                        )}
                                    </StatValue>
                                </StatSection>
                            )}
                        </StatsGrid>
                        <Side>
                            <SideTitle>{singleSafe?.collateralName} Price (Delayed)</SideTitle>
                            <InfoIcon data-tooltip-id="vault-stats" data-tooltip-content={t('eth_osm_tip')}>
                                <Info size="16" />
                            </InfoIcon>
                            <SideValue>${formatWithCommas(collateralUnitPriceUSD, 2, 2)}</SideValue>
                        </Side>
                        <Side>
                            <SideTitle>OD Redemption Price</SideTitle>
                            <InfoIcon data-tooltip-id="vault-stats" data-tooltip-content={t('hai_red_price_tip')}>
                                <Info size="16" />
                            </InfoIcon>
                            <SideValue>${ODPrice}</SideValue>
                        </Side>

                        <Side>
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
                            <InfoIcon data-tooltip-id="vault-stats" data-tooltip-content={t('liquidation_price_tip')}>
                                <Info size="16" />
                            </InfoIcon>
                            <SideValue>
                                ${singleSafe ? formatWithCommas(singleSafe.liquidationPrice, 2, 2) : '-'}
                            </SideValue>
                        </Side>

                        <Side>
                            <SideTitle>Liquidation Penalty</SideTitle>
                            <InfoIcon data-tooltip-id="vault-stats" data-tooltip-content={t('liquidation_penalty_tip')}>
                                <Info size="16" />
                            </InfoIcon>
                            <SideValue>{`${liquidationPenalty}%`}</SideValue>
                        </Side>

                        <Side>
                            <SideTitle>Stability Fee</SideTitle>
                            <InfoIcon data-tooltip-id="vault-stats" data-tooltip-content={t('stability_fee_tip')}>
                                <Info size="16" />
                            </InfoIcon>
                            <SideValue>{`${
                                singleSafe?.totalAnnualizedStabilityFee
                                    ? getRatePercentage(singleSafe?.totalAnnualizedStabilityFee, 3)
                                    : 0
                            }%`}</SideValue>
                        </Side>

                        <Side>
                            <SideTitle>Annual Redemption Rate</SideTitle>
                            <InfoIcon data-tooltip-id="vault-stats" data-tooltip-content={t('annual_redemption_tip')}>
                                <Info size="16" />
                            </InfoIcon>
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

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    width: 100%;
    white-space: nowrap;

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

const StatHeader = styled.div`
    display: flex;
    align-items: start;
    justify-content: start;
    width: 100%;
    white-space: nowrap;
`

const StatSection = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 98px;
    align-items: start;
    justify-content: start;
    text-align: start;
`

const StatTitle = styled.div`
    font-size: 16px;
    color: #475662;
    margin-right: 10px;
`

const StatValue = styled.div`
    font-size: 18px;
    font-weight: 700;
    margin-top: 5px;
`

const AccountLink = styled.a`
    display: flex;
    gap: 5px;
    color: ${(props) => props.theme.colors.primary};
`

const SVGContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 420px;
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
        justify-items: center;
        align-items: center;
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
    border-radius: 4px;
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
    background: white;
    border-radius: 4px;
    flex: 0 0 45%;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 420px;
    @media (max-width: 767px) {
        flex: 0 0 100%;
        padding: 10px;
    }
`

const Main = styled.div`
    &.mid {
        margin: 30px 0;
    }
`

const DollarValue = styled.div`
    font-size: 12px;
    color: #475662;
`

const Side = styled.div`
    display: flex;
    &:last-child {
        margin-bottom: 0;
    }
    border-bottom: 1px solid rgba(26, 116, 236, 0.3);
    @media (max-width: 767px) {
        padding-top: 4px;
    }
    svg {
        border: 1px solid #00374e;
    }
`

const SideTitle = styled.div`
    color: #475662;
    font-family: 'Open Sans', sans-serif;
    font-size: 16px;
    margin-right: 4px;
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
    font-family: 'Open Sans', sans-serif;
    font-weight: 700;
    color: #475662;
    font-size: 16px;
`

const InfoIcon = styled.div`
    cursor: pointer;
    svg {
        border: none;
        color: #475662;
        margin-top: 4px;
    }
`
