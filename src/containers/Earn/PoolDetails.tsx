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
                    <Wrapper>
                        <ColWrapper>
                            <Item>
                                <Label>Total value locked</Label>
                                <Value>$813.6k</Value>
                            </Item>
                            <Item>
                                <Label>APR</Label>
                                <Value>3.53%</Value>
                            </Item>
                            <Item>
                                <Label>Pending Rewards</Label>
                                <Value>0.3213 ODG</Value>
                            </Item>
                        </ColWrapper>
                    </Wrapper>
                    <Wrapper>
                        <ColWrapper>
                            <Item>
                                <Label>Status</Label>
                                <Value>Active</Value>
                            </Item>
                            <Item>
                                <Label>Duration</Label>
                                <Value>12 months 6 days</Value>
                            </Item>
                            <Item>
                                <Label>End in</Label>
                                <Value>57 D 1h 27min 13 sec</Value>
                            </Item>
                        </ColWrapper>
                    </Wrapper>
                </Body>
                <Footer>
                    <FooterHeader>My deposit</FooterHeader>
                    <Wrapper>
                        <FooterWrapper>
                            <Item>
                                <Label>Average APR</Label>
                                <Value>0.00%</Value>
                            </Item>
                            <Item>
                                <Label>Total in Deposit</Label>
                                <Value>0.0 OD-ETH</Value>
                            </Item>
                            <Item>
                                <Label>Pending rewards</Label>
                                <Value>0.0 ODG</Value>
                            </Item>
                        </FooterWrapper>
                    </Wrapper>
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
    display: flex;
    flex-direction: column;
    gap: 50px;
    @media (max-width: 767px) {
        margin: 50px auto;
    }
`

const BackBtn = styled.div`
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
const PoolHeader = styled.div`
    display: flex;
    justify-content: space-between;
`

const Title = styled.h2``

const Body = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 20px;
`

const Wrapper = styled.div`
    background-color: #ffffff;
    padding: 20px;
    border-radius: 4px;
    flex: 1;
`

const Footer = styled.div``

const Label = styled.div`
    font-size: 16px;
    color: ${(props) => props.theme.colors.accent};
`

const Value = styled.div`
    font-size: 18px;
    color: ${(props) => props.theme.colors.primary};
    font-weight: 700;
`

const ColWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 20px;
`

const Item = styled.div``

const FooterWrapper = styled.div`
    display: flex;
    justify-content: space-between;
`

const FooterHeader = styled.div`
    margin-bottom: 15px;
    font-size: 32px;
    font-weight: 700;
    font-family: ${(props) => props.theme.family.headers};
    color: ${(props) => props.theme.colors.accent};
`
