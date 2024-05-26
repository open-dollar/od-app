import { ExternalLink } from 'react-feather'
import styled from 'styled-components'
import Button from '~/components/Button'
import Table from './Table'
import { useOpenSeaListings } from '~/hooks/useOpenSeaListings'
import useGeb from '~/hooks/useGeb'
// @ts-ignore
import { generateSvg } from '@opendollar/svg-generator'
import * as React from 'react'
import { useVaultSubgraph, VaultDetails } from '~/hooks/useVaultSubgraph'

type Listing = {
    id: string
    assetName: string
    price: string
    estimatedValue: string
    saleEnd: string
    saleStart: string
    image?: string | any
}

const Marketplace = () => {
    const [isLoading, setIsLoading] = React.useState<boolean>(true)
    const [tableData, setTableData] = React.useState<Listing[]>([])

    const listings = useOpenSeaListings()
    const allVaults = useVaultSubgraph()

    const geb = useGeb()

    const getSafeData = async () => {
        if (!geb) return
        if (!allVaults?.vaults) return
        console.log('allVaults', allVaults)
        setIsLoading(true)
        const tableRows: Listing[] = []
        for (const listing of listings) {
            try {
                const index = allVaults.vaults.findIndex((vault: VaultDetails) => vault.id === listing.id)
                const vault = allVaults.vaults[index] as VaultDetails
                if (!vault) throw new Error('Listed vault not found in allVaults query')
                // TODO: Get protocol liqudation data
                // const userSafes = await gebManager.getUserSafesRpc({
                //     address: ownerAddress,
                //     geb,
                //     tokensData: geb.tokenList,
                // })

                // const { collateralLiquidationData } = userSafes
                // const constructedLiquidationData: ILiquidationData = {
                //     currentRedemptionPrice: userSafes.systemState.currentRedemptionPrice.value,
                //     currentRedemptionRate: userSafes.systemState.currentRedemptionRate.annualizedRate,
                //     globalDebt: userSafes.systemState.globalDebt,
                //     perSafeDebtCeiling: userSafes.systemState.perSafeDebtCeiling,
                //     globalDebtCeiling: userSafes.systemState.globalDebtCeiling,
                //     collateralLiquidationData: collateralLiquidationData,
                // }
                // safeActions.setLiquidationData(constructedLiquidationData)

                // const svgData = {
                //     vaultID: singleSafe?.id,
                //     stabilityFee:
                //         Number(
                //             getRatePercentage(
                //                 singleSafe?.totalAnnualizedStabilityFee
                //                     ? singleSafe?.totalAnnualizedStabilityFee
                //                     : '0',
                //                 4
                //             )
                //         ).toString() + '%',
                //     debtAmount: formatWithCommas(singleSafe.totalDebt) + ' OD',
                //     collateralAmount: formatWithCommas(singleSafe.collateral) + ' ' + singleSafe.collateralName,
                //     collateralizationRatio:
                //         singleSafe?.collateralRatio === '∞' ? '∞' : Number(singleSafe?.collateralRatio),
                //     safetyRatio: singleSafe?.safetyCRatio,
                //     liqRatio: singleSafe?.liquidationCRatio,
                // }

                let svg = null
                // try {
                //     svg = await generateSvg(svgData)
                // } catch (e) {
                //     console.error(e)
                // }

                // TODO: calculate estimated value
                const estimatedValue = '0' // toUSD(vault.collateral,vault.collateralType) - vault.debt * redemptionPrice

                const TableListing: Listing = {
                    id: listing.id,
                    assetName: vault.collateralType,
                    price: listing.price,
                    estimatedValue,
                    saleEnd: listing.saleEnd,
                    saleStart: listing.saleStart,
                    image: svg ? svg : null,
                }

                tableRows.push(TableListing)
            } catch (e) {
                console.error(e)
                return
            }
        }
        setTableData(tableRows)
        setIsLoading(false)
    }

    React.useEffect(() => {
        getSafeData()
    }, [listings, allVaults, geb])

    return (
        <Container>
            <Header>
                <Title>Loan Marketplace</Title>
                <BtnWrapper>
                    <Button
                        data-test-id="steps-btn"
                        id={'suggest-pool-btn'}
                        secondary
                        onClick={() => {
                            window.open('https://opensea.io/collection/open-dollar-vaults', '_blank')
                        }}
                    >
                        View On OpenSea <ExternalLink />
                    </Button>
                </BtnWrapper>
            </Header>
            {tableData.length !== 0 && <Table data={tableData} />}
            {tableData.length === 0 && isLoading && <p>Loading...</p>}
            {tableData.length === 0 && !isLoading && <p>No vaults listed available</p>}
        </Container>
    )
}

export default Marketplace

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

const BtnWrapper = styled.div`
    width: max-content;

    button {
        text-transform: uppercase;
        font-weight: 700;
        font-size: 18px;
        padding: 17px 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }

    @media (max-width: 767px) {
        width: 250px;
        button {
            font-size: 12px;
            padding: 12px 20px;
        }
    }
`
