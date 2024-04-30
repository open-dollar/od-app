import styled from 'styled-components'

const Stake = () => {
    return (
        <Container>
            <Title>Stake</Title>
            <Description>Stake assets in the Camelot to earn ODG rewards.</Description>
            <Pools>Active Pools</Pools>
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

    color: ${(props) => props.theme.colors.accent};
`

const Description = styled.div`
    font-size: ${(props) => props.theme.font.default};
    color: ${(props) => props.theme.colors.accent};
`

const Pools = styled.div``

export default Stake
