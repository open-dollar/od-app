import styled from 'styled-components'

import { Link } from 'react-router-dom'
import PoolBlock from './PoolBlock'
import { useStoreState } from 'easy-peasy'
import { useStoreActions } from 'easy-peasy'
import { useActiveWeb3React } from '~/hooks'
import { useEffect, useState } from 'react'
import useGeb from '~/hooks/useGeb'
import Loader from '~/components/Loader'

const NITRO_POOL = '0x70b4274c3f5A855c9f6f77E314D8a87CE310d03c'

const pools: any = [
    {
        poolAddress: NITRO_POOL,
        link: `https://app.camelot.exchange/nitro/${NITRO_POOL}`,
    },
]

const Earn = () => {
    const geb = useGeb()
    const [loading, setLoading] = useState(false)
    const { account } = useActiveWeb3React()
    const [apr, setApr] = useState(0)
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
            <SubHeader>incentivized pools and strategies</SubHeader>
            <Text>
                <p>Earn additional yield by staking your LP position in Camelot Nitro.</p>
                <p>
                    When creating a OD-ETH position, use the "Auto" mode provided by Gamma. <br></br>See full
                    instructions <Link to="">here</Link>.
                </p>
            </Text>
            <Pools>
                {nitroPools.length > 0 &&
                    pools?.map((pool: any, i: number) => (
                        <PoolBlock {...pool} apr={apr} nitroPoolData={nitroPools[i]} />
                    ))}
                {loading && <Loader width="50px" color="#1A74EC" />}
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
    color: ${(props) => props.theme.colors.accent};
`

const Title = styled.h2`
    font-size: 34px;
    font-weight: 700;
    font-family: ${(props) => props.theme.family.headers};

    color: ${(props) => props.theme.colors.accent};
`

const SubHeader = styled.h3`
    text-transform: uppercase;
    font-family: ${(props) => props.theme.family.headers};
    font-size: 22px;
    font-weight: 700;
    color: ${(props) => props.theme.colors.tertiary};
    margin-bottom: 20px;
`

const Text = styled.div`
    background-color: #6396ff26;
    padding: 20px;
    font-size: ${(props) => props.theme.font.default};
    border-radius: 3px;

    p {
        margin-bottom: 10px;
    }

    a {
        text-decoration: underline;
        color: ${(props) => props.theme.colors.tertiary};
    }
    margin-bottom: 30px;
`
const PoolsHeader = styled.h2`
    font-size: 34px;
    font-weight: 700;
    color: ${(props) => props.theme.colors.accent};
    margin-bottom: 20px;
`
const Pools = styled.div``

export default Earn
