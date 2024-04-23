import CookieConsent from 'react-cookie-consent'
import styled from 'styled-components'

const CookieBanner = () => {
    return (
        <StyledConsentButton>
            <div id="cookies-consent">
                <CookieConsent
                    location="bottom"
                    buttonText="Accept"
                    cookieName="cookiesAccepted"
                    style={{
                        background: 'linear-gradient(180deg, #1A74EC 0%, #6396FF 100%',
                        alignItems: 'center',
                    }}
                >
                    <CookiesText>
                        <p>
                            This website uses cookies to enhance the user experience. By continuing to browse the site
                            you're agreeing to our{' '}
                            <a target="_blank" href="https://www.opendollar.com/terms" rel="noreferrer">
                                use of cookies
                            </a>
                            .
                        </p>
                    </CookiesText>
                </CookieConsent>
            </div>
        </StyledConsentButton>
    )
}

export default CookieBanner

const StyledConsentButton = styled.div`
    #cookies-consent button {
        border: 2px solid #e2f1ff !important;
        border-radius: 4px !important;
        background: transparent !important;
        padding: 10px 30px !important;
        font-size: 18px;
        font-weight: 600;
        width: 163px;
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`

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
