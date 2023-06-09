import React from 'react'
import styled from 'styled-components'
import CookieConsent from 'react-cookie-consent'
import { Link } from 'react-router-dom'

const CookieBanner = () => {
    return (
        <div id="cookies-consent">
            <CookieConsent
                location="bottom"
                buttonText="✓ Accept"
                cookieName="cookiesAccepted"
                style={{
                    background: '#191b1f',
                    boxShadow: '0 0 6px rgba(0,0,0,0.16)',
                }}
            >
                <CookiesText>
                    <img src={require('../assets/cookie.svg').default} alt="" />
                    This website uses cookies to enhance the user experience. By
                    continuing to browse the site you're agreeing to our
                    <CustomLink
                        to={{
                            pathname: '/privacy',
                            state: { goToCookies: true },
                        }}
                    >
                        use of cookies.
                    </CustomLink>
                </CookiesText>
            </CookieConsent>
        </div>
    )
}

export default CookieBanner

const CookiesText = styled.span`
    color: ${(props) => props.theme.colors.primary};
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    img {
        width: 20px;
        margin-right: 10px;
    }

    @media (max-width: 991px) {
        font-size: 14px;
    }
`

const CustomLink = styled(Link)`
    @media (min-width: 991px) {
        font-size: 16px;
        margin-left: 4px !important;
    }
    color: ${(props) => props.theme.colors.blueish};
    @media (max-width: 991px) {
        font-size: 14px;
    }
`
