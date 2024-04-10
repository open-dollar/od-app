import React from 'react'
import styled from 'styled-components'
import Logo from '../assets/od-full-logo-grey.svg'

const Footer: React.FC = () => {

    return (
        <FooterAndImageContainer>
            <FooterContainer>
                <Row className="logoContainerAndText">
                    <Column className="logoRow">
                        <LogoContainer>
                            <a href={'/'}>
                                <img src={Logo} height={'34px'} width={'168px'} alt="OD" />
                            </a>
                        </LogoContainer>
                        <SmallText>
                            Leverage your liquid staking tokens with the most flexible stablecoin protocol
                        </SmallText>
                    </Column>
                </Row>
                <Row>
                    <Column>
                        <Header>PROJECT</Header>
                        <Link target="_blank" href="https://app.opendollar.com/">
                            Join Testnet
                        </Link>
                        <Link target="_blank" href="https://docs.opendollar.com/">
                            Docs
                        </Link>
                        <Link target="_blank" href="https://github.com/open-dollar">
                            GitHub
                        </Link>
                        <Link target="_blank" href="https://tally.so/r/wa26qX">
                            Partner
                        </Link>
                    </Column>
                    <Column>
                        <Header>RESOURCES</Header>
                        <Link target="_blank" href="https://www.opendollar.com/lite-paper">
                            Litepaper
                        </Link>
                        <Link target="_blank" href="https://mirror.xyz/0x8a81CEeb0a12998616F1aB932cDbc941F0d539E9">
                            Blog
                        </Link>
                        <Link target="_blank" href="https://www.opendollar.com/privacy">
                            Privacy Policy
                        </Link>
                        <Link target="_blank" href="https://www.opendollar.com/terms">
                            Terms of Service
                        </Link>
                    </Column>
                    <Column>
                        <Header>SOCIALS</Header>
                        <Link target="_blank" href="https://discord.opendollar.com">
                            Discord
                        </Link>
                        <Link target="_blank" href="https://twitter.com/open_dollar">
                            Twitter
                        </Link>
                        <Link target="_blank" href="https://t.me/open_dollar">
                            Telegram
                        </Link>
                        <Link target="_blank" href="https://warpcast.com/open-dollar">
                            Farcaster
                        </Link>
                        <Link target="_blank" href="https://debank.com/official/Open_Dollar">
                            DeBank
                        </Link>
                    </Column>
                </Row>
            </FooterContainer>
        </FooterAndImageContainer>
    )
}

export default Footer

const Header = styled.div`
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
    margin-bottom: 5px;
    color: white;
`

const FooterAndImageContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    position: relative;
`

const FooterContainer = styled.div`
    display: flex;
    padding-top: 60px;
    padding-bottom: 60px;
    width: 100%;
    flex-direction: row;
    background: linear-gradient(to bottom, #1a74ec, #6396ff);
    color: ${(props) => props.theme.colors.blueish};

    @media (max-width: 767px) {
        flex-direction: column;
        justify-content: start;
    }
`

const Row = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    @media (max-width: 767px) {
        justify-content: space-between;
    }
    &.logoContainerAndText {
        display: flex;
        flex-direction: column;
        @media (max-width: 767px) {
            margin-bottom: 20px;
        }
    }
`

const Column = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    padding-left: 20px;
    padding-right: 20px;

    @media (max-width: 767px) {
        padding-left: 20px;
        padding-right: 20px;
    }

    &.logoRow {
        @media (max-width: 767px) {
            width: 100%;
        }
        gap: 10.78px;
    }
`

const LogoContainer = styled.div`
    display: flex;
    a {
        color: inherit;
        text-decoration: none;
        img {
            &.small {
                width: 50px;
                height: 50px;
            }
        }
    }
`

const SmallText = styled.div`
    font-size: 16px;
    line-height: 24px;
    max-width: 300px;
    color: background;
    font-weight: 400;
    button {
        img {
            display: none;
        }
    }
`

const Link = styled.a`
    cursor: pointer;
    color: white;
    text-decoration: none;
    margin-bottom: 8px;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;

    &:hover {
        text-decoration: underline;
    }

    @media (max-width: 767px) {
        margin: 5px 0;
    }
`
