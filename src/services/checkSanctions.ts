import axios from 'axios'

async function checkSanctions(address: string) {
    let res
    try {
        res = await axios.get(`https://bot.dev.opendollar.com/api/screen?address=${address}`, {
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
