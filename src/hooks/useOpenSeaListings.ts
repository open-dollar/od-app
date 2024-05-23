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
            const listingData = collectionListings.listings.map((listing: any, i: number) => {
                const collectionAddress = listing.protocol_data.parameters.offer[0].token
                const id = listing.protocol_data.parameters.offer[0].identifierOrCriteria
                const safe = safes.find((safe: any) => safe.id === id)
                const startTime = listing.protocol_data.parameters.startTime
                const endTime = listing.protocol_data.parameters.endTime
                const price = listing.price
                return { id, safe, startTime, endTime, collectionAddress, price }
            })
            setListings(listingData)
        }
        getListingData()
    }, [safes])

    return listings
}
