import CookieConsent from 'react-cookie-consent'
import styled from 'styled-components'

const CookieBanner = () => {
    return (
        <div id="cookies-consent">
            <CookieConsent
                location="bottom"
                buttonText="Accept"
                cookieName="cookiesAccepted"
                style={{
                    background: 'linear-gradient(180deg, #1A74EC 0%, #6396FF 100%',
                    boxShadow: '0 0 6px rgba(0,0,0,0.16)',
                }}
            >
                <CookiesText>
                    <p>
                        This website uses cookies to enhance the user experience. By continuing to browse the site
                        you're agreeing to our 
                        <a target="_blank" href="https://opendollar.com/tos" rel="noreferrer">
                             &nbsp;use of cookies.
                        </a>
                    </p>
                </CookiesText>
            </CookieConsent>
        </div>
    )
}

export default CookieBanner

const CookiesText = styled.span`
    color: white;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    font-weight: 700;
    font-size: 22px;

    a {
        text-decoration: underline;
        color: white;
    }

    @media (max-width: 991px) {
        font-size: 14px;
    }
`
