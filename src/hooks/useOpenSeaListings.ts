import { useEffect, useState } from 'react'
import { getCollectionListingsData } from '~/services/opensea'
import { useStoreState } from 'easy-peasy'
import { useWeb3React } from '@web3-react/core'

export const useOpenSeaListings = () => {
    const [listings, setListings] = useState()
    const { account } = useWeb3React()
    //@ts-ignore
    const { safeModel: safeState } = useStoreState((state) => state)
    const safes = safeState.list

    const getListingData = async () => {
        const collectionListings = await getCollectionListingsData()

        const listingData = collectionListings?.listings?.map((listing: any) => {
            const collectionAddress = listing.protocol_data.parameters.offer[0].token
            const safeId = listing.protocol_data.parameters.offer[0].identifierOrCriteria
            const owner = listing.protocol_data.parameters.offerer
            const safe = safes?.find((safe: any) => safe?.id === safeId)

            let collateral = 0
            let debt = 0
            let safeHandler = ''

            if (safe) {
                collateral = safe?.collateral
                debt = safe?.debt
                safeHandler = safe?.handler
            }
            // TODO: convert to USD
            const totalDollarValue = +collateral - +debt
            const startTime = listing.protocol_data.parameters.startTime
            const endTime = listing.protocol_data.parameters.endTime
            const price = listing.price
            return {
                id: safeId,
                startTime,
                endTime,
                collectionAddress,
                price,
                totalDollarValue,
                safeHandler,
                owner,
                collateral,
                debt,
            }
        })
        setListings(listingData)
    }

    useEffect(() => {
        if (!safes.length || !account) return

        getListingData()
    }, [safes, account])

    return listings
}
