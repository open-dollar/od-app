import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useStakingInfo } from '../../../hooks/useStaking'
import StakingManager from './StakingManager'
import Statistics from './Statistics'
import LinkButton from '../../../components/LinkButton'
import { AlertCircle, BarChart2 } from 'react-feather'

dayjs.extend(duration)
dayjs.extend(relativeTime)

const Staking = () => {
    const { t } = useTranslation()

    // how long before user can withdraw staking balance
    const { exitDelay } = useStakingInfo()
    return (
        <Container>
            <Header>
                <Title>Staking</Title>
                <LinkButton
                    url="/auctions/staked_token"
                    text={'Staked Token Auctions'}
                    color={'colorPrimary'}
                />
            </Header>

            <InfoBox>
                <LeftSide>
                    <InfoTitle>
                        <BarChart2 size="16" /> FLX/ETH LP Staking
                    </InfoTitle>
                    <InfoText>
                        {t('staking_description')}{' '}
                        {
                            <a
                                rel="noopener noreferrer"
                                href="https://docs.reflexer.finance/incentives/flx-staking"
                                target="_blank"
                            >
                                Read More
                            </a>
                        }
                    </InfoText>
                </LeftSide>
                <RightSide>
                    <InfoTitle>
                        <AlertCircle size="16" /> Important Note
                    </InfoTitle>
                    <InfoText className="bigFont">
                        {`Unstaking is subject to a thawing period of ${
                            exitDelay
                                ? dayjs
                                      .duration(exitDelay, 'seconds')
                                      .humanize()
                                : '-'
                        }`}
                    </InfoText>
                </RightSide>
            </InfoBox>

            <Content>
                <Header>
                    <Left>
                        <img
                            src={require('../../../assets/stFLX.svg').default}
                            alt="flx"
                        />
                        stFLX
                    </Left>
                </Header>
                <Ops>
                    <StakingManager />
                    <Statistics />
                </Ops>
            </Content>
        </Container>
    )
}

export default Staking

const Container = styled.div`
    max-width: 880px;
    margin: 80px auto;
    padding: 0 15px;
    @media (max-width: 767px) {
        margin: 50px auto;
    }
`

const Ops = styled.div`
    display: flex;
    align-items: stretch;

    ${({ theme }) => theme.mediaWidth.upToSmall`
        flex-direction:column-reverse;
    `}
`

const Title = styled.div`
    font-size: 18px;
    line-height: 22px;
    letter-spacing: -0.33px;
    color: ${(props) => props.theme.colors.primary};
    font-weight: bold;
`

const Content = styled.div`
    padding: 20px;
    border-radius: 15px;
    background: ${(props) => props.theme.colors.colorSecondary};
`

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
        width: 40px;
        margin-right: 5px;
    }
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 20px;
`

const Left = styled.div`
    display: flex;
    align-items: center;
    img {
        width: 30px;
    }
`

const InfoBox = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    margin-top: 20px;
    @media (max-width: 767px) {
        display: none;
    }
`

const LeftSide = styled.div`
    flex: 0 0 56%;
    background: url(${require('../../../assets/blueish-bg.png').default});
    background-repeat: no-repeat;
    background-size: cover;
    padding: 20px;
    border-radius: 15px;
`
const RightSide = styled.div`
    flex: 0 0 42%;
    background: url(${require('../../../assets/greenish-bg.png').default});
    background-repeat: no-repeat;
    background-size: cover;
    padding: 20px;
    border-radius: 15px;
    line-height: 1.7;
`

const InfoTitle = styled.div`
    display: flex;
    align-items: center;
    font-size: ${(props) => props.theme.font.default};
    font-weight: 600;
    svg {
        margin-right: 5px;
    }
`

const InfoText = styled.div`
    font-size: ${(props) => props.theme.font.small};
    margin-top: 10px;
    a {
        color: ${(props) => props.theme.colors.blueish};
        text-decoration: underline;
    }
    &.bigFont {
        font-size: ${(props) => props.theme.font.default};
    }
`
