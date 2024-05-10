import styled from 'styled-components'
import PoolBlock from './PoolBlock'
import { useStoreState } from 'easy-peasy'
import { useStoreActions } from 'easy-peasy'
import { useActiveWeb3React } from '~/hooks'
import { useEffect, useState } from 'react'
import useGeb from '~/hooks/useGeb'
import { Loader } from 'react-feather'

const pools = [
    {
        poolAddress: '0x64ca43A1C1c38b06757152fdf0CC02d0F84407CF',
        apy: '2.90%',
        link: 'https://app.camelot.exchange/pools/0x824959a55907d5350e73e151Ff48DabC5A37a657',
    },
]

const Earn = () => {
    const geb = useGeb()
    const [loading, setLoading] = useState(false)
    const { account } = useActiveWeb3React()
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
                    pools?.map((pool, i) => <PoolBlock {...pool} nitroPoolData={nitroPools[i]} />)}
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
