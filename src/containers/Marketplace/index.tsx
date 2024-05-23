import { ExternalLink, Info } from 'react-feather'
import styled from 'styled-components'
import Button from '~/components/Button'
import { useOpenSeaListings } from '~/hooks/useOpenSeaListings'
//@ts-ignore
import { generateSvg } from '@opendollar/svg-generator'
import { useEffect, useMemo, useState } from 'react'

const Marketplace = () => {
    const [svg, setSvg] = useState('')
    const listings = useOpenSeaListings()
    console.log('listings: ', listings)
    // data we need to display
    // for svg: vaultId, stabilityFee, debtAmount, collateralAmount, collateralizationRatio, safetyRatio, liqRatio
    // for card: current price -> listings.price.currancy and value, estimated value -> totalDollarValue, startTime, endTime, another value ?

    const vaultId = (listings?.[0] as any)?.id
    const debtAmount = (listings?.[0] as any)?.debt

    const handleClick = () => {
        window.open('https://opensea.io/collection/open-dollar-vaults', '_blank')
    }

    const statsForSVG = useMemo(
        () => ({
            vaultId,
            stabilityFee: 2,
            debtAmount,
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
                    <Button data-test-id="steps-btn" id={'suggest-pool-btn'} secondary onClick={handleClick}>
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
    flex: 1;
`

const Label = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    color: ${(props) => props.theme.colors.tertiary};
    font-size: ${(props) => props.theme.font.default};
`

const Value = styled.div`
    color: ${(props) => props.theme.colors.primary};
    font-size: 22px;
    font-weight: 700;
`

const DollarValue = styled.div`
    font-size: 16px;
    color: #5d707f;
`

const ColItem = styled.div`
    margin-bottom: 10px;
`

const RowItem = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px 0px;

    :first-child {
        border-bottom: 1px solid #e0e0e0;
    }
`

const RowValue = styled.div`
    font-weight: 700;
    color: ${(props) => props.theme.colors.tertiary};
    font-size: 20px;
`

const Block = styled.div``
