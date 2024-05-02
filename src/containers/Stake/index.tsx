import styled from 'styled-components'
import Camelot from '~/components/Icons/Camelot'
import LinkButton from '~/components/LinkButton'
import { getTokenLogo } from '~/utils'
import PoolBlock from './PoolBlock'

const Stake = () => {
    return (
        <Container>
            <Title>Earn</Title>
            <Pools>
                <PoolBlock />
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

export default Stake
