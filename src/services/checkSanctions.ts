import axios from 'axios'

async function checkSanctions(address: string) {
    let res
    try {
        const BOT_DOMAIN = process.env.REACT_APP_OD_API_URL
            ? process.env.REACT_APP_OD_API_URL
            : 'https://bot.opendollar.com/api'
        const BOT_API = `${BOT_DOMAIN}/screen?address=${address}`
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
