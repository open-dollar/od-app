import { useEffect, useMemo, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import styled from 'styled-components'

import DataCard, { DataCardProps } from './DataCard'
import { DataTable, TableProps } from './DataTable'
import { ContractsTable } from './ContractsTable'
import { AddressLink } from '~/components/AddressLink'
import { fetchAnalyticsData } from '@opendollar/sdk/lib/virtual/virtualAnalyticsData'

import { contractsDescriptions } from '~/utils/contractsDescription'
import {
    formatDataNumber,
    multiplyRates,
    multiplyWad,
    transformToWadPercentage,
    transformToAnnualRate,
    transformToEightHourlyRate,
} from '~/utils'
import useGeb from '~/hooks/useGeb'
import { fetchPoolData } from '@opendollar/sdk'
import { BigNumber, ethers } from 'ethers'

interface AnalyticsStateProps {
    erc20Supply: string
    globalDebt: string
    globalDebtUtilization: string
    globalDebtCeiling: string
    surplusInTreasury: string
    marketPrice: string
    redemptionPrice: string
    totalLiquidity: string
    annualRate: string
    eightRate: string
    pRate: string
    iRate: string
    colRows: (string | JSX.Element)[][]
    totalVaults: string
    totalCollateralSum: string
}

const Analytics = () => {
    const geb = useGeb()
    const { chainId } = useWeb3React()
    const [state, setState] = useState<AnalyticsStateProps>({
        erc20Supply: '',
        globalDebt: '',
        globalDebtUtilization: '',
        globalDebtCeiling: '',
        surplusInTreasury: '',
        marketPrice: '',
        redemptionPrice: '',
        totalLiquidity: '',
        annualRate: '',
        eightRate: '',
        pRate: '',
        iRate: '',
        colRows: [],
        totalVaults: '',
        totalCollateralSum: '',
    })

    const {
        erc20Supply,
        globalDebt,
        globalDebtCeiling,
        globalDebtUtilization,
        marketPrice,
        redemptionPrice,
        totalLiquidity,
        annualRate,
        eightRate,
        pRate,
        iRate,
        colRows,
        totalVaults,
        totalCollateralSum,
    } = state

    const colData: TableProps = {
        title: 'Collaterals',
        colums: [
            { name: 'Collateral' },
            { name: 'ERC-20', description: 'Address of the ERC20 collateral token.' },
            { name: 'Oracle', description: 'Delayed oracle address for the collateral.' },
            {
                name: 'Delayed Price',
                description:
                    'System price of the collateral, it is delayed from spot price, and updates every period to "Next Price".',
            },
            {
                name: 'Next Price',
                description:
                    'Next system price of the collateral, this value is already quoted, and will impact the system on the next price update.',
            },
            { name: 'Stability Fee', description: 'Annual interest rate paid by Safe owners on their debt.' },
            {
                name: 'Borrow Rate',
                description:
                    'Total annual interest paid by Safe owners on their debt, includes "Stability Fee" and "Annual Redemption Rate".',
            },
            { name: 'Total Debt', description: 'Total amount of OD minted per collateral.' },
            {
                name: 'Debt Utilization',
                description: 'Percentage of the minted OD over the total amount of mintable OD per collateral.',
            },
            {
                name: 'Total Locked',
                description: 'Total amount of collateral tokens deposited in Safes backing OD debt.',
            },
            {
                name: 'Total Locked ($)',
                description:
                    'Total value amount (in USD) for the deposited collateral tokens at system "Delayed Price".',
            },
            {
                name: 'Collateral Ratio',
                description:
                    'Comparison between the value of the minted OD (in USD) vs the value of the locked collateral (in USD).',
            },
        ],
        rows: colRows,
    }

    const contracts = useMemo(() => {
        if (geb) {
            const contracts: { [k: string]: string } = Object.fromEntries(
                Object.entries(geb?.contracts).map(([key, value], index) => [key, value.address])
            )

            return (
                Object.entries(contracts)
                    // add description to contracts.
                    /* 
                        If you want to use contract addresses instead of contract names change the next line to:
                        ```
                        .map((contract: string[]) => [...contract, contractsDescriptions[contract[1]]])
                        ```
                        and update `contractsDescriptions.ts` accordingly
                    */
                    .map((contract: string[]) => [...contract, contractsDescriptions[contract[0]]])
                    // filter contracts without address
                    .filter(([, value]) => !!value)
            )
        }
        return []
    }, [geb])

    const totalCollateralLocked = {
        image: 'ETH',
        title: 'Total Collateral Locked',
        value: totalCollateralSum,
        description: 'Mock dada for Total Collateral Locked',
    }

    const vaultNFTs = {
        image: 'NFTS',
        title: 'Vault NFTs',
        value: totalVaults,
        description: 'Vault NFTs',
    }

    const annualStabilityFee = {
        title: 'Annual Stability fee',
        value: '2.0%',
        description: 'Mock dada for Annual Stability fee',
    }

    const circulation = { title: 'circulation', value: erc20Supply, description: 'Circulation' }

    const liquidityUniswap = {
        title: 'OD/ETH Liquidity in Camelot',
        value: totalLiquidity,
        description: 'Total OD/ETH Liquidity in Camelot',
    }

    const contractsData = {
        title: 'Contracts',
        colums: ['Contract', 'Address', 'Description'],
        rows: contracts,
    }
    const marketPriceData: DataCardProps = {
        title: 'Market Price OD',
        value: marketPrice,
        description:
            'Time-weighted average OD market price derived from UniV3 OD/WETH pool and Chainlink WETH/USD feed.',
    }
    const redemptionPriceData: DataCardProps = {
        image: 'OD',
        title: 'redemption Price OD',
        value: redemptionPrice,
        description:
            'OD\'s "moving peg". It\'s the price at which OD is minted or repaid inside the protocol. The OD market price is expected to fluctuate around the redemption price.',
    }
    const globalDebtData: DataCardProps = {
        title: 'Global Debt',
        value: globalDebt,
        description: 'Total OD minted in the system.',
        children: (
            <RateContainer>
                <p>
                    <BoldText>ERC20 Supply:</BoldText> {erc20Supply}
                </p>
            </RateContainer>
        ),
    }
    const globalDebtUtilizationData: DataCardProps = {
        title: 'Global Debt Utilization',
        value: globalDebtUtilization,
        description: 'Total OD minted in the system.',
        children: (
            <RateContainer>
                <p>
                    <BoldText>Debt Ceiling:</BoldText> {globalDebtCeiling}
                </p>
            </RateContainer>
        ),
    }
    const annualRedemptionRate: DataCardProps = {
        title: 'Annual Redemption Rate',
        value: annualRate,
        description:
            'Annualized rate of change of the redemption price. The rate is set by the PI controller and depends on the deviation between the redemption price and the OD TWAP price. If the rate is positive, the redemption price will increase. If the rate is negative, the redemption price will decrease. The rate is generated by the combinated effect of two terms: pRate and iRate.',
        children: (
            <RateContainer>
                <p>
                    <BoldText>pRate:</BoldText> {pRate}
                </p>
                <p>
                    <BoldText>iRate:</BoldText> {iRate}
                </p>
            </RateContainer>
        ),
    }
    const eightHourlyRedemptionRate: DataCardProps = {
        title: '8-Hourly Redemption Rate',
        value: eightRate,
        description: 'Redemption rate over an 8h period.',
    }

    const analiticsData: DataCardProps[] = [
        totalCollateralLocked,
        // outstandingOd,
        vaultNFTs,
    ]

    const systemRatesData = [annualStabilityFee, annualRedemptionRate, eightHourlyRedemptionRate]

    const systemInfoData: DataCardProps[] = [
        circulation,
        // feesPendingAuction,
        // totalFeesEarned,
        globalDebtUtilizationData,
        globalDebtData,
    ]

    const pricesData: DataCardProps[] = [
        marketPriceData, // check for market price OD not OD
        redemptionPriceData,
        liquidityUniswap,
        // marketPriceODG,
    ]

    useEffect(() => {
        async function fetchData() {
            if (geb) {
                try {
                    const [poolData, analyticsData] = await Promise.all([fetchPoolData(geb), fetchAnalyticsData(geb)])
                    let totalLockedValue = BigNumber.from('0')
                    const formattedLiquidity = formatDataNumber(
                        ethers.utils
                            .parseEther(BigNumber.from(Math.floor(Number(poolData?.totalLiquidityUSD))).toString())
                            .toString(),
                        18,
                        0,
                        true
                    ).toString()

                    const colRows = Object.fromEntries(
                        Object.entries(analyticsData?.tokenAnalyticsData).map(([key, value]) => {
                            const lockedAmountInUsd = multiplyWad(
                                value?.lockedAmount?.toString(),
                                value?.currentPrice?.toString()
                            )
                            totalLockedValue = totalLockedValue.add(lockedAmountInUsd)
                            return [
                                key,
                                [
                                    key,
                                    <AddressLink address={geb.tokenList[key].address} chainId={chainId || 420} />,
                                    <AddressLink address={value?.delayedOracle} chainId={chainId || 420} />,
                                    formatDataNumber(value?.currentPrice?.toString() || '0', 18, 2, true),
                                    formatDataNumber(value?.nextPrice?.toString() || '0', 18, 2, true),
                                    transformToAnnualRate(value?.stabilityFee?.toString() || '0', 27),
                                    transformToAnnualRate(
                                        multiplyRates(
                                            value?.stabilityFee?.toString(),
                                            analyticsData.redemptionRate?.toString()
                                        ) || '0',
                                        27
                                    ),
                                    formatDataNumber(value?.debtAmount?.toString() || '0', 18, 2, true, true),
                                    transformToWadPercentage(
                                        value?.debtAmount?.toString(),
                                        value?.debtCeiling?.toString()
                                    ),
                                    formatDataNumber(value?.lockedAmount?.toString() || '0', 18, 2, false, true) +
                                        ' ' +
                                        key,
                                    formatDataNumber(
                                        multiplyWad(value?.lockedAmount?.toString(), value?.currentPrice?.toString()) ||
                                            '0',
                                        18,
                                        2,
                                        true,
                                        true
                                    ),
                                    transformToWadPercentage(
                                        multiplyWad(
                                            value?.debtAmount?.toString(),
                                            analyticsData?.redemptionPrice?.toString()
                                        ),
                                        multiplyWad(value?.lockedAmount?.toString(), value?.currentPrice?.toString())
                                    ),
                                ],
                            ]
                        })
                    )

                    setState((prevState) => ({
                        ...prevState,
                        erc20Supply: formatDataNumber(analyticsData.erc20Supply, 18, 0, true),
                        globalDebt: formatDataNumber(analyticsData.globalDebt, 18, 0, true),
                        globalDebtCeiling: formatDataNumber(analyticsData.globalDebtCeiling, 18, 0, true),
                        globalDebtUtilization: transformToWadPercentage(
                            analyticsData.globalDebt,
                            analyticsData.globalDebtCeiling
                        ),
                        surplusInTreasury: formatDataNumber(analyticsData.surplusInTreasury, 18, 0, true),
                        marketPrice: formatDataNumber(analyticsData.marketPrice, 18, 3, true, undefined, 4),
                        redemptionPrice: formatDataNumber(analyticsData.redemptionPrice, 18, 3, true, undefined, 4),
                        totalLiquidity: formattedLiquidity,
                        annualRate: transformToAnnualRate(analyticsData.redemptionRate, 27, 3),
                        eightRate: transformToEightHourlyRate(analyticsData.redemptionRate, 27, 3),
                        pRate: transformToAnnualRate(analyticsData.redemptionRatePTerm, 27),
                        iRate: transformToAnnualRate(analyticsData.redemptionRateITerm, 27),
                        colRows: Object.values(colRows),
                        totalVaults: analyticsData.totalVaults,
                        totalCollateralSum: formatDataNumber(totalLockedValue.toString(), 18, 2, true, true),
                    }))
                } catch (error) {
                    console.error('Error fetching data:', error)
                }
            }
        }

        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [geb])

    return (
        <Container>
            <Section>
                <Title>Stats</Title>
                <AnaliticsTop>
                    {analiticsData &&
                        analiticsData?.map((val, index) => (
                            <DataCard
                                key={val.title + index}
                                title={val.title}
                                value={val.value}
                                description={val.description}
                            />
                        ))}
                </AnaliticsTop>
                <AnaliticsMiddle>
                    {systemRatesData && (
                        <LeftColumn>
                            <SubTitle>System Rates</SubTitle>
                            <LeftTopRow>
                                <DataCard
                                    title={systemRatesData[0].title}
                                    value={systemRatesData[0].value}
                                    description={systemRatesData[0].description}
                                />
                            </LeftTopRow>
                            <FlexMultipleRow>
                                <DataCard
                                    title={systemRatesData[1].title}
                                    value={systemRatesData[1].value}
                                    description={systemRatesData[1].description}
                                />
                                <DataCard
                                    title={systemRatesData[2].title}
                                    value={systemRatesData[2].value}
                                    description={systemRatesData[2].description}
                                />
                            </FlexMultipleRow>
                        </LeftColumn>
                    )}
                    {systemInfoData && (
                        <RightColumn>
                            <SubTitle>System Info</SubTitle>
                            <FlexMultipleRow>
                                {systemInfoData.slice(0, 2).map((val, index) => {
                                    return (
                                        <DataCard
                                            key={val.title + index}
                                            title={val.title}
                                            value={val.value}
                                            description={val.description}
                                        />
                                    )
                                })}
                            </FlexMultipleRow>
                            <FlexMultipleRow>
                                {systemInfoData.slice(2).map((val, index) => {
                                    return (
                                        <DataCard
                                            key={val.title + index}
                                            title={val.title}
                                            value={val.value}
                                            description={val.description}
                                        />
                                    )
                                })}
                            </FlexMultipleRow>
                        </RightColumn>
                    )}
                </AnaliticsMiddle>
                <SubTitle>Prices</SubTitle>
                <AnaliticsBottom>
                    {pricesData.map((val, index) => (
                        <DataCard
                            key={val.title + index}
                            title={val.title}
                            value={val.value}
                            description={val.description}
                        />
                    ))}
                </AnaliticsBottom>
                <TooltipWrapper>
                    <ReactTooltip
                        variant="light"
                        data-effect="solid"
                        id="analitics"
                        style={{ maxWidth: '300px' }}
                        classNameArrow="tooltip-arrow"
                    />
                </TooltipWrapper>
            </Section>
            <Section>
                <Title>Collaterals</Title>
                <DataTable title={colData.title} colums={colData.colums} rows={colData.rows} />
                <TooltipWrapper>
                    <ReactTooltip
                        variant="light"
                        data-effect="solid"
                        id="collaterals-table"
                        style={{ maxWidth: '300px' }}
                        classNameArrow="tooltip-arrow"
                    />
                </TooltipWrapper>
            </Section>

            <Section>
                <Title>Contracts</Title>
                {/* Contracts Table */}
                <ContractsTable title={contractsData.title} colums={contractsData.colums} rows={contractsData.rows} />
            </Section>
        </Container>
    )
}

export default Analytics

const TooltipWrapper = styled.div`
    & .tooltip-arrow {
        background: inherit !important;
    }
`

const Container = styled.div`
    max-width: 1380px;
    margin: 80px auto;
    padding: 0 15px;
    @media (max-width: 767px) {
        margin: 50px auto;
    }
`

const Section = styled.div`
    margin-bottom: 64px;
`

const AnaliticsTop = styled.div`
    display: flex;
    gap: 24px;
    margin-bottom: 64px;

    & div {
        height: 231px;
    }

    ${({ theme }) => theme.mediaWidth.upToSmall`
        flex-wrap: wrap;
    `}
`

const AnaliticsMiddle = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 64px;

    & div {
        flex: 1;
    }

    @media (max-width: 1390px) {
        display: block;
    }
`

const AnaliticsBottom = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 24px;

    ${({ theme }) => theme.mediaWidth.upToSmall`
        flex-wrap: wrap;
    `}
`

const LeftColumn = styled.div``

const RightColumn = styled.div``

const LeftTopRow = styled.div`
    margin-bottom: 24px;
`

const FlexMultipleRow = styled.div`
    display: flex;
    gap: 24px;
    margin-bottom: 24px;

    ${({ theme }) => theme.mediaWidth.upToSmall`
        display: block;

        & div {
            margin-bottom: 24px;
        }
    `}
`

const Title = styled.h2`
    font-size: 34px;
    font-weight: 700;
    margin-bottom: 40px;
    color: ${(props) => props.theme.colors.accent};
`

const SubTitle = styled.h3`
    font-size: 34px;
    font-weight: 700;
    color: ${(props) => props.theme.colors.accent};
    margin-bottom: 16px;
`

// Rate styles
const RateContainer = styled.div`
    margin-top: 10px;
`

const BoldText = styled.span`
    font-weight: 600;
`
