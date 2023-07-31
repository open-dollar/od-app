import styled from 'styled-components'

import { formatNumber } from '~/utils'

const Results = ({ amount, ethBalance }: { amount: string; ethBalance?: string }) => {
    return (
        <Result>
            <Block>
                {ethBalance && (
                    <Item>
                        <Label>ETH Balance</Label>
                        <Value>{`${formatNumber(ethBalance, 4)}`}</Value>
                    </Item>
                )}
                {!ethBalance && (
                    <Item>
                        <Label>WETH to Receive</Label>
                        <Value>{`${formatNumber(amount, 4)}`}</Value>
                    </Item>
                )}
            </Block>
        </Result>
    )
}

export default Results

const Result = styled.div`
    margin-top: 20px;
    border-radius: ${(props) => props.theme.global.borderRadius};
    border: 1px solid ${(props) => props.theme.colors.border};
    background: ${(props) => props.theme.colors.foreground};
`

const Block = styled.div`
    border-bottom: 1px solid;
    padding: 16px 20px;
    border-bottom: 1px solid ${(props) => props.theme.colors.border};
    &:last-child {
        border-bottom: 0;
    }
`

const Item = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    &:last-child {
        margin-bottom: 0;
    }
`

const Label = styled.div`
    font-size: ${(props) => props.theme.font.small};
    color: ${(props) => props.theme.colors.secondary};
    letter-spacing: -0.09px;
    line-height: 21px;
`

const Value = styled.div`
    font-size: ${(props) => props.theme.font.small};
    color: ${(props) => props.theme.colors.primary};
    letter-spacing: -0.09px;
    line-height: 21px;
    font-weight: 600;
`
