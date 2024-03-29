import CookieConsent from 'react-cookie-consent'
import styled from 'styled-components'

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
                    This website uses cookies to enhance the user experience. By continuing to browse the site you're
                    agreeing to our
                    <a target="_blank" href="https://opendollar.com/tos" rel="noreferrer">
                        &nbsp;use of cookies.
                    </a>
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
