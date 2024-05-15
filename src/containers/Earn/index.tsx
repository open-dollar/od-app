import styled from 'styled-components'
import PoolBlock from './PoolBlock.js'
import { Link } from 'react-router-dom'

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
            <SubHeader>incentivized pools and strategies</SubHeader>
            <Text>
                <p>Earn additional yield by staking your LP position in Camelot Nitro.</p>
                <p>
                    When creating a OD-ETH position, use the "Auto" mode provided by Gamma. <br></br>See full
                    instructions <Link to="">here</Link>.
                </p>
            </Text>
            <Pools>
                <PoolsHeader>Strategies</PoolsHeader>
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
