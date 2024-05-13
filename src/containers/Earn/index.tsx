import styled from 'styled-components'
import PoolBlock from './PoolBlock.js'

const pools = [
    {
        title: 'OD - ETH',
        tokenImg1: 'OD',
        tokenImg2: 'WETH',
        status: 'Active',
        tvl: '$3,000',
        apr: '120%',
        rewards: 'ODG, ARB',
        link: 'https://app.camelot.exchange/nitro/0xb6d3AfA311B3677efEd1a1eA500e66469b057A6A',
    },
]

const Earn = () => {
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
