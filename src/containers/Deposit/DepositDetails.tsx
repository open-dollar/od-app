import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'styled-components'
import styled from 'styled-components'
import { useNitroPool } from '~/hooks'
import { useStoreState } from '~/store'
import { getTokenLogo, getCompactFiatValue, formatNumber, getDateCountdown } from '~/utils'
import { ArrowLeft } from 'react-feather'

interface DepositDetailsProps {
    values: { title: string; content: React.ReactNode | string | number }[]
}

const DepositDetailCard = ({ values }: DepositDetailsProps) => {
    return (
        <InformationCard>
            {values.map((value, index) => (
                <Container key={index}>
                    <InfoCardTitle>{value.title.toUpperCase()}</InfoCardTitle>
                    <InfoCardText>{value.content ? value.content : '-'}</InfoCardText>
                </Container>
            ))}
        </InformationCard>
    )
}

const DepositDetails = ({ ...props }) => {
    const tokenPath = props.match.params.token as string
    const tokenSymbol = tokenPath.toUpperCase()

    const [depositEndTimeCountdown, setDepositEndTimeCountdown] = useState('')
    const [endTimeCountdown, setEndTimeCountdown] = useState('')

    const { t } = useTranslation()
    const { colors } = useTheme()

    const {
        depositModel: { depositTokens },
    } = useStoreState((state) => state)

    const { poolDetails } = useNitroPool()

    const tokenPoolDetails = poolDetails[tokenSymbol]
    const userDepositInfo = tokenPoolDetails?.userInfo
    const poolSettings = tokenPoolDetails?.settings

    const formatCountDown = useCallback((unixDate: number) => {
        const { days, hours, minutes, seconds } = getDateCountdown(unixDate * 1000)
        return `${days}D ${hours}h ${minutes}min ${seconds}sec`
    }, [])

    useEffect(() => {
        if (!depositTokens.has(tokenSymbol)) {
            props.history.push('/404')
        }
    }, [depositTokens, poolDetails, props.history, tokenSymbol])

    useEffect(() => {
        const interval = setInterval(() => {
            if (poolSettings?.endTime?.toNumber())
                setEndTimeCountdown(formatCountDown(poolSettings.endTime?.toNumber()))
            if (poolSettings?.depositEndTime?.toNumber())
                setDepositEndTimeCountdown(formatCountDown(poolSettings.depositEndTime?.toNumber()))
        }, 1000)

        return () => clearInterval(interval)
    }, [formatCountDown, poolDetails, poolSettings?.depositEndTime, poolSettings?.endTime, tokenSymbol])

    return (
        <MainContainer>
            <Header>
                <Flex style={{ marginBottom: 22 }}>
                    <ArrowLeft height={16} style={{ height: 'auto', color: colors.secondary }} />
                    <SecondaryText>{t('back')}</SecondaryText>
                </Flex>
                <Flex>
                    <img
                        src={getTokenLogo(tokenSymbol)}
                        alt={tokenSymbol}
                        width={48}
                        style={{ height: 'auto', marginRight: 10 }}
                    />
                    <Title>{tokenSymbol}</Title>
                </Flex>
            </Header>
            <Grid>
                <DepositDetailCard
                    values={[
                        { title: t('total_value_locked'), content: getCompactFiatValue(tokenPoolDetails?.tvl) },
                        { title: t('apr'), content: formatNumber(String(tokenPoolDetails?.apy), 2) + '%' },
                        {
                            title: t('pending_rewards'),
                            content: `${formatNumber(userDepositInfo?.pendingRewardsToken1?.toString() || '0', 2)} ODG`,
                        },
                    ]}
                />
                <DepositDetailCard
                    values={[
                        { title: t('status'), content: 'TODO' },
                        { title: t('duration'), content: 'TODO' },
                        { title: t('end_in'), content: endTimeCountdown },
                    ]}
                />
                <DepositDetailCard
                    values={[
                        { title: t('deposits'), content: 'TODO' },
                        { title: t('deposit_end_time'), content: depositEndTimeCountdown },
                        { title: t('harvests'), content: 'TODO' },
                    ]}
                />
                <DepositDetailCard
                    values={[
                        { title: t('minimum_lock'), content: 'TODO' },
                        { title: t('locked_until'), content: 'TODO' },
                        { title: t('whitelist'), content: '-' },
                    ]}
                />
            </Grid>
        </MainContainer>
    )
}

export default DepositDetails

const MainContainer = styled.div`
    max-width: 880px;
    margin: 80px auto;
    padding: 0 15px;
    @media (max-width: 767px) {
        margin: 50px auto;
    }
`

const Container = styled.div``

const Flex = styled.div`
    display: flex;
    align-items: center;
`

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
`

const InformationCard = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: ${(props) => props.theme.colors.colorPrimary};
    height: 224px;
    padding: 20px;
    border-radius: 8px;
`

const Header = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 40px;
`

const Title = styled.div`
    font-weight: 700;
    font-size: 34px;
    line-height: 40px;
`

const InfoCardTitle = styled.p`
    font-weight: 600;
    font-size: 12px;
    line-height: 16px
    color: ${(props) => props.theme.colors.secondary};
`

const InfoCardText = styled.h3`
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
    color: ${(props) => props.theme.colors.primary};
`

const SecondaryText = styled.p`
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: ${(props) => props.theme.colors.secondary};
`
