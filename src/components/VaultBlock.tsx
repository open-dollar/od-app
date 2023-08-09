import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { returnState, COIN_TICKER, TOKEN_LOGOS } from '~/utils'

const VaultBlock = ({ ...props }) => {
    const formatWithCommas = (value: string) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 8,
        }).format(Number.parseFloat(value))
    }

    return (
        <Container className={props.className}>
            <Link to={`/vaults/${props.id}/deposit`}>
                <BlockContainer className={!returnState(props.riskState) ? 'empty' : ''}>
                    <BlockHeader>
                        <SafeInfo>
                            <img
                                src={TOKEN_LOGOS[props.collateralName]}
                                alt={props.collateralName}
                                width={'24px'}
                                height={'24px'}
                            />
                            <SafeData>
                                <SafeTitle>{`Vault #${props.id}`}</SafeTitle>
                            </SafeData>
                        </SafeInfo>
                    </BlockHeader>
                    <Block>
                        <Item>
                            <Label>{`${props.collateralName} Deposited`}</Label>
                            <Value>{formatWithCommas(props.collateral)}</Value>
                        </Item>
                        <Item>
                            <Label>{`${COIN_TICKER} Borrowed`}</Label>
                            <Value>{formatWithCommas(props.totalDebt)}</Value>
                        </Item>
                        <Item>
                            <Label>{'Collateral Ratio'}</Label>
                            <Value>{`${formatWithCommas(props.collateralRatio)}%`}</Value>
                        </Item>
                        <Item>
                            <Label>{'Liquidation Price'}</Label>
                            <Value>${formatWithCommas(props.liquidationPrice)}</Value>
                        </Item>
                        <Item
                            className={
                                returnState(props.riskState) ? returnState(props.riskState).toLowerCase() : 'dimmed'
                            }
                        >
                            <Label>{'Risk'}</Label>
                            <Wrapper>
                                <Circle
                                    data-tip={`${
                                        returnState(props.riskState) ? returnState(props.riskState) : 'No'
                                    } Risk`}
                                    className={
                                        returnState(props.riskState)
                                            ? returnState(props.riskState).toLowerCase()
                                            : 'dimmed'
                                    }
                                />{' '}
                                <div>{returnState(props.riskState) ? returnState(props.riskState) : 'No'}</div>
                            </Wrapper>
                        </Item>
                    </Block>
                </BlockContainer>
            </Link>
        </Container>
    )
}

export default VaultBlock

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

const Wrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: #dadada;
    font-size: 14px;
    font-weight: 400;
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

const Circle = styled.div`
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: ${(props) => props.theme.colors.successColor};
    margin-right: 5px;
    cursor: pointer;
    &.dimmed {
        background: ${(props) => props.theme.colors.secondary};
    }
    &.medium {
        background: ${(props) => props.theme.colors.yellowish};
    }
    &.high {
        background: ${(props) => props.theme.colors.dangerColor};
    }
    &.liquidation {
        background: ${(props) => props.theme.colors.dangerColor};
    }
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
