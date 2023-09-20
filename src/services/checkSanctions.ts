import axios from 'axios'

async function checkSanctions(address: string) {
    let res
    try {
        res = await axios.get(`https://public.chainalysis.com/api/v1/address/${address}`, {
            headers: {
                'X-API-Key': process.env.REACT_APP_CHAINALYSIS_KEY as string,
                Accept: 'application/json',
            },
        })
        return res.data
    } catch (error) {
        console.error(error)
    }
}

export default checkSanctions