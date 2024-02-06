import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { getTokenLogo } from '~/utils'

interface DepositBlockProps {
    ticker: string
    tvl: number
    apr: number
    userDeposit?: string
    userRewards?: string
}

const DepositBlock = (props: DepositBlockProps) => {
    const { t } = useTranslation()

    return (
        <Container>
            <Link to={`/deposit/${props.ticker.toLowerCase()}`}>
                <BlockContainer>
                    <BlockHeader>
                        <SafeInfo>
                            <img src={getTokenLogo(props.ticker)} alt={props.ticker} width={'24px'} height={'24px'} />
                            <SafeData>
                                <SafeTitle>{props.ticker}</SafeTitle>
                            </SafeData>
                        </SafeInfo>
                    </BlockHeader>
                    <Block>
                        <Item>
                            <Label>{t('tvl')}</Label>
                            <Value>{props.tvl}</Value>
                        </Item>
                        <Item>
                            <Label>{t('apr')}</Label>
                            <Value>{props.apr}</Value>
                        </Item>
                        <Item>
                            <Label>{t('your_deposit')}</Label>
                            <Value>
                                {props.userDeposit} {props.ticker}
                            </Value>
                        </Item>
                        <Item>
                            <Label>{t('your_rewards')}</Label>
                            <Value>{props.userRewards} ODG</Value>
                        </Item>
                    </Block>
                </BlockContainer>
            </Link>
        </Container>
    )
}

export default DepositBlock

const Container = styled.div`
    transition: opacity 0.2s ease;
    &:hover {
        opacity: 0.9;
    }
`

const BlockContainer = styled.div`
    padding: 20px;
    border-radius: 15px;
    margin-bottom: 15px;
    background: ${(props) => props.theme.colors.colorPrimary};
    position: relative;
    &.empty {
        background: #1e3b58;
    }
`

const BlockHeader = styled.div`
    display: flex;
    justify-content: space-between;
`

const SafeInfo = styled.div`
    display: flex;
    align-items: center;
    svg {
        border-radius: ${(props) => props.theme.global.borderRadius};
        border: 1px solid ${(props) => props.theme.colors.border};
        ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 25px;
    height: 25px;
  `}
    }
`

const SafeData = styled.div`
    margin-left: 16px;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-left: 10px;
  `}
`

const SafeTitle = styled.div`
    font-size: ${(props) => props.theme.font.small};
    color: ${(props) => props.theme.colors.primary};
    letter-spacing: -0.33px;
    line-height: 22px;
    font-weight: 600;
`

const Block = styled.div`
    display: flex;
    position: absolute;
    right: 7px;
    top: 13px;
    @media (max-width: 767px) {
        position: static;
        display: block;
        margin-top: 10px;
        &:last-child {
            border-bottom: 0;
        }
    }
`

const Item = styled.div`
    margin: 0 12px;
    text-align: end;
    @media (max-width: 767px) {
        display: flex;
        width: auto;
        align-items: center;
        justify-content: space-between;
        margin: 0 0 3px 0;
        &:last-child {
            margin-bottom: 0;
        }
    }
`

const Label = styled.div`
    font-size: 13px;
    color: ${(props) => props.theme.colors.secondary};
    letter-spacing: -0.09px;
    line-height: 21px;
    @media (max-width: 767px) {
        font-size: ${(props) => props.theme.font.small};
    }
`

const Value = styled.div`
    font-size: 13px;
    color: ${(props) => props.theme.colors.primary};
    letter-spacing: -0.09px;
    line-height: 21px;
    font-weight: 600;
    @media (max-width: 767px) {
        font-size: ${(props) => props.theme.font.small};
    }
`
