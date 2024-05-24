import { useEffect, useState } from 'react'
import { getCollectionListingsData, getNftMetadata } from '~/services/opensea'
import { useStoreState } from '~/store'
import { useWeb3React } from '@web3-react/core'
import { getDuration, getEndDuration } from '~/utils/datesAndTimes'
import api from '~/services/api'

type Listing = {
    id: string
    assetName: string
    price: string
    estimatedValue: string
    saleEnd: string
    saleStart: string
    image?: string
}

export const useOpenSeaListings = () => {
    const [listings, setListings] = useState<Listing[]>([])
    const { account } = useWeb3React()
    const {
        safeModel: safeState,
        connectWalletModel: { fiatPrice },
    } = useStoreState((state) => state)
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
                const estimatedValue = `$${(priceInEth * fiatPrice).toFixed(2)}`
                const metadata = await getNftMetadata(listing.protocol_data.parameters.offer[0].token, vaultId)
                const assetName =
                    metadata.nft.traits.find((trait: any) => trait.trait_type === 'Collateral Type')?.value || ''
                const image = metadata.nft.image_url || ''

                return {
                    id: vaultId,
                    assetName,
                    price,
                    estimatedValue,
                    saleEnd: getEndDuration(currentTime, endTime),
                    saleStart: getDuration(startTime, endTime),
                    image,
                }
            }) || []
        )

        setListings(listingData)
    }

    useEffect(() => {
        const fetchData = async () => {
            await api.fetchFiatPrice('ethereum')
            getListingData()
        }

        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [safes, account])

    return listings
}
