import { useCallback } from 'react'
import { WYRE_WORKER } from '../utils/constants'

// geberates swap url for Wyre so it user can swap fiat to RAI
export default function useSwap() {
    const generateSwap = useCallback(async () => {
        const res = await generateSwapUrl()
        if (res && res.url) {
            return res.url
        }
    }, [])

    return { generateSwap }
}

function generateSwapUrl() {
    return fetch(WYRE_WORKER)
        .then((res) => {
            if (res.status === 200) {
                return res.json()
            }
        })
        .catch((error) => {
            console.error('Failed to get reservationId', error)
        })
}
