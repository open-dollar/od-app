import { useOpenSeaListings } from '~/hooks/useOpenSeaListings'

const Marketplace = () => {
    const listings = useOpenSeaListings()
    console.log(listings)
    return <div>Open Sea Listings</div>
}

export default Marketplace
