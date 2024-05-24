import { ExternalLink } from 'react-feather'
import styled from 'styled-components'
import Button from '~/components/Button'
import Table from '~/components/Table/Table'

const Marketplace = () => {
    const handleClick = () => {
        window.open('https://opensea.io/collection/open-dollar-vaults', '_blank')
    }

    return (
        <Container>
            <Header>
                <Title>Open Sea Listings</Title>
                <BtnWrapper>
                    <Button data-test-id="steps-btn" id={'suggest-pool-btn'} secondary onClick={handleClick}>
                        View On OpenSea <ExternalLink />
                    </Button>
                </BtnWrapper>
            </Header>
            <Table />
        </Container>
    )
}

export default Marketplace

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

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;
`

const BtnWrapper = styled.div`
    width: max-content;

    button {
        text-transform: uppercase;
        font-weight: 700;
        font-size: 18px;
        padding: 17px 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }
`
