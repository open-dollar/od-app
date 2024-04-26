import React, { useState } from 'react'
import styled from 'styled-components'

const GeoBlockContainer = () => {
    const [letter, setLetter] = useState(
        `Comments on H.R.4766 - Clarity for Payment Stablecoins Act of 2023\n\nDecentralized stablecoins which are fully backed by high-quality crypto assets and fully overcollateralized should have a place in any stablecoin legislation. Organizations like Open Dollar, Liquity, and others are issuing stablecoins with protections for consumers which are even safer than centrally backed stablecoins – as demonstrated by USDC depegging when Silicon Valley Bank went defunct. Please support the innovation of American companies and legalize dollar-pegged stablecoins which are overcollateralized by more diverse assets. Thank you.`
    )
    const [copied, setCopied] = useState(false)

    const copyToClipboard = () => {
        navigator.clipboard.writeText(letter)
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 2000)
    }

    return (
        <Container>
            <CenterBox>
                <BigText>Location Blocked</BigText>
                <Text>
                    It seems like you are trying to access this interface from a prohibited country or jurisdiction. As
                    a web interface, we must adhere to certain rules and regulations. Please connect from a different
                    location.
                </Text>
                <Text>
                    <b>The Open Dollar protocol is decentralized, fully on-chain, and open-source.</b> No one person has
                    access to your funds or keys, only you do. You can view the code and run the app locally using our{' '}
                    <Link href="https://github.com/open-dollar/od-app" target="_blank">
                        GitHub
                    </Link>
                    .
                </Text>
                <Text>
                    <b>
                        You can be a force for good and support the development of secure and decentralized stablecoins
                    </b>
                    . Consider submitting a public comment to your Congressional representatives about the Payment
                    Stablecoins Act currently under debate.
                </Text>
                <Textarea value={letter} onChange={(e) => setLetter(e.target.value)} />
                <Button onClick={copyToClipboard}>{copied ? 'Copied' : 'Copy Text'}</Button>
                <Button
                    onClick={() =>
                        window.open('https://www.congress.gov/bill/118th-congress/house-bill/4766', '_blank')
                    }
                >
                    Send Comments to US Legislature
                </Button>
            </CenterBox>
        </Container>
    )
}

export default GeoBlockContainer

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 100vh;
    width: 100%;
    position: relative;
    z-index: 1001;
    @media (max-width: 767px) {
        padding: 20px;
    }
`

const CenterBox = styled.div`
    max-width: 600px;
    width: 100%;
    background-color: ${(props) => props.theme.colors.background};
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
    max-height: 80vh;
`

const Text = styled.p`
    margin-bottom: 16px;
    font-size: 18px;
    line-height: 1.6;
    font-family: 'Barlow', sans-serif;
    @media (max-width: 767px) {
        font-size: 16px;
    }
`

const Link = styled.a`
    color: #007bff;
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
`

const Textarea = styled.textarea`
    width: 100%;
    min-height: 150px;
    margin-top: 16px;
    padding: 12px;
    font-size: 16px;
    line-height: 1.5;
    border: 1px solid #ccc;
    border-radius: 5px;
    resize: vertical;
    &:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
    @media (max-width: 767px) {
        font-size: 14px;
    }
`

const Button = styled.button`
    display: block;
    width: 100%;
    padding: 10px;
    margin-top: 16px;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #0056b3;
    }
    &:focus {
        outline: none;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
    @media (max-width: 767px) {
        padding: 12px 0;
        font-size: 16px;
    }
`

const BigText = styled(Text)`
    margin-bottom: 20px;
    font-size: 36px;
    font-weight: 900;
    @media (max-width: 767px) {
        font-size: 28px;
    }
    font-family: 'Open Sans', sans-serif;
`
