import { useEffect, useMemo, useState } from 'react'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'

import DataCard, { DataCardProps } from './DataCard'
import { DataTable, TableProps } from './DataTable'
import { ContractsTable } from './ContractsTable'
import { fetchAnalyticsData } from '~/utils/virtual/virtualAnalyticsData'
import useGeb from '~/hooks/useGeb'
import { formatDataNumber } from '~/utils'

const Analytics = () => {
    const geb = useGeb()
    const [marketPrice, setMarketPrice] = useState('')
    const [redemptionPrice, setRedemptionPrice] = useState('')
    const [colRows, setColRows] = useState<string[][]>([])

    // temporary collaterals data
    const colData: TableProps = {
        title: 'Collaterals',
        colums: ['Collateral', 'OSM Price', 'Next OSM Price', 'Total Debt' /*  'Total Locked', 'Total Locked ($)' */],
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

    const contractsData: TableProps = {
        title: 'Contracts',
        colums: ['Contract', 'Address'],
        rows: contracts,
    }

    // temporary
    const marketPriceData: DataCardProps = {
        image: 'HAI',
        title: 'Market Price',
        value: marketPrice,
        priceInUsd: true,
        description:
            `Time-weighted average HAI market price derived from UniV3 HAI/WETH pool and Chainlink WETH/USD feed.`,
    }
    const redemptionPriceData: DataCardProps = {
        image: 'HAI',
        title: 'Redemption Price',
        value: redemptionPrice,
        priceInUsd: true,
        description:
            `HAI's "moving peg". It's the price at which HAI is minted or repaid inside the protocol. The HAI market price is expected to fluctuate around the redemption price.`,
    }
    const data = [marketPriceData, redemptionPriceData]

    useEffect(() => {
        if (geb) {
            fetchAnalyticsData(geb).then((result) => {
                // TODO: check this
                setMarketPrice(formatDataNumber(result.marketPrice, 18, 2, true))
                setRedemptionPrice(formatDataNumber(result.redemptionPrice, 27, 2, true))

                const colRows = Object.fromEntries(
                    Object.entries(result?.tokenAnalyticsData).map(([key, value], index) => [
                        key,
                        [
                            key, // Symbol
                            formatDataNumber(value?.currentPrice?.toString() || '0', 18, 2, true), // Current price
                            formatDataNumber(value?.nextPrice?.toString() || '0', 18, 2, true), // Next price
                            formatDataNumber(value?.debtAmount?.toString() || '0', 18, 2, true, true), // Debt Amount
                            // (100 + index).toString(), // Amount locked
                            // (100 + index).toString(), // Amount locked in USD
                        ],
                    ])
                )

                setColRows(Object.values(colRows) as string[][])
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
                        priceInUsd={val?.priceInUsd}
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
