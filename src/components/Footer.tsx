import React from 'react'
import styled from 'styled-components'
import Logo from '../assets/od-full-logo-grey.svg'
import { useStoreActions } from '~/store'
import { Link as RouterLink } from 'react-router-dom'
import FooterBackgroundImage from '~/assets/footer-bg-art.svg'

const Footer: React.FC = () => {
    const { popupsModel: popupsActions } = useStoreActions((state) => state)

    const handleLinkClick = async (e: React.MouseEvent<HTMLElement>, disable = false, externalLink = '') => {
        if (disable) {
            e.preventDefault()
        }
        popupsActions.setShowSideMenu(false)
        if (externalLink) {
            window.open(externalLink, '_blank')
            e.preventDefault()
        }
    }
    return (
        <FooterAndImageContainer>
            <FooterContainer>
                <Row className="logoRow">
                    <Column>
                        <LogoContainer>
                            <a href={'/'}>
                                <img src={Logo} height={'13px'} width={'89px'} alt="OD" />
                            </a>
                        </LogoContainer>
                    </Column>
                </Row>
                <Row className="linksRow">
                    <Column>
                        <Link target="_blank" href="https://blog.opendollar.com/">
                            Blog
                        </Link>
                        <Link target="_blank" href="https://opendollar.com/lite-paper">
                            Lite Paper
                        </Link>
                    </Column>
                    <Column>
                        <InnerLink
                            to="/vaults"
                            onClick={(e) => handleLinkClick(e, false)}
                            className={location.pathname.startsWith('/vaults') ? 'activeLink' : ''}
                        >
                            App
                        </InnerLink>
                        <InnerLink
                            to="/auctions"
                            onClick={(e) => handleLinkClick(e, false)}
                            className={location.pathname.startsWith('/auctions') ? 'activeLink' : ''}
                        >
                            Auctions
                        </InnerLink>
                        <InnerLink
                            to="/stats"
                            onClick={(e) => handleLinkClick(e, false)}
                            className={location.pathname.startsWith('/stats') ? 'activeLink' : ''}
                        >
                            Stats
                        </InnerLink>
                    </Column>
                    <Column>
                        <Link target="_blank" href="https://discord.opendollar.com">
                            Discord
                        </Link>
                        <Link target="_blank" href="https://twitter.com/open_dollar">
                            Twitter
                        </Link>
                    </Column>
                </Row>
                <Row className="privacyRow">
                    <Column>
                        <SmallerLink target="_blank" href="https://opendollar.com/privacy">
                            Privacy Policy
                        </SmallerLink>
                        <SmallerLink target="_blank" href="https://opendollar.com/tos">
                            Terms of Service
                        </SmallerLink>
                    </Column>
                </Row>
            </FooterContainer>
            <FooterImage>
                <img src={FooterBackgroundImage} alt="" />
            </FooterImage>
        </FooterAndImageContainer>
    )
}

export default Footer

const FooterAndImageContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
`

const FooterImage = styled.div`
    display: flex;
    width: 100%;
    z-index: -1;
    img {
        width: 100%;
    }
`

const FooterContainer = styled.div`
    display: flex;
    padding-top: 80px;
    bottom: 170px;
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
    color: ${(props) => props.theme.colors.blueish};

    @media (max-width: 767px) {
        bottom: 117px;
        flex-direction: column;
        justify-content: center;
    }
`

const Row = styled.div`
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    width: 100%;

    &.logoRow,
    &.privacyRow {
        font-size: 12px;
        @media (max-width: 767px) {
            justify-content: space-between;
            font-size: 12px;
        }
    }

    &.linksRow {
        @media (max-width: 767px) {
            justify-content: space-between;
            font-size: 16px;
            margin: 24px 0;
        }
    }
`

const Column = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    padding-left: 10px;
    padding-right: 10px;

    @media (max-width: 767px) {
        padding-left: 20px;
        padding-right: 20px;
    }
`

const LogoContainer = styled.div`
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

const SmallerLink = styled.a`
    cursor: pointer;
    color: #00587e;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`

const InnerLink = styled(RouterLink)`
    cursor: pointer;
    color: inherit;
    text-decoration: none;
    margin-bottom: 5px;

    &:hover {
        text-decoration: underline;
    }

    @media (max-width: 767px) {
        margin: 5px 0;
    }
`

const Link = styled.a`
    cursor: pointer;
    color: inherit;
    text-decoration: none;
    margin-bottom: 5px;

    &:hover {
        text-decoration: underline;
    }

    @media (max-width: 767px) {
        margin: 5px 0;
    }
`
