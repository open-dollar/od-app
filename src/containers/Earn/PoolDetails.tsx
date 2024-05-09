import { useCallback } from 'react'
import { ChevronLeft } from 'react-feather'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

const PoolDetails = ({
    poolAddress,
    status,
    apy,
    link,
    nitroPoolData,
}: {
    poolAddress: string
    status: string
    apy: string
    link: string
    nitroPoolData: any
}) => {
    const history = useHistory()

    const handleBack = useCallback(() => {
        history.push(`/pools`)
    }, [history])

    return (
        <>
            <Container>
                <BackBtn id="back-btn" onClick={handleBack}>
                    <ChevronLeft size={18} /> BACK
                </BackBtn>
                <PoolHeader>
                    <Title>Tokens Icon and Name</Title>
                    <div>Deposit Btn with plus icon</div>
                </PoolHeader>
                <Body>
                    <Wrapper>First col</Wrapper>
                    <Wrapper>Second col</Wrapper>
                </Body>
                <Footer>
                    <FooterHeader>Footer Header</FooterHeader>
                    <Wrapper>Footer body</Wrapper>
                </Footer>
            </Container>
        </>
    )
}

export default PoolDetails

const Container = styled.div`
    max-width: 880px;
    margin: 50px auto;
    padding: 0 15px;
    @media (max-width: 767px) {
        margin: 50px auto;
    }
`

const BackBtn = styled.div`
    margin-bottom: 20px;
    font-size: 16px;
    display: flex;
    align-items: center;
    font-weight: 700;
    font-family: 'Open Sans', sans-serif;
    color: #1c293a;
    cursor: pointer;
    max-width: fit-content;
    svg {
        margin-right: 5px;
    }

    transition: opacity 0.3s ease;
    &:hover {
        opacity: 0.8;
    }
`
const PoolHeader = styled.div``

const Title = styled.h2``

const Body = styled.div``

const Wrapper = styled.div``

const Footer = styled.div``

const FooterHeader = styled.div``
