import { useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { AuctionEventType } from '~/types'

interface Props {
    type: AuctionEventType
}

interface FAQ {
    title: string
    desc: string
    image: string
}
interface FAQS {
    debt: Array<FAQ>
    surplus: Array<FAQ>
    collateral: Array<FAQ>
}

const AuctionsFAQ = ({ type }: Props) => {
    const { t } = useTranslation()

    const [collapseIndex, setCollapseIndex] = useState(0)

    const faqs: FAQS = {
        debt: [
            {
                title: t('debt_auction_minting_flx_header'),
                desc: t('debt_auction_minting_flx_desc'),
                image: require('../assets/mine.svg').default,
            },
            {
                title: t('debt_auction_how_to_bid'),
                desc: t('debt_auction_how_to_bid_desc'),
                image: require('../assets/bid.svg').default,
            },
            {
                title: t('debt_auction_claim_tokens'),
                desc: t('debt_auction_claim_tokens_desc'),
                image: require('../assets/claim.svg').default,
            },
        ],
        surplus: [
            {
                title: t('surplus_auction_minting_flx_header'),
                desc: t('surplus_auction_minting_flx_desc'),
                image: require('../assets/sell-hai.svg').default,
            },
            {
                title: t('surplus_auction_how_to_bid'),
                desc: t('surplus_auction_how_to_bid_desc'),
                image: require('../assets/bid.svg').default,
            },
            {
                title: t('surplus_auction_claim_tokens'),
                desc: t('surplus_auction_claim_tokens_desc'),
                image: require('../assets/claim.svg').default,
            },
        ],
        collateral: [
            {
                title: t('collateral_auction_minting_flx_header'),
                desc: t('collateral_auction_minting_flx_desc'),
                image: require('../assets/sell-hai.svg').default,
            },
            {
                title: t('collateral_auction_increasing_discount_header'),
                desc: t('collateral_auction_increasing_discount_desc'),
                image: require('../assets/bid.svg').default,
            },
            {
                title: t('collateral_auction_settlement_header'),
                desc: t('collateral_auction_settlement_desc'),
                image: require('../assets/claim.svg').default,
            },
        ],
    }

    return (
        <HeroSection>
            <Header>
                How do {type === 'COLLATERAL' ? '' : 'HAI'} {type.toLowerCase()} auctions work?
            </Header>
            <Content>
                {faqs[type.toLowerCase() as 'debt' | 'surplus' | 'collateral'].map((faq: FAQ, index) => (
                    <Col key={faq.title}>
                        <InnerCol>
                            <HeaderSection onClick={() => setCollapseIndex(index)}>
                                <img src={faq.image} alt={faq.title} />
                                <SectionHeading>{faq.title}</SectionHeading>
                            </HeaderSection>
                            {collapseIndex === index ? <SectionContent>{faq.desc}</SectionContent> : null}
                        </InnerCol>
                    </Col>
                ))}
            </Content>
        </HeroSection>
    )
}

export default AuctionsFAQ

const HeroSection = styled.div`
    margin-bottom: 20px;
    margin-top: 30px;
    overflow: hidden;
`
const Header = styled.div`
    font-size: ${(props) => props.theme.font.large};
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
    cursor: pointer;
    button {
        margin-left: 10px;
        font-size: ${(props) => props.theme.font.extraSmall};
        min-width: auto !important;
        border-radius: 25px;
        padding: 2px 10px;
        background: linear-gradient(225deg, #4ce096 0%, #78d8ff 100%);
    }

    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-direction:column;
    margin-bottom:25px;
    button {
      margin-top:10px;
    }
  `}
`
const Content = styled.div`
    ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction:column;
  `}
`
const SectionHeading = styled.div`
    font-size: ${(props) => props.theme.font.default};
    font-weight: bold;
`
const SectionContent = styled.div`
    margin-top: 10px;
    font-size: ${(props) => props.theme.font.small};
    line-height: 23px;
    color: ${(props) => props.theme.colors.secondary};
    text-align: left;
`

const Col = styled.div`
    margin-bottom: 10px;
    &:last-child {
        margin-bottom: 0;
    }
`

const InnerCol = styled.div`
    background: ${(props) => props.theme.colors.background};
    border-radius: 20px;
    padding: 20px;
    text-align: center;
`

const HeaderSection = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    img {
        width: 20px;
        margin-right: 10px;
    }
`
