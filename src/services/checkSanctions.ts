import axios from 'axios'
import { OD_API_URL } from '~/utils/constants'

async function checkSanctions(address: string) {
    let res
    try {
        const BOT_API = `${OD_API_URL}/screen?address=${address}`
        res = await axios.get(BOT_API, {
            headers: {
                Accept: 'application/json',
            },
        })
        return res.data
    } catch (error) {
        console.error(error)
    }
}

export default checkSanctions
