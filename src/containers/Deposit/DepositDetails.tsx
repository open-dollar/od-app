import { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'

import { fetchNitroPoolODGwstETH } from '@opendollar/sdk'
import useGeb from '~/hooks/useGeb'

const OnBoarding = ({ ...props }) => {
    const [nitroData, setNitroData] = useState({})
    const tokenPath = props.match.params.token as string
    const tokenSymbol = tokenPath.toUpperCase()

    const geb = useGeb()

    const fetchNitroData = useCallback(async () => {
        const data = await fetchNitroPoolODGwstETH(geb, '0x4391D56A8E56BE1fB30a45bAa0E5B7a4b488FbAa')
        console.log(data)
        setNitroData(data)
    }, [geb])

    useEffect(() => {
        if (!geb) return
        fetchNitroData()
    }, [tokenSymbol, geb, fetchNitroData])

    return (
        <MainContainer id="deposit-page">
            <Content>
                <Container>
                    <Header>
                        <Col>
                            <Title>{tokenSymbol}</Title>
                        </Col>
                    </Header>
                </Container>
                {JSON.stringify(nitroData)}
            </Content>
        </MainContainer>
    )
}

export default OnBoarding

const MainContainer = styled.div``

const Container = styled.div`
    max-width: 880px;
    margin: 80px auto;
    padding: 0 15px;
    @media (max-width: 767px) {
        margin: 50px auto;
    }
`

const Content = styled.div`
    position: relative;
`

const Col = styled.div`
    a {
        min-width: 100px;
        padding: 4px 12px;
    }
`

const Text = styled.div`
    font-size: 13px;
    font-weight: 600;
    line-height: 21px;
`

const StatItem = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: end;
    @media (max-width: 767px) {
        align-items: start;
    }
`

const TextHeader = styled.div`
    font-size: 13px;
    color: ${(props) => props.theme.colors.secondary};
    letter-spacing: -0.09px;
    line-height: 21px;
    @media (max-width: 767px) {
        font-size: ${(props) => props.theme.font.small};
    }
`

const Header = styled.div`
    margin-bottom: 16px;
    display: flex;
`

const Title = styled.div`
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
`

const Wrapper = styled.div`
    display: flex;
    background: #002b40;
    width: 100%;
    margin-bottom: 24px;
    justify-content: space-between;
    border-radius: 15px;
`

const ComponentContainer = styled.div`
    max-width: 880px;
    margin: 20px auto;
    padding: 0 15px;
`
