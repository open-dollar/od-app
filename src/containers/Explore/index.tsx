import styled from 'styled-components'
import { useState, useEffect } from 'react'
// @ts-ignore
import { generateSvg } from '@opendollar/svg-generator'
import ExploreTable from './ExploreTable'
import { ethers } from 'ethers'
import { parseRay, formatDataNumber, multiplyRates, transformToAnnualRate } from '~/utils'
import { AllVaults, useVaultSubgraph } from '~/hooks/useVaultSubgraph'
import useAnalyticsData from '~/hooks/useAnalyticsData'
import useGeb from '~/hooks/useGeb'

const Explore: React.FC<any> = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [tableData, setTableData] = useState([])
    const allVaults: AllVaults = useVaultSubgraph()
    const geb = useGeb()
    const analyticsData = useAnalyticsData()

    const parseNumber = (value: string): number => {
        return parseFloat(value.replace(/,/g, ''))
    }

    const getSafeData = async () => {
        setIsLoading(true)
        const tableRows = []

        if (!allVaults?.vaults || !analyticsData?.tokenAnalyticsData) return

        for (const vault of allVaults.vaults) {
            try {
                const estimatedValue = `${(
                    +ethers.utils.formatUnits(vault.collateral) *
                    +ethers.utils.formatUnits(analyticsData.tokenAnalyticsData[vault.collateralType].currentPrice)
                ).toFixed(2)}`

                const stabilityFee = transformToAnnualRate(
                    multiplyRates(
                        analyticsData.tokenAnalyticsData[vault.collateralType].stabilityFee.toString(),
                        analyticsData.redemptionRate?.toString()
                    ) || '0',
                    27
                )

                const cratio = (+estimatedValue / +formatDataNumber(vault.debt)) * 100

                const svgData = {
                    vaultID: vault.id,
                    stabilityFee,
                    debtAmount: formatDataNumber(vault.debt) + ' OD',
                    collateralAmount: formatDataNumber(vault.collateral) + ' ' + vault.collateralType,
                    collateralizationRatio:
                        Number(cratio) >= 0 && !Number.isNaN(Number(cratio)) && cratio !== Infinity
                            ? Number(cratio)
                            : '∞',
                    liqRatio: parseRay(analyticsData.tokenAnalyticsData[vault.collateralType].liquidationCRatio),
                    safetyRatio: parseRay(analyticsData.tokenAnalyticsData[vault.collateralType].safetyCRatio),
                }

                let svg = null
                try {
                    svg = await generateSvg(svgData)
                } catch (e) {
                    console.error(e)
                }

                tableRows.push({
                    id: vault.id,
                    collateral: vault.collateralType,
                    image: svg ? svg : null,
                    collateralAmount: parseNumber(formatDataNumber(vault.collateral)),
                    debtAmount: formatDataNumber(vault.debt) + ' OD',
                })
            } catch (e) {
                console.error(e)
            }
        }
        // @ts-ignore
        setTableData(tableRows)
        setIsLoading(false)
    }

    useEffect(() => {
        getSafeData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allVaults, analyticsData, geb])

    return (
        <Container>
            <Header>
                <Title>Explore Vaults</Title>
            </Header>
            {tableData.length !== 0 && <ExploreTable data={tableData} />}
            {tableData.length === 0 && isLoading && <p>Loading...</p>}
            {tableData.length === 0 && !isLoading && <p>No vaults available</p>}
        </Container>
    )
}

export default Explore

const Container = styled.div`
    max-width: 1362px;
    margin: 80px auto;
    padding: 0 15px;
    @media (max-width: 767px) {
        margin: 50px auto;
        display: flex;
        flex-direction: column;
    }
    color: ${(props) => props.theme.colors.accent};
`

const Title = styled.h2`
    font-size: 34px;
    font-weight: 700;
    font-family: ${(props) => props.theme.family.headers};

    color: ${(props) => props.theme.colors.accent};
    @media (max-width: 767px) {
        font-size: 32px;
    }
`

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    @media (max-width: 767px) {
        flex-direction: column;
        justify-content: left;
    }

    margin-bottom: 40px;
`
