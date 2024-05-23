const collectionId = 'open-dollar-vaults'

const fetchFromOpenSea = async (url: string) => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'x-api-key': process.env.REACT_APP_OPENSEA_KEY!,
        },
    }

    return fetch(url, options)
        .then((response) => response.json())
        .catch((err) => console.error(err))
}

export const getCollectionListingsData = async () => {
    const listings = await fetchFromOpenSea(`https://api.opensea.io/api/v2/listings/collection/${collectionId}/all`)
    return listings
}

export const getListingOffers = async () => {
    const offers = await fetchFromOpenSea(`https://api.opensea.io/api/v2/offers/collection/${collectionId}/all`)
    return offers
}

export const getBestOfferByNFT = async (nftId: string) => {
    const bestOffer = await fetchFromOpenSea(
        `https://api.opensea.io/api/v2/offers/collection/${collectionId}/nfts/${nftId}/best`
    )
    return bestOffer
}

export const getBestListingsByCollection = async () => {
    const bestListings = await fetchFromOpenSea(
        `https://api.opensea.io/api/v2/listings/collection/${collectionId}/best`
    )
    return bestListings
}
