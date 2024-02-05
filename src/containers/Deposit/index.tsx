import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import LinkButton from '~/components/LinkButton'

const OnBoarding = () => {
    const { t } = useTranslation()

    return (
        <MainContainer id="deposit-page">
            <Content>
                <Container>
                    <Header>
                        <Title>{t('deposit')}</Title>
                        <Subtitle>{t('deposit_staked_assets')}</Subtitle>
                    </Header>
                </Container>
                <LinkButton
                    id="deposit_wsteth"
                    text={'WSTETH'}
                    url={`/deposit/wsteth`}
                    color="colorPrimary"
                    border={true}
                />
                <LinkButton
                    id="deposit_wsteth"
                    text={'CBETH'}
                    url={`/deposit/cbeth`}
                    color="colorPrimary"
                    border={true}
                />
            </Content>
        </MainContainer>
    )
}

export default OnBoarding

const MainContainer = styled.div``

const Container = styled.div`
    max-width: 880px;
    margin: 80px auto;
    padding: 0 15px;
    @media (max-width: 767px) {
        margin: 50px auto;
    }
`
const Content = styled.div`
    position: relative;
`

const Col = styled.div`
    a {
        min-width: 100px;
        padding: 4px 12px;
    }
`

const Text = styled.div`
    font-size: 13px;
    font-weight: 600;
    line-height: 21px;
`

const StatItem = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: end;
    @media (max-width: 767px) {
        align-items: start;
    }
`

const TextHeader = styled.div`
    font-size: 13px;
    color: ${(props) => props.theme.colors.secondary};
    letter-spacing: -0.09px;
    line-height: 21px;
    @media (max-width: 767px) {
        font-size: ${(props) => props.theme.font.small};
    }
`

const Header = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 80px;
`

const Title = styled.h1`
    font-weight: 700;
    font-size: 34px;
`

const Subtitle = styled.h3`
    font-weight: 400;
    font-size: 14px;
    color: ${(props) => props.theme.colors.secondary};
`

const Wrapper = styled.div`
    display: flex;
    background: #002b40;
    width: 100%;
    margin-bottom: 24px;
    justify-content: space-between;
    border-radius: 15px;
`

const ComponentContainer = styled.div`
    max-width: 880px;
    margin: 20px auto;
    padding: 0 15px;
`
