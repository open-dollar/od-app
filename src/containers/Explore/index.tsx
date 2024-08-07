import styled from 'styled-components'
import { useState, useEffect } from 'react'
import ExploreTable from './ExploreTable'
import { ethers } from 'ethers'
import { parseRay, formatDataNumber, calculateRiskStatusText, ratioChecker, parseFormattedNumber } from '~/utils'
import { AllVaults, useVaultSubgraph } from '~/hooks/useVaultSubgraph'
import useAnalyticsData from '~/hooks/useAnalyticsData'
import useGeb from '~/hooks/useGeb'
import { generateSVGRing } from '~/utils/generateSVGRing'

const Explore: React.FC<any> = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [tableData, setTableData] = useState([])
    const allVaults: AllVaults = useVaultSubgraph()
    const geb = useGeb()
    const analyticsData = useAnalyticsData()

    const parseNumber = (value: string): number => {
        return parseFloat(value.replace(/,/g, ''))
    }

    const getSafeData = () => {
        setIsLoading(true)
        const tableRows = []

        if (!allVaults?.vaults || !analyticsData?.tokenAnalyticsData) return

        for (const vault of allVaults.vaults) {
            try {
                const estimatedValue = `${(
                    +ethers.utils.formatUnits(vault.collateral) *
                    +ethers.utils.formatUnits(analyticsData.tokenAnalyticsData[vault.collateralType].currentPrice)
                ).toFixed(2)}`

                const formattedDebt = parseFormattedNumber(formatDataNumber(vault.debt))
                let cratio = 0
                if (formattedDebt !== 0) {
                    cratio = (+estimatedValue / formattedDebt) * 100
                }

                let correctCollateralizationRatio
                if (Number(cratio) > 0) {
                    correctCollateralizationRatio = Number(cratio)
                } else if (Number(cratio) === 0 && parseFormattedNumber(formatDataNumber(vault.collateral)) > 0) {
                    correctCollateralizationRatio = '∞'
                } else if (Number(cratio) === 0 && parseFormattedNumber(formatDataNumber(vault.collateral)) === 0) {
                    correctCollateralizationRatio = 0
                } else {
                    correctCollateralizationRatio = 0
                }

                const svgData = {
                    collateralizationRatio: correctCollateralizationRatio,
                    liqRatio: Number(
                        parseRay(analyticsData.tokenAnalyticsData[vault.collateralType].liquidationCRatio)
                    ),
                    safetyRatio: Number(parseRay(analyticsData.tokenAnalyticsData[vault.collateralType].safetyCRatio)),
                }

                const riskStatus = calculateRiskStatusText(
                    ratioChecker(
                        Number(cratio),
                        Number(parseRay(analyticsData.tokenAnalyticsData[vault.collateralType].liquidationCRatio)),
                        Number(parseRay(analyticsData.tokenAnalyticsData[vault.collateralType].safetyCRatio))
                    )
                )

                let svg = null
                try {
                    svg = generateSVGRing(svgData, 210, 420, `svg-${vault.id}`)
                } catch (e) {
                    console.error(e)
                }

                tableRows.push({
                    id: vault.id,
                    collateral: vault.collateralType,
                    image: svg ? svg : null,
                    collateralAmount: parseNumber(formatDataNumber(vault.collateral)),
                    debtAmount: formatDataNumber(vault.debt) + ' OD',
                    riskStatus: riskStatus,
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
