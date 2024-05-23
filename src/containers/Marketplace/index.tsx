import { ExternalLink, Info } from 'react-feather'
import styled from 'styled-components'
import Button from '~/components/Button'
import { useOpenSeaListings } from '~/hooks/useOpenSeaListings'
//@ts-ignore
import { generateSvg } from '@opendollar/svg-generator'
import { useEffect, useMemo, useState } from 'react'
import Dollar from '~/components/Icons/Dollar'

const Marketplace = () => {
    const [svg, setSvg] = useState('')
    const listings = useOpenSeaListings()
    console.log('listings: ', listings)

    const handleClick = () => {
        window.open('https://discord.opendollar.com/', '_blank')
    }

    const statsForSVG = useMemo(
        () => ({
            vaultID: 1,
            stabilityFee: 2,
            debtAmount: (listings?.[0] as any)?.debt,
            collateralAmount: (listings?.[0] as any)?.collateral,
            collateralizationRatio: '5%',
            safetyRatio: '6%',
            liqRatio: '7%',
        }),
        []
    )

    useEffect(() => {
        setSvg(generateSvg(statsForSVG))
    }, [statsForSVG])

    return (
        <Container>
            <Header>
                <Title>Open Sea Listings</Title>
                <BtnWrapper>
                    <Button
                        data-test-id="steps-btn"
                        id={'suggest-pool-btn'}
                        // text={'suggest a new pool'}
                        secondary
                        onClick={handleClick}
                    >
                        View On OpenSea <ExternalLink />
                    </Button>
                </BtnWrapper>
            </Header>
            <CardsList>
                <Card>
                    <Wrapper>
                        <Col>
                            {/* <SVGContainer>
                                <div
                                    style={{
                                        maxWidth: '300px',
                                        height: 'auto',
                                    }}
                                    dangerouslySetInnerHTML={{ __html: svg }}
                                ></div>
                            </SVGContainer> */}
                            image
                        </Col>
                        <Col>
                            <Block>
                                <ColItem>
                                    <Label>
                                        Current Price <Info />
                                    </Label>
                                    <Value>1 ETH</Value>
                                    <DollarValue>$10,001</DollarValue>
                                </ColItem>
                                <ColItem>
                                    <Label>
                                        Estimated Value <Info />
                                    </Label>
                                    <Value>$3000</Value>
                                </ColItem>
                            </Block>
                            <Block>
                                <RowItem>
                                    <Label>Sale ends</Label>
                                    <RowValue>6/22/24</RowValue>
                                </RowItem>
                                <RowItem>
                                    <Label>Another value</Label>
                                    <RowValue>0%</RowValue>
                                </RowItem>
                            </Block>
                        </Col>
                    </Wrapper>
                </Card>
            </CardsList>
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

const CardsList = styled.div``

const Card = styled.div`
    background-color: white;
    border-radius: 3px;
    padding: 20px;
    width: 600px;
`

const SVGContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 300px;
    position: relative;
    overflow: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
        width: 0;
        background: transparent;
    }
`

const Wrapper = styled.div`
    display: flex;
    gap: 20px;
    align-items: center;
`

const Col = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`

const Label = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    color: ${(props) => props.theme.colors.tertiary};
    font-size: ${(props) => props.theme.font.default};
`

const Value = styled.div``

const DollarValue = styled.div``

const ColItem = styled.div``

const RowItem = styled.div`
    display: flex;
    justify-content: space-between;
`

const RowValue = styled.div``

const Block = styled.div``
