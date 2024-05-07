import styled from 'styled-components'
import PoolBlock from './PoolBlock.js'
import { useStoreState } from 'easy-peasy'
import { useStoreActions } from 'easy-peasy'
import { useActiveWeb3React } from '~/hooks'
import { useEffect } from 'react'
import useGeb from '~/hooks/useGeb'

const pools = [
    {
        title: 'Silo - WSTETH',
        tokenImg1: 'OD',
        tokenImg2: 'WETH',
        tokenAddress: '0x0341c0c0ec423328621788d4854119b97f44e391',
        collateralAddress: '0x5979D7b546E38E414F7E9822514be443A4800529',
        poolAddress: '0xE430b35583385638411BcbcC198a8733434901Dc',
        status: 'Active',
        tvl: '$3,000',
        apr: '120%',
        rewards: 'ARB',
        link: 'https://app.camelot.exchange/nitro/0xE430b35583385638411BcbcC198a8733434901Dc',
    },
]

const Earn = () => {
    const geb = useGeb()
    const { account } = useActiveWeb3React()
    // @to-do for some reason the new model is not being tracked in store type, but it is available as a function
    //  @ts-ignore
    const { nitroPoolsModel: nitroPoolsState } = useStoreState((state) => state)
    //  @ts-ignore
    const { nitroPoolsModel: nitroPoolsActions } = useStoreActions((state) => state)
    const { nitroPools } = nitroPoolsState

    console.log('nitroPools', nitroPools)

    useEffect(() => {
        if (!account || !geb) return
        nitroPoolsActions.fetchNitroPool({
            geb,
            poolAddress: pools[0].poolAddress,
            userAddress: account,
        })
    }, [account, geb, nitroPoolsActions])

    return (
        <Container>
            <Title>Earn</Title>
            <Pools>
                {pools.map((pool) => (
                    <PoolBlock key={pool.title} {...pool} />
                ))}
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
