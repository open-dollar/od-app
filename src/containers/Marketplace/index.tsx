import { useEffect, useState } from "react"
import { getCollectionListingsData } from "~/services/opensea"


const Marketplace = () => {
  const [listings, setListings] = useState()
  useEffect(() => {
    const getListingData = async () => {
      const collectionListings = await getCollectionListingsData();
      setListings(collectionListings)
    }
    getListingData()
  }, [])

  return (
    <div>

    </div>
  )
}

export default Marketplace