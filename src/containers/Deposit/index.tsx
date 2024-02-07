import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import DepositBlock from '~/components/Deposit/DepositBlock'
import { useNitroPool } from '~/hooks'

const Deposit = () => {
    const { t } = useTranslation()
    const [nitroPools] = useNitroPool()

    return (
        <MainContainer id="deposit-page">
            <Header>
                <Title>{t('deposit')}</Title>
                <Subtitle>{t('deposit_staked_assets')}</Subtitle>
            </Header>
            <DepositListContainer>
                {Object.values(nitroPools).map(({ tokens, pool, user }) => {
                    if (!pool || !tokens) return null

                    return (
                        <DepositBlock
                            key={tokens.collateral.symbol}
                            ticker={tokens.collateral.symbol}
                            tvl={pool.tvl}
                            apr={pool.apr}
                            userDeposit={user?.deposit}
                            userRewards={user?.pendingRewards}
                        />
                    )
                })}
            </DepositListContainer>
        </MainContainer>
    )
}

export default Deposit

const MainContainer = styled.div`
    max-width: 880px;
    margin: 80px auto;
    padding: 0 15px;
    @media (max-width: 767px) {
        margin: 50px auto;
    }
`

const DepositListContainer = styled.div``

const Header = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 80px;
    margin-bottom: 50px;
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
