import { useEffect, useState } from 'react'
import { getCollectionListingsData } from '~/services/opensea'
import { useStoreState } from 'easy-peasy'

export const useOpenSeaListings = () => {
    const [listings, setListings] = useState()

    //@ts-ignore
    const { safeModel: safeState } = useStoreState((state) => state)
    const safes = safeState.list

    useEffect(() => {
        if (!safes) return

        const getListingData = async () => {
            const collectionListings = await getCollectionListingsData()
            const listingData = collectionListings.listings.map((listing: any) => {
                const collectionAddress = listing.protocol_data.parameters.offer[0].token
                const safeId = listing.protocol_data.parameters.offer[0].identifierOrCriteria
                const owner = listing.protocol_data.parameters.offerer
                const { id, collateral, debt, safeHandler } = safes.find((safe: any) => safe.id === safeId)
                const totalDollarValue = +collateral - +debt
                const startTime = listing.protocol_data.parameters.startTime
                const endTime = listing.protocol_data.parameters.endTime
                const price = listing.price
                return {
                    id,
                    startTime,
                    endTime,
                    collectionAddress,
                    price,
                    totalDollarValue,
                    safeHandler,
                    owner,
                    safeId,
                    collateral,
                    debt,
                }
            })
            setListings(listingData)
        }
        getListingData()
    }, [safes])

    return listings
}
