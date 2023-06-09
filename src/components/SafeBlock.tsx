import React from 'react'
import { toSvg } from 'jdenticon'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { formatNumber, returnState } from '../utils/helper'
import { jdenticonConfig, COIN_TICKER } from '../utils/constants'

const SafeBlock = ({ ...props }) => {
    const { t } = useTranslation()

    const collateral = formatNumber(props.collateral)
    const totalDebt = formatNumber(props.totalDebt)

    function createImage() {
        return {
            __html: toSvg(props.safeHandler + props.id, 25, jdenticonConfig),
        }
    }

    return (
        <Container className={props.className}>
            <Link to={`/safes/${props.id}`}>
                <BlockContainer
                    className={!returnState(props.riskState) ? 'empty' : ''}
                >
                    <BlockHeader>
                        <SafeInfo>
                            {<div dangerouslySetInnerHTML={createImage()} />}
                            <SafeData>
                                <SafeTitle>{`Safe #${props.id}`}</SafeTitle>
                            </SafeData>
                        </SafeInfo>

                        <SafeState
                            className={
                                returnState(props.riskState)
                                    ? returnState(props.riskState).toLowerCase()
                                    : 'dimmed'
                            }
                        >
                            <Circle />
                            <span>
                                {returnState(props.riskState) || 'No'}
                            </span>{' '}
                            {t('risk')}
                        </SafeState>
                    </BlockHeader>
                    <Block>
                        <Item>
                            <Label>{'ETH Deposited'}</Label>
                            <Value>{collateral}</Value>
                        </Item>
                        <Item>
                            <Label>{`${COIN_TICKER} Borrowed`}</Label>
                            <Value>{totalDebt}</Value>
                        </Item>
                        <Item>
                            <Label>{'Collateralization Ratio'}</Label>
                            <Value>{`${props.collateralRatio}%`}</Value>
                        </Item>
                        <Item>
                            <Label>{'Liquidation Price'}</Label>
                            <Value>${props.liquidationPrice}</Value>
                        </Item>
                    </Block>
                </BlockContainer>
            </Link>
        </Container>
    )
}

export default SafeBlock

const Container = styled.div``

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

const Circle = styled.div`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 5px;
    background: ${(props) => props.theme.colors.successColor};
`

const SafeState = styled.div`
    display: flex;
    align-items: center;
    color: ${(props) => props.theme.colors.customSecondary};
    font-size: ${(props) => props.theme.font.small};
    span {
        text-transform: capitalize;
        margin-right: 5px;
    }
    &.dimmed {
        color: ${(props) => props.theme.colors.secondary};
        ${Circle} {
            background: ${(props) => props.theme.colors.secondary};
        }
    }
    &.medium {
        ${Circle} {
            background: ${(props) => props.theme.colors.warningColor};
        }
    }
    &.high {
        ${Circle} {
            background: ${(props) => props.theme.colors.dangerColor};
        }
    }
    ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: ${(props) => props.theme.font.extraSmall};
    text-align:center;
  `}
    @media (max-width: 414px) {
        margin-top: 5px;
    }
`

const Block = styled.div`
    display: flex;
    position: absolute;
    right: 130px;
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
    margin: 0 10px;
    @media (max-width: 767px) {
        display: flex;

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
