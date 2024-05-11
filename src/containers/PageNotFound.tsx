import React from 'react'
import styled from 'styled-components'
import splashImage from '~/assets/404.webp'

const NotFound = () => {
    return (
        <Container>
            <CenterBox>
                <Text>You've stepped into a</Text>
                <BigText>404</BigText>
            </CenterBox>
        </Container>
    )
}

export default NotFound

const Container = styled.div`
    background-image: url(${splashImage});
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    height: 100vh;
    width: 100%;
    position: relative;
`

const CenterBox = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(255, 255, 255, 0);
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`

const Text = styled.p`
    margin: 0;
    font-size: 24px;
    line-height: 24px;
    font-weight: 500;
    @media (max-width: 767px) {
        font-size: 12px;
        line-height: 12px;
    }
`

const BigText = styled.p`
    margin: 0;
    font-size: 117.87px;
    line-height: 117.87px;
    font-weight: 900;
    @media (max-width: 767px) {
        font-size: 58.9px;
        line-height: 58.9px;
    }
`
