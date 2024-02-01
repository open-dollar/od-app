import { useState, useMemo } from 'react'
import { ethers } from 'ethers'
import { ArrowLeft } from 'react-feather'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTokenBalanceInUSD, useTokenApproval, useProxyAddress } from '~/hooks'
import { getTokenLogo, formatWithCommas } from '~/utils'
import { useStoreState } from '../store'
import { shortStringDate } from '~/utils'
import { ApprovalState } from '~/hooks'
import TokenInput from './TokenInput'
import Button from './Button'

const DepositFunds = () => {
    const { t } = useTranslation()
    const history = useHistory()
    const proxyAddress = useProxyAddress()

    const [depositAmount, setDepositAmount] = useState('0')

    const {
        connectWalletModel: { tokensData, tokensFetchedData },
    } = useStoreState((state) => state)

    const tokenData = tokensData?.WSTETH
    const tokenFetchedData = tokensFetchedData?.WSTETH

    const depositAssetBalance = useMemo(
        () => ethers.utils.formatEther(tokenFetchedData?.balanceE18 || '0'),
        [tokenFetchedData?.balanceE18]
    )

    const depositAssetUSDValue = useTokenBalanceInUSD('WETH', depositAssetBalance)

    const [approvalState, approve] = useTokenApproval(
        depositAmount,
        tokenData?.address,
        proxyAddress,
        tokenFetchedData?.decimals,
        true
    )

    return (
        <Container>
            <InnerContainer>
                <HeaderContainer>
                    <ArrowLeft
                        size="24"
                        onClick={() => history.goBack()}
                        cursor="pointer"
                    />
                    <HeaderText>Deposit funds</HeaderText>
                </HeaderContainer>
                <HorizontalSeparator />
                <InnerContainer style={{ marginBottom: 32 }}>
                    <InputLabel>{t('amount')}</InputLabel>
                    <TokenInput
                        token={
                            tokensData?.WSTETH && {
                                icon: getTokenLogo(tokensData.WSTETH.symbol),
                                name: tokensData.WSTETH?.symbol,
                            }
                        }
                        label={`Balance: ${formatWithCommas(depositAssetBalance)} ${tokensData?.WSTETH?.symbol}`}
                        rightLabel={`~$${formatWithCommas(depositAssetUSDValue)}`}
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
                        <DateInfoLabel>{t('tokens_will_be_unlocked')}</DateInfoLabel>
                        <DateInfoValue>{shortStringDate(1677653610000)}</DateInfoValue>
                    </DateInfoContainer>
                </InnerContainer>
                <WarningLabelContainer>
                    <InnerContainer style={{ display: 'flex' }}>
                        <WarningBang>!</WarningBang>
                        <WarningLabel>{t('deposit_funds_warning')}</WarningLabel>
                    </InnerContainer>
                </WarningLabelContainer>
                <ButtonContainer>
                    {(approvalState !== ApprovalState.APPROVED || Number(depositAmount) === 0) && (
                        <Button
                            text={t('approve_token', { symbol: tokensData?.WSTETH?.symbol })}
                            onClick={() => approve()}
                            style={{ width: '100%' }}
                            disabled={Number(depositAmount) === 0}
                        />
                    )}
                    <Button
                        text="deposit"
                        onClick={() => {
                            console.log('Deposit funds')
                        }}
                        style={{ width: '100%' }}
                        disabled={approvalState !== ApprovalState.APPROVED || Number(depositAmount) === 0}
                    />
                </ButtonContainer>
            </InnerContainer>
        </Container>
    )
}

const Container = styled.div`
    background-color: ${(props) => props.theme.colors.colorPrimary};
    border-radius: 20px;
    max-width: 498px;
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
    padding: 12px 24px;
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
    margin-left: 24px;
    line-height: 1.2;
`

const WarningBang = styled.span`
    position: absolute;
    align-items: center;
    text-align: center;
    line-height: 1.1;
    font-size: 10px;
    font-weight: 900;
    color: ${(props) => props.theme.colors.yellowish};
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border: 2px;
    border-style: solid;
    border-color: ${(props) => props.theme.colors.yellowish};
`

const HeaderText = styled.span`
    flex-grow: 1;
    text-align: center;
    font-weight: 600;
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
