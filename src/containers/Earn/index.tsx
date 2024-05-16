import styled from 'styled-components'
import PoolBlock from './PoolBlock'
import { useStoreState } from 'easy-peasy'
import { useStoreActions } from 'easy-peasy'
import { useActiveWeb3React } from '~/hooks'
import { useEffect, useState } from 'react'
import useGeb from '~/hooks/useGeb'
import { Loader } from 'react-feather'

const NITRO_POOL = '0x70b4274c3f5A855c9f6f77E314D8a87CE310d03c'

const pools = [
    {
        poolAddress: NITRO_POOL,
        link: `https://app.camelot.exchange/nitro/${NITRO_POOL}`,
    },
]

const Earn = () => {
    const geb = useGeb()
    const [loading, setLoading] = useState(false)
    const { account } = useActiveWeb3React()
    const [apr, setApr] = useState('0')
    // @to-do for some reason the new model is not being tracked in store type, but it is available as a function
    //  @ts-ignore
    const { nitroPoolsModel: nitroPoolsState } = useStoreState((state) => state)
    // @ts-ignore
    const { nitroPoolsModel: nitroPoolsActions } = useStoreActions((state) => state)
    const { nitroPools } = nitroPoolsState

    useEffect(() => {
        setLoading(true)
        if (!geb) return
        async function fetchPools() {
            for (const pool of pools) {
                try {
                    const response = await fetch('https://api.camelot.exchange/nitros')
                    const res = await response.json()
                    if (res.data.nitros[pool.poolAddress]?.incentivesApr) {
                        setApr(res.data.nitros[pool.poolAddress]?.incentivesApr)
                    }
                    await nitroPoolsActions.fetchNitroPool({
                        geb,
                        poolAddress: pool.poolAddress,
                        userAddress: account ?? undefined,
                    })
                    setLoading(false)
                } catch (e) {
                    setLoading(false)
                    throw new Error(`Error fetching nitropools data ${e}`)
                }
            }
        }
        fetchPools()
    }, [account, geb, nitroPoolsActions])
    console.log(nitroPools)

    return (
        <Container>
            <Title>Earn</Title>
            <Pools>
                {nitroPools.length > 0 &&
                    pools?.map((pool, i) => <PoolBlock {...pool} apy={apr} nitroPoolData={nitroPools[i]} />)}
                {loading && <Loader />}
            </Pools>
        </Container>
    )
}

const Container = styled.div`
    max-width: 1362px;
    margin: 80px auto;
    padding: 0 15px;
    @media (max-width: 767px) {
        margin: 50px auto;
    }
`

const Title = styled.h2`
    font-size: 34px;
    font-weight: 700;
    font-family: ${(props) => props.theme.family.headers};

    margin-bottom: 30px;

    color: ${(props) => props.theme.colors.accent};
`

const Pools = styled.div``

export default Earn
