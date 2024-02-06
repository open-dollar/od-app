import { useEffect } from 'react'
import styled from 'styled-components'
import { useNitroPool } from '~/hooks'
import { useStoreState } from '~/store'

const OnBoarding = ({ ...props }) => {
    const tokenPath = props.match.params.token as string
    const tokenSymbol = tokenPath.toUpperCase()

    const {
        depositModel: { depositTokens },
    } = useStoreState((state) => state)

    const { poolDetails } = useNitroPool()

    useEffect(() => {
        if (!depositTokens.has(tokenSymbol)) {
            props.history.push('/404')
        }
    }, [depositTokens, poolDetails, props.history, tokenSymbol])

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
                {JSON.stringify(poolDetails[tokenSymbol])}
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

const Header = styled.div`
    margin-bottom: 16px;
    display: flex;
`

const Title = styled.div`
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
`
