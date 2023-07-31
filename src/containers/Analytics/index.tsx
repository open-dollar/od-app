import { useEffect, useMemo, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { useWeb3React } from '@web3-react/core'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'

import DataCard, { DataCardProps } from './DataCard'
import { DataTable, TableProps } from './DataTable'
import { ContractsTable } from './ContractsTable'
import { AddressLink } from '~/components/AddressLink'
import { fetchAnalyticsData } from '~/utils/virtual/virtualAnalyticsData'
import { formatDataNumber, transformToAnualRate, transformToEightHourlyRate } from '~/utils'
import useGeb from '~/hooks/useGeb'

interface AnalyticsStateProps {
    marketPrice: string
    redemptionPrice: string
    anualRate: string
    eightRate: string
    pRate: string
    iRate: string
    colRows: (string | JSX.Element)[][]
}

const Analytics = () => {
    const geb = useGeb()
    const { chainId } = useWeb3React()
    const [state, setState] = useState<AnalyticsStateProps>({
        marketPrice: '',
        redemptionPrice: '',
        anualRate: '',
        eightRate: '',
        pRate: '',
        iRate: '',
        colRows: [],
    })

    const { marketPrice, redemptionPrice, anualRate, eightRate, pRate, iRate, colRows } = state

    const colData: TableProps = {
        title: 'Collaterals',
        colums: [
            'Collateral',
            'ERC-20',
            /* 'Oracle', */ 'Delayed Price',
            'Next Price',
            'Total Debt',
            /* 'Total Locked', 'Total Locked ($)', */ 'Stability Fee',
            'Borrow Rate',
        ],
        rows: colRows,
    }

    const contracts = useMemo(() => {
        if (geb) {
            const contracts: { [k: string]: string } = Object.fromEntries(
                Object.entries(geb?.contracts).map(([key, value]) => [key, value.address])
            )

            return Object.entries(contracts).filter(([, value]) => !!value)
        }
        return []
    }, [geb])

    const contractsData = {
        title: 'Contracts',
        colums: ['Contract', 'Address'],
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
    const anualRedemptionRate: DataCardProps = {
        title: 'Anual Redemption Rate',
        value: anualRate,
        // description: 'lorem ipsum',
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
        // description: 'lorem ipsum',
    }
    const data = [marketPriceData, redemptionPriceData, anualRedemptionRate, eightHourlyRedemptionRate]

    useEffect(() => {
        if (geb) {
            fetchAnalyticsData(geb).then((result) => {
                const colRows = Object.fromEntries(
                    Object.entries(result?.tokenAnalyticsData).map(([key, value], index) => [
                        key,
                        [
                            key, // Symbol
                            <AddressLink address={geb.tokenList[key].address} chainId={chainId || 420} />, // ERC20 address + link to etherscan
                            formatDataNumber(value?.currentPrice?.toString() || '0', 18, 2, true), // Current price
                            formatDataNumber(value?.nextPrice?.toString() || '0', 18, 2, true), // Next price
                            formatDataNumber(value?.debtAmount?.toString() || '0', 18, 2, true, true), // Debt Amount
                            // formatDataNumber(value?.lockedAmount?.toString() || '0', 18, 2, false, true), // Amount locked
                            transformToAnualRate(value?.stabilityFee?.toString() || '0', 27), // Stability fee
                            // TODO: improve calculation
                            transformToAnualRate(
                                BigNumber.from(value?.stabilityFee)
                                    .mul(BigNumber.from(result.redemptionRate))
                                    .div(BigNumber.from('1000000000000000000000000000'))
                                    ?.toString() || '0',
                                27
                            ), // Borrow rate
                            // (100 + index).toString(), // Amount locked in USD
                        ],
                    ])
                )

                setState({
                    ...state,
                    marketPrice: formatDataNumber(result.marketPrice, 18, 3, true),
                    redemptionPrice: formatDataNumber(result.redemptionPrice, 27, 3, true),
                    anualRate: transformToAnualRate(result.redemptionRate, 27),
                    eightRate: transformToEightHourlyRate(result.redemptionRate, 27),
                    pRate: transformToAnualRate(result.redemptionRatePTerm, 27),
                    iRate: transformToAnualRate(result.redemptionRateITerm, 27),
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
