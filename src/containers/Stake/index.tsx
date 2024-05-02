import styled from 'styled-components'
import Camelot from '~/components/Icons/Camelot'
import LinkButton from '~/components/LinkButton'
import { getTokenLogo } from '~/utils'

const Stake = () => {
    return (
        <Container>
            <Title>Earn</Title>
            <Pools>
                <BlockContainer>
                    <BlockHeader>
                        <PoolInfo>
                            <PoolData>
                                <PoolTitle>OD-ETH</PoolTitle>
                                <img src={getTokenLogo('OD')} alt={''} width={'50px'} />
                                <img src={getTokenLogo('ETH')} alt={''} width={'50px'} />
                            </PoolData>
                        </PoolInfo>
                        <ExternalLink href="" target="_blank">
                            <Camelot />
                            VIEW ON CAMELOT EXCHANGE
                        </ExternalLink>
                    </BlockHeader>
                    <Block>
                        <Item>
                            <Label>Status</Label>
                            <Value>Active</Value>
                        </Item>
                        <Item>
                            <Label>TVL</Label>
                            <Value>$120,000</Value>
                        </Item>
                        <Item>
                            <Label>APR</Label>
                            <Value>134.99%</Value>
                        </Item>
                        <Item>
                            <Label>Rewards</Label>
                            <Value>ST-OD-ARB</Value>
                        </Item>
                    </Block>
                </BlockContainer>
            </Pools>
        </Container>
    )
}

const Container = styled.div`
    max-width: 1362px;
    margin: 80px auto;
    padding: 0 15px;
    @media (max-width: 767px) {
        margin: 50px auto;
    }
`

const Title = styled.h2`
    font-size: 34px;
    font-weight: 700;
    font-family: ${(props) => props.theme.family.headers};

    margin-bottom: 30px;

    color: ${(props) => props.theme.colors.accent};
`

const ExternalLink = styled.a`
    display: flex;
    align-items: center;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 700;
    font-size: 14px;
    color: ${(props) => props.theme.colors.primary};
`

const Pools = styled.div``

const BlockContainer = styled.div`
    border-radius: 4px;
    margin-bottom: 29px;
    background: white;
    box-shadow: 0px 4px 6px 0px #0d4b9d33;
    position: relative;
    display: flex;
    flex-direction: column;
    &.empty {
        background: white;
    }
`

const BlockHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #1c293a33;
    padding-left: 34px;
    padding-top: 22px;
    padding-bottom: 11px;
    padding-right: 34px;
`

const PoolInfo = styled.div`
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

const PoolData = styled.div`
    display: flex;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-left: 10px;
  `}
`

const PoolTitle = styled.div`
    font-size: ${(props) => props.theme.font.large};
    font-family: ${(props) => props.theme.family.headers};
    color: ${(props) => props.theme.colors.accent};
    font-weight: 700;

    margin-right: 22px;

    span {
        font-weight: 500;
        color: ${(props) => props.theme.colors.primary};
    }
`

const Block = styled.div`
    display: flex;
    justify-content: space-between;

    padding-left: 34px;
    padding-top: 19px;
    padding-bottom: 22px;
    padding-right: 34px;

    ${({ theme }) => theme.mediaWidth.upToSmall`
           display: block;
           margin-top: 10px;
           &:last-child {
                border-bottom: 0;
           }
    `}
`

const Item = styled.div`
    min-width: 150px;
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

    &.low div:last-child {
        color: #459d00;
    }

    &.elevated div:last-child {
        color: #ffaf1d;
    }

    &.high div:last-child {
        color: #e75966;
    }

    &.liquidation div:last-child {
        color: #e75966;
    }
`

const Label = styled.div`
    font-size: ${(props) => props.theme.font.default};
    color: ${(props) => props.theme.colors.tertiary};
    font-weight: 400;
    @media (max-width: 767px) {
        font-size: ${(props) => props.theme.font.small};
    }
`

const Value = styled.div`
    font-size: ${(props) => props.theme.font.default};
    color: ${(props) => props.theme.colors.accent};
    font-weight: 700;
    @media (max-width: 767px) {
        font-size: ${(props) => props.theme.font.small};
    }
`

export default Stake
