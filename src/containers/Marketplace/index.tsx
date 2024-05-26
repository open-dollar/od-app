import { ExternalLink } from 'react-feather'
import styled from 'styled-components'
import Button from '~/components/Button'
import Table from '~/components/Table/Table'
import { useOpenSeaListings } from '~/hooks/useOpenSeaListings'
import { useStoreActions, useStoreState } from '~/store'
import useGeb from '~/hooks/useGeb'
import {ethers} from 'ethers'
import { formatUserSafe, ILiquidationData } from '~/utils'
import gebManager from '~/utils/gebManager'
import { formatWithCommas, getRatePercentage } from '~/utils'
// @ts-ignore
import { generateSvg } from '@opendollar/svg-generator'
import * as React from 'react'
import { table } from 'console'

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
    const handleClick = () => {
        window.open('https://opensea.io/collection/open-dollar-vaults', '_blank')
    }
    const [fetching, setFetching] = React.useState<boolean>(true)
    const [tableData, setTableData] = React.useState<Listing[]>([])
    const listings = useOpenSeaListings()
    const { safeModel: safeState } = useStoreState((state) => state)
    const geb = useGeb()
    const { safeModel: safeActions } = useStoreActions((state) => state)

    React.useEffect(() => {
        const getSafeData = async () => {

            if (!geb) return
            
            if (!listings) return
            setFetching(true)
            const tableInfo = []
            for (const listing of listings) {
                try {
                    const safeDataResponse = await geb.contracts.safeManager.connect(geb.provider).safeData(listing.id)
                    const ODProxyAddress = safeDataResponse[1]
                    const ODProxyContract = new ethers.Contract(
                        ODProxyAddress,
                        '[{"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"OnlyOwner","type":"error"},{"inputs":[],"name":"TargetAddressRequired","type":"error"},{"inputs":[{"internalType":"bytes","name":"_response","type":"bytes"}],"name":"TargetCallFailed","type":"error"},{"inputs":[],"name":"OWNER","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_target","type":"address"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"execute","outputs":[{"internalType":"bytes","name":"_response","type":"bytes"}],"stateMutability":"payable","type":"function"}]',
                        geb.provider
                    )
                    const ownerAddress = await ODProxyContract.OWNER()
                    const userSafes = await gebManager.getUserSafesRpc({
                        address: ownerAddress,
                        geb,
                        tokensData: geb.tokenList,
                    })
                    const safeById = userSafes.safes.find((safe) => safe.safeId === listing.id)
                    if (!safeById) {
                        return
                    }
                    const { collateralLiquidationData } = userSafes
                    const constructedLiquidationData: ILiquidationData = {
                        currentRedemptionPrice: userSafes.systemState.currentRedemptionPrice.value,
                        currentRedemptionRate: userSafes.systemState.currentRedemptionRate.annualizedRate,
                        globalDebt: userSafes.systemState.globalDebt,
                        perSafeDebtCeiling: userSafes.systemState.perSafeDebtCeiling,
                        globalDebtCeiling: userSafes.systemState.globalDebtCeiling,
                        collateralLiquidationData: collateralLiquidationData,
                    }
                    safeActions.setLiquidationData(constructedLiquidationData)
        
                    const formattedSafe = formatUserSafe(
                        [safeById],
                        constructedLiquidationData as ILiquidationData,
                        geb.tokenList
                    )
                    const statsForSVG = (singleSafe: any) => ({
                        vaultID: singleSafe?.id,
                        stabilityFee:
                            Number(
                                getRatePercentage(
                                    singleSafe?.totalAnnualizedStabilityFee ? singleSafe?.totalAnnualizedStabilityFee : '0',
                                    4
                                )
                            ).toString() + '%',
                        debtAmount: formatWithCommas(singleSafe.totalDebt) + ' OD',
                        collateralAmount: formatWithCommas(singleSafe.collateral) + ' ' + singleSafe.collateralName,
                        collateralizationRatio: singleSafe?.collateralRatio === '∞' ? '∞' : Number(singleSafe?.collateralRatio),
                        safetyRatio: Number(constructedLiquidationData.collateralLiquidationData[singleSafe.collateralName].safetyCRatio),
                        liqRatio: Number(constructedLiquidationData.collateralLiquidationData[singleSafe.collateralName].liquidationCRatio),
                   })
                   
                    if (formattedSafe[0] ) {
                        let svg = null
                        try {
                            svg = await generateSvg(statsForSVG(formattedSafe[0]))
                        } catch (e) {
                            console.error(e)
                        }
                        
                        tableInfo.push({
                            id: listing.id,
                            assetName: formattedSafe[0].collateralName,
                            price: listing.price,
                            estimatedValue: (+formattedSafe[0].collateral - +formattedSafe[0].debt).toString(),
                            saleEnd: listing.saleEnd,
                            saleStart: listing.saleStart,
                            image: svg ? svg : null,
                        })
                    }
                } catch (e) {
                    console.error(e)
                    return
                }
            }
            setTableData(tableInfo)
            setFetching(false)
        }
        getSafeData()
    }, [listings, geb])

    return (
        <Container>
            <Header>
                <Title>Loan Marketplace</Title>
                <BtnWrapper>
                    <Button data-test-id="steps-btn" id={'suggest-pool-btn'} secondary onClick={handleClick}>
                        View On OpenSea <ExternalLink />
                    </Button>
                </BtnWrapper>
            </Header>
            { tableData.length !== 0 && <Table data={tableData} /> }
            { tableData.length === 0 && fetching && <p>Loading...</p> }
            { tableData.length === 0 && !fetching && <p>No listings available</p> }
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
