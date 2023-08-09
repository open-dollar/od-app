import { useEffect, useMemo, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'

import DataCard, { DataCardProps } from './DataCard'
import { DataTable, TableProps } from './DataTable'
import { ContractsTable } from './ContractsTable'
import { AddressLink } from '~/components/AddressLink'
import { fetchAnalyticsData } from '~/utils/virtual/virtualAnalyticsData'
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

interface AnalyticsStateProps {
    erc20Supply: string
    globalDebt: string
    globalDebtUtilization: string
    globalDebtCeiling: string
    surplusInTreasury: string
    marketPrice: string
    redemptionPrice: string
    annualRate: string
    eightRate: string
    pRate: string
    iRate: string
    colRows: (string | JSX.Element)[][]
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
        annualRate: '',
        eightRate: '',
        pRate: '',
        iRate: '',
        colRows: [],
    })

    const {
        erc20Supply,
        globalDebt,
        globalDebtCeiling,
        globalDebtUtilization,
        surplusInTreasury,
        marketPrice,
        redemptionPrice,
        annualRate,
        eightRate,
        pRate,
        iRate,
        colRows,
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
            { name: 'Total Debt', description: 'Total amount of HAI minted per collateral.' },
            {
                name: 'Debt Utilization',
                description: 'Percentage of the minted HAI over the total amount of mintable HAI per collateral.',
            },
            {
                name: 'Total Locked',
                description:
                    'Total amount of collateral tokens deposited in Safes backing HAI debt. TODO: replace mocked values',
            },
            {
                name: 'Total Locked ($)',
                description:
                    'Total value amount (in USD) for the deposited collateral tokens at system "Delayed Price".',
            },
            {
                name: 'Collateral Ratio',
                description:
                    'Comparison between the value of the minted HAI (in USD) vs the value of the locked collateral (in USD).',
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

    const contractsData = {
        title: 'Contracts',
        colums: ['Contract', 'Address', 'Description'],
        rows: contracts,
    }
    const marketPriceData: DataCardProps = {
        image: 'HAI',
        title: 'Market Price',
        value: marketPrice,
        description:
            'Time-weighted average HAI market price derived from UniV3 HAI/WETH pool and Chainlink WETH/USD feed.',
    }
    const redemptionPriceData: DataCardProps = {
        image: 'HAI',
        title: 'Redemption Price',
        value: redemptionPrice,
        description:
            'HAI\'s "moving peg". It\'s the price at which HAI is minted or repaid inside the protocol. The HAI market price is expected to fluctuate around the redemption price.',
    }
    const globalDebtData: DataCardProps = {
        title: 'Global Debt',
        value: globalDebt,
        description: 'Total HAI minted in the system.',
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
        description: 'Total HAI minted in the system.',
        children: (
            <RateContainer>
                <p>
                    <BoldText>Debt Ceiling:</BoldText> {globalDebtCeiling}
                </p>
            </RateContainer>
        ),
    }
    const surplusInTreasuryData: DataCardProps = {
        title: 'Surplus in Treasury',
        value: surplusInTreasury,
        description:
            "Total HAI accrued by the system's stability fees. It's stored in the Stability Fee Treasury accountance",
    }
    const annualRedemptionRate: DataCardProps = {
        title: 'Annual Redemption Rate',
        value: annualRate,
        description:
            'Annualized rate of change of the redemption price. The rate is set by the PI controller and depends on the deviation between the redemption price and the HAI TWAP price. If the rate is positive, the redemption price will increase. If the rate is negative, the redemption price will decrease. The rate is generated by the combinated effect of two terms: pRate and iRate.',
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
        title: '8-Hour Redemption Rate',
        value: eightRate,
        description: 'Redemption rate over an 8h period.',
    }
    const data = [
        marketPriceData,
        redemptionPriceData,
        globalDebtData,
        globalDebtUtilizationData,
        surplusInTreasuryData,
        annualRedemptionRate,
        eightHourlyRedemptionRate,
    ]

    useEffect(() => {
        if (geb) {
            fetchAnalyticsData(geb).then((result) => {
                const colRows = Object.fromEntries(
                    Object.entries(result?.tokenAnalyticsData).map(([key, value], index) => [
                        key,
                        [
                            key, // Symbol
                            <AddressLink address={geb.tokenList[key].address} chainId={chainId || 420} />, // ERC20 address + link to etherscan
                            <AddressLink address={value?.delayedOracle} chainId={chainId || 420} />, // ERC20 address + link to etherscan
                            formatDataNumber(value?.currentPrice?.toString() || '0', 18, 2, true), // Current price
                            formatDataNumber(value?.nextPrice?.toString() || '0', 18, 2, true), // Next price
                            transformToAnnualRate(value?.stabilityFee?.toString() || '0', 27), // Stability fee
                            transformToAnnualRate(
                                multiplyRates(value?.stabilityFee?.toString(), result.redemptionRate?.toString()) ||
                                    '0',
                                27
                            ), // Borrow rate
                            formatDataNumber(value?.debtAmount?.toString() || '0', 18, 2, true, true), // Debt Amount
                            transformToWadPercentage(value?.debtAmount?.toString(), value?.debtCeiling?.toString()), // Debt Utilization
                            formatDataNumber(value?.lockedAmount?.toString() || '0', 18, 2, false, true), // Amount locked
                            formatDataNumber(
                                multiplyWad(value?.lockedAmount?.toString(), value?.currentPrice?.toString()) || '0',
                                18,
                                2,
                                true,
                                true
                            ), // Amount locked in USD
                            transformToWadPercentage(
                                multiplyWad(value?.debtAmount?.toString(), result?.redemptionPrice?.toString()),
                                multiplyWad(value?.lockedAmount?.toString(), value?.currentPrice?.toString())
                            ), // Debt amount / locked amount in USD
                        ],
                    ])
                )

                setState({
                    ...state,
                    erc20Supply: formatDataNumber(result.erc20Supply, 18, 0, true),
                    globalDebt: formatDataNumber(result.globalDebt, 18, 0, true),
                    globalDebtCeiling: formatDataNumber(result.globalDebtCeiling, 18, 0, true),
                    globalDebtUtilization: transformToWadPercentage(result.globalDebt, result.globalDebtCeiling),
                    surplusInTreasury: formatDataNumber(result.surplusInTreasury, 18, 0, true),
                    marketPrice: formatDataNumber(result.marketPrice, 18, 3, true),
                    redemptionPrice: formatDataNumber(result.redemptionPrice, 18, 3, true),
                    annualRate: transformToAnnualRate(result.redemptionRate, 27),
                    eightRate: transformToEightHourlyRate(result.redemptionRate, 27),
                    pRate: transformToAnnualRate(result.redemptionRatePTerm, 27),
                    iRate: transformToAnnualRate(result.redemptionRateITerm, 27),
                    colRows: Object.values(colRows),
                })
            })
        }
    }, [geb])

    return (
        <Container>
            {/* Page title */}
            <Content>
                <Title>Protocol Analytics</Title>
            </Content>

            {/* First Section */}
            <DataContainer>
                {data.map((val, index) => (
                    <DataCard
                        key={val.title + index}
                        image={val.image}
                        title={val.title}
                        value={val.value}
                        description={val.description}
                        children={val.children}
                    />
                ))}
                <ReactTooltip multiline type="light" data-effect="solid" />
            </DataContainer>

            <DataContainer>
                {/* Collateral Table */}
                <DataTable title={colData.title} colums={colData.colums} rows={colData.rows} />

                {/* Contracts Table */}
                <ContractsTable title={contractsData.title} colums={contractsData.colums} rows={contractsData.rows} />
            </DataContainer>
        </Container>
    )
}

export default Analytics

const Container = styled.div`
    max-width: 1200px;
    margin: 80px auto;
    padding: 0 15px;
    @media (max-width: 767px) {
        margin: 50px auto;
    }
`

const Title = styled.div`
    font-size: ${(props) => props.theme.font.medium};
    font-weight: 600;
    min-width: 180px;
`

const DataContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
`
const Content = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 60px;
`

// Rate styles
const RateContainer = styled.div`
    margin-top: 10px;
`

const BoldText = styled.span`
    font-weight: 600;
`
