import { useState, useMemo, useEffect } from 'react'
import { ethers } from 'ethers'
import { ArrowLeft, Info, AlertCircle } from 'react-feather'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'styled-components'
import { useTokenApproval, useProxyAddress, useActiveWeb3React } from '~/hooks'
import { getTokenLogo, formatWithCommas, formatNumber } from '~/utils'
import { useStoreState, useStoreActions } from '~/store'
import { shortStringDate, isEmptyObject } from '~/utils'
import { ApprovalState } from '~/hooks'
import TokenInput from '~/components/TokenInput'
import Button from '~/components/Button'

const DepositFunds = ({ ...props }) => {
    const { t } = useTranslation()
    //@ts-ignore
    const { colors } = useTheme()
    const navigate = useNavigate()
    const proxyAddress = useProxyAddress()

    const { account, isActive } = useActiveWeb3React()

    const [depositAmount, setDepositAmount] = useState('')

    const tokenPath = props.match.params.token as string
    const tokenSymbol = tokenPath.toUpperCase()

    const {
        safeModel: { liquidationData },
        connectWalletModel: { tokensData, tokensFetchedData, isWrongNetwork },
    } = useStoreState((state) => state)

    const { popupsModel: popupsActions } = useStoreActions((state) => state)

    const tokenData = tokensData?.[tokenSymbol]
    const tokenFetchedData = tokensFetchedData?.[tokenSymbol]

    const depositAssetUSDValue = formatNumber(
        liquidationData?.collateralLiquidationData?.[tokenSymbol]?.currentPrice?.value || '0'
    )

    const depositAssetBalance = useMemo(
        () => ethers.utils.formatEther(tokenFetchedData?.balanceE18 || '0'),
        [tokenFetchedData?.balanceE18]
    )

    const depositAmountUSDValue = useMemo(
        () =>
            depositAmount && depositAssetUSDValue
                ? formatNumber(String(Number(depositAmount) * Number(depositAssetUSDValue)))
                : '',
        [depositAmount, depositAssetUSDValue]
    )

    const [approvalState, approve] = useTokenApproval(
        depositAmount,
        tokenData?.address,
        proxyAddress,
        tokenFetchedData?.decimals,
        true
    )

    const shouldDisplayApproveButton = approvalState !== ApprovalState.APPROVED || Number(depositAmount) === 0
    const shouldDisplayConnectWalletButton = !account || !isActive

    const shouldDisableApproveButton = Number(depositAmount) === 0 || isWrongNetwork
    const shouldDisableDepositButton =
        approvalState !== ApprovalState.APPROVED || Number(depositAmount) === 0 || isWrongNetwork

    useEffect(() => {
        if (!isEmptyObject(tokensData) && !tokensData?.[tokenSymbol]?.isCollateral) {
            navigate('/404')
        }
    }, [history, tokenSymbol, tokensData])

    // TODO: Implement onDeposit function once contracts are ready
    const onDeposit = () => console.log('Deposit')

    const onInfoClick = () => console.log('Info')

    return (
        <Container>
            <Content>
                <InnerContainer>
                    <HeaderContainer>
                        <ArrowLeft size="24" onClick={() => navigate(-1)} cursor="pointer" />
                        <HeaderText>Deposit funds</HeaderText>
                    </HeaderContainer>
                    <HorizontalSeparator />
                    <InnerContainer style={{ marginBottom: 28 }}>
                        <InputLabel>{t('amount')}</InputLabel>
                        <TokenInput
                            token={
                                tokenData && {
                                    icon: getTokenLogo(tokenData.symbol),
                                    name: tokenData?.symbol,
                                }
                            }
                            label={`Balance: ${formatWithCommas(depositAssetBalance)} ${tokenData?.symbol}`}
                            rightLabel={`~$${formatWithCommas(depositAmountUSDValue)}`}
                            onChange={(e) => setDepositAmount(e)}
                            value={depositAmount}
                            handleMaxClick={() => setDepositAmount(depositAssetBalance)}
                        />
                    </InnerContainer>
                    <InnerContainer>
                        {/* TODO: Use real date values */}
                        <DateInfoContainer>
                            <DateInfoLabel>{t('pool_start_date')}</DateInfoLabel>
                            <DateInfoValue>{shortStringDate(1675234410000)}</DateInfoValue>
                        </DateInfoContainer>
                        <DateInfoContainer>
                            <DateInfoLabel>{t('current_date')}</DateInfoLabel>
                            <DateInfoValue>{shortStringDate(1675061610000)}</DateInfoValue>
                        </DateInfoContainer>
                        <DateInfoContainer>
                            <InnerContainer style={{ display: 'flex', alignItems: 'center' }}>
                                <DateInfoLabel>{t('tokens_will_be_unlocked')}</DateInfoLabel>
                                <Info
                                    size="16"
                                    color={colors.blueish}
                                    style={{ marginLeft: 6 }}
                                    cursor="pointer"
                                    onClick={onInfoClick}
                                />
                            </InnerContainer>
                            <DateInfoValue>{shortStringDate(1677653610000)}</DateInfoValue>
                        </DateInfoContainer>
                    </InnerContainer>
                    <WarningLabelContainer>
                        <InnerContainer style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <AlertCircle size="24" color={colors.yellowish} style={{ height: 'auto', marginTop: 1 }} />
                            <WarningLabel>{t('deposit_funds_warning')}</WarningLabel>
                        </InnerContainer>
                    </WarningLabelContainer>
                    <InnerContainer>
                        {shouldDisplayConnectWalletButton ? (
                            <Button
                                text="connect_wallet"
                                onClick={() => popupsActions.setIsConnectorsWalletOpen(true)}
                                style={{ width: '100%' }}
                                disabled={isWrongNetwork}
                            />
                        ) : (
                            <ButtonContainer>
                                {shouldDisplayApproveButton && (
                                    <Button
                                        text={t('approve_token', { symbol: tokenData?.symbol })}
                                        onClick={approve}
                                        style={{ width: '100%' }}
                                        disabled={shouldDisableApproveButton}
                                    />
                                )}
                                <Button
                                    text="deposit"
                                    onClick={onDeposit}
                                    style={{ width: '100%' }}
                                    disabled={shouldDisableDepositButton}
                                />
                            </ButtonContainer>
                        )}
                    </InnerContainer>
                </InnerContainer>
            </Content>
        </Container>
    )
}

const Container = styled.div`
    max-width: 498px;
    margin: 120px auto;
    padding: 0 15px;
    @media (max-width: 767px) {
        margin: 50px auto;
    }
`

const Content = styled.div`
    background-color: ${(props) => props.theme.colors.colorPrimary};
    border-radius: 20px;
    padding: 30px 32px;
`

const InnerContainer = styled.div``

const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
`

const DateInfoContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 5px;
`

const WarningLabelContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    background-color: ${(props) => `${props.theme.colors.yellowish}40`};
    border-radius: 6px;
    padding: 12px 14px 12px 14px;
    margin: 30px 0;
`

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 10px;
`

const WarningLabel = styled.p`
    font-size: ${(props) => props.theme.font.small};
    font-weight: 500;
    color: ${(props) => props.theme.colors.yellowish};
    margin-left: 6px;
    line-height: 18.2px;
`

const HeaderText = styled.span`
    flex-grow: 1;
    text-align: center;
    font-weight: 600;
    padding: 0 24px 0 0;
    font-size: ${(props) => props.theme.font.medium};
`

const HorizontalSeparator = styled.span`
    display: block;
    width: 100%;
    height: 0.5px;
    background-color: #00587e;
    margin: 26px 0;
`

const InputLabel = styled.h2`
    font-size: ${(props) => props.theme.font.default};
    font-weight: 600;
    color: ${(props) => props.theme.colors.neutral};
    margin-bottom: 10px;
`

const DateInfoLabel = styled.span`
    font-size: ${(props) => props.theme.font.small};
    color: ${(props) => props.theme.colors.secondary};
`

const DateInfoValue = styled.span`
    font-size: ${(props) => props.theme.font.small};
    font-weight: 600;
    color: ${(props) => props.theme.colors.neutral};
`

export default DepositFunds
