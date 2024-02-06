import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import DepositBlock from '~/components/Deposit/DepositBlock'
import { useNitroPool } from '~/hooks'

const OnBoarding = () => {
    const { t } = useTranslation()
    const { poolDetails, depositTokens } = useNitroPool()

    return (
        <MainContainer id="deposit-page">
            <Content>
                <Container>
                    <Header>
                        <Title>{t('deposit')}</Title>
                        <Subtitle>{t('deposit_staked_assets')}</Subtitle>
                    </Header>
                </Container>
                {depositTokens.map((tokenData) => {
                    const tokenPoolDetails = poolDetails[tokenData.symbol]
                    const userDepositInfo = tokenPoolDetails?.userInfo

                    return (
                        <DepositBlock
                            key={tokenData.symbol}
                            ticker={tokenData.symbol}
                            tvl={tokenPoolDetails?.tvl}
                            apr={tokenPoolDetails?.apy}
                            userDeposit={userDepositInfo?.totalDepositAmount?.toString()}
                            userRewards={userDepositInfo?.rewardDebtToken2?.toString()}
                        />
                    )
                })}
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
