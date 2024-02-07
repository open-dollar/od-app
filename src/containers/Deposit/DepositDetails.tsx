import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'styled-components'
import { useHistory } from 'react-router-dom'
import { ArrowLeft } from 'react-feather'
import styled from 'styled-components'
import { useNitroPool } from '~/hooks'
import { useStoreState } from '~/store'
import { ParsedNitroPool } from '~/types'
import { getTokenLogo, getCompactFiatValue, formatNumber, msToCalendrical, getParsedNitroPool } from '~/utils'
import StatusPill from '~/components/StatusPill'
import { DepositDetailCard, DepositCardText, DepositCardSecondaryText } from '~/components/Deposit'

const DepositDetails = ({ ...props }) => {
    const tokenPath = props.match.params.token as string
    const tokenSymbol = tokenPath.toUpperCase()
    const history = useHistory()

    const [{ pool, status, authorizations, requirements }, setParsedPoolDetails] = useState<ParsedNitroPool>({})

    const { t } = useTranslation()
    const { colors } = useTheme()

    const {
        depositModel: { depositTokens },
    } = useStoreState((state) => state)

    const { poolDetails } = useNitroPool()

    const tokenPoolDetails = poolDetails[tokenSymbol]

    useEffect(() => {
        if (!depositTokens.has(tokenSymbol)) {
            props.history.push('/404')
        }
    }, [depositTokens, poolDetails, props.history, tokenSymbol])

    useEffect(() => {
        const interval = setInterval(() => {
            setParsedPoolDetails(getParsedNitroPool(tokenPoolDetails))
        }, 1000)

        return () => clearInterval(interval)
    }, [poolDetails, tokenPoolDetails, tokenSymbol])

    // Set initial countdown on mount before interval is kicked off
    useEffect(() => {
        setParsedPoolDetails(getParsedNitroPool(tokenPoolDetails))
    }, [tokenPoolDetails])

    const getCountdownString = (remainingTimeMs: number): React.ReactNode => {
        const { days, hours, minutes, seconds } = msToCalendrical(remainingTimeMs)
        if (!days && !hours && !minutes && !seconds) return ''

        return (
            <Flex>
                <DepositCardText>
                    {days}
                    <DepositCardSecondaryText>D&nbsp;</DepositCardSecondaryText>
                </DepositCardText>
                <DepositCardText>
                    {hours}
                    <DepositCardSecondaryText>h&nbsp;</DepositCardSecondaryText>
                </DepositCardText>
                <DepositCardText>
                    {minutes}
                    <DepositCardSecondaryText>min&nbsp;</DepositCardSecondaryText>
                </DepositCardText>
                <DepositCardText>
                    {seconds}
                    <DepositCardSecondaryText>sec&nbsp;</DepositCardSecondaryText>
                </DepositCardText>
            </Flex>
        )
    }

    const msToMonthDayString = (ms: number): React.ReactNode => {
        const { months, days } = msToCalendrical(ms)
        if (!months && !days) return ''

        return (
            <Flex>
                {months > 0 && (
                    <DepositCardText>
                        {months} <DepositCardSecondaryText>months&nbsp;</DepositCardSecondaryText>
                    </DepositCardText>
                )}
                {days > 0 && (
                    <DepositCardText>
                        {days} <DepositCardSecondaryText>days&nbsp;</DepositCardSecondaryText>
                    </DepositCardText>
                )}
            </Flex>
        )
    }

    const formatDate = (dateStr: number): string => {
        const d = new Date(dateStr)
        return `${d.toLocaleDateString()}, ${d.toLocaleTimeString()}`
    }

    const getStatusPill = (activeText: string, inactiveText: string, isActive?: boolean): React.ReactNode => {
        if (isActive === undefined) return ''

        return (
            <StatusPill status={isActive ? 'enabled' : 'disabled'} text={isActive ? t(activeText) : t(inactiveText)} />
        )
    }

    return (
        <MainContainer>
            <Header>
                <Flex style={{ marginBottom: 22, cursor: 'pointer' }} onClick={() => history.goBack()}>
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
                        { title: t('total_value_locked'), content: getCompactFiatValue(pool?.tvl || 0) },
                        { title: t('apr'), content: formatNumber(String(pool?.apr), 2) + '%' },
                        {
                            title: t('pending_rewards'),
                            content: `${formatNumber(String(pool?.pendingRewards || 0))} ODG`,
                        },
                    ]}
                />
                <DepositDetailCard
                    values={[
                        { title: t('status'), content: getStatusPill('active', 'inactive', status?.isActive) },
                        { title: t('duration'), content: status?.duration && msToMonthDayString(status.duration) },
                        { title: t('end_in'), content: status?.endIn && getCountdownString(status.endIn) },
                    ]}
                />
                <DepositDetailCard
                    values={[
                        {
                            title: t('deposits'),
                            content: getStatusPill('enabled', 'disabled', authorizations?.depositsEnabled),
                        },
                        {
                            title: t('deposit_end_time'),
                            content: authorizations?.depositsEndIn && getCountdownString(authorizations.depositsEndIn),
                        },
                        {
                            title: t('harvests'),
                            content: getStatusPill('enabled', 'disabled', authorizations?.harvestsEnabled),
                        },
                    ]}
                />
                <DepositDetailCard
                    values={[
                        {
                            title: t('minimum_lock'),
                            content: requirements?.lockDuration && msToMonthDayString(requirements.lockDuration),
                        },
                        {
                            title: t('locked_until'),
                            content: requirements?.lockUntil && formatDate(requirements?.lockUntil),
                        },
                        { title: t('whitelist'), content: requirements?.whitelist },
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

const Flex = styled.div`
    display: flex;
    align-items: center;
`

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
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

const SecondaryText = styled.p`
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: ${(props) => props.theme.colors.secondary};
`
