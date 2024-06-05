import { useEffect, useState } from 'react'
import { getCollectionListingsData, getNftMetadata } from '~/services/opensea'
import { useStoreState } from '~/store'
import { useWeb3React } from '@web3-react/core'
import { getDuration, getEndDuration } from '~/utils/datesAndTimes'
import { BigNumber, ethers } from 'ethers'
import { formatDataNumber, formatNumber } from '~/utils'

type Listing = {
    id: string
    assetName: string
    price: string
    estimatedValue: string
    saleEnd: string
    saleEndMinutes: number
    saleStart: string
    saleStartMinutes: number
    image?: string
}

export const useOpenSeaListings = () => {
    const [listings, setListings] = useState<Listing[]>([])
    const { account } = useWeb3React()
    const { safeModel: safeState } = useStoreState((state) => state)
    const safes = safeState.list
    const getListingData = async () => {
        const collectionListings = await getCollectionListingsData()

        const listingData = await Promise.all(
            collectionListings?.listings?.map(async (listing: any) => {
                const vaultId = listing.protocol_data.parameters.offer[0].identifierOrCriteria
                const currentTime = new Date()
                const startTime = listing.protocol_data.parameters.startTime
                const endTime = listing.protocol_data.parameters.endTime
                const priceInEth = listing.price.current.value / 10 ** listing.price.current.decimals
                const price = `${priceInEth} ETH`
                const metadata = await getNftMetadata(listing.protocol_data.parameters.offer[0].token, vaultId)
                const assetName =
                    metadata.nft.traits.find((trait: any) => trait.trait_type === 'Collateral Type')?.value || ''
                const collateralAmount =
                    metadata.nft.traits.find((trait: any) => trait.trait_type === 'Collateral')?.value || '0'
                const debt = metadata.nft.traits.find((trait: any) => trait.trait_type === 'Debt')?.value || '0'
                const collateralAmountBN = BigNumber.from(collateralAmount)
                const debtBN = BigNumber.from(debt)

                let estimatedValue = '0'
                let collateralPriceUSD = '0'
                let odPriceUSD = '0'

                if (
                    safeState?.liquidationData &&
                    safeState?.liquidationData.collateralLiquidationData &&
                    safeState.liquidationData.collateralLiquidationData[assetName]
                ) {
                    const currentRedemptionPrice = safeState.liquidationData.currentRedemptionPrice
                    const collateralLiquidationPrice =
                        safeState.liquidationData.collateralLiquidationData[assetName].currentPrice.value

                    //TODO: Need to debug calculating estimated value
                    odPriceUSD = formatNumber(currentRedemptionPrice).toString()
                    collateralPriceUSD = formatNumber(collateralLiquidationPrice).toString()

                    const odPriceUSDBN = ethers.utils.parseUnits(odPriceUSD, 18)
                    const collateralPriceUSDBN = ethers.utils.parseUnits(collateralPriceUSD, 18)

                    const odValue = debtBN.mul(odPriceUSDBN).div(BigNumber.from(10).pow(18))
                    const collateralValue = collateralAmountBN.mul(collateralPriceUSDBN).div(BigNumber.from(10).pow(18))

                    const estimatedValueBN = collateralValue.sub(odValue)
                    estimatedValue = formatDataNumber(estimatedValueBN.toString(), 18, 2, true)
                }

                const image = metadata.nft.image_url || ''

                const { formatted: saleStart, totalMinutes: saleStartMinutes } = getDuration(startTime, endTime)
                const { formatted: saleEnd, totalMinutes: saleEndMinutes } = getEndDuration(currentTime, endTime)

                return {
                    id: vaultId,
                    assetName,
                    price,
                    estimatedValue,
                    saleEnd,
                    saleEndMinutes,
                    saleStart,
                    saleStartMinutes,
                    image,
                }
            }) || []
        )

        setListings(listingData)
    }

    useEffect(() => {
        const fetchData = async () => {
            getListingData()
        }

        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [safes, account])

    return listings
}
