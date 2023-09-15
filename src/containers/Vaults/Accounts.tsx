import React from 'react'
import styled from 'styled-components'
import Steps from '../../components/Steps'
import { useStoreState } from '../../store'

const Accounts = () => {
    const { connectWalletModel: connectWalletState } = useStoreState((state) => state)

    const { step } = connectWalletState

    const returnLottie = () => {
        switch (step) {
            case 1:
                return <img src={require('../../assets/facilitator-img.png')} alt="" />
            case 2:
                return <img src={require('../../assets/vault-img.png')} alt="" />
            default:
                return <img src={require('../../assets/connect-img.png')} alt="" />
        }
    }
    return (
        <Container>
            <Content>
                <ImageContainer>{returnLottie()}</ImageContainer>
                <Steps />
            </Content>
        </Container>
    )
}

export default Accounts

const Container = styled.div`
    padding: 30px 20px;
`

const Content = styled.div`
    max-width: 1024px;
    margin: 0 auto;
`

const ImageContainer = styled.div`
    height: 300px;
    @media (max-width: 767px) {
        text-align: center;
    }
    img {
        border-radius: 20px;
        margin: 0 auto;
        margin-top: 130px;
    }
    > div {
        margin: 0 auto;
    }
`
