import { Link } from 'react-router-dom'
import { Info } from 'react-feather'
import styled from 'styled-components'
import { formatWithCommas, getTokenLogo } from '~/utils'
import { Tooltip as ReactTooltip } from 'react-tooltip'

const PoolBlock = ({
    poolAddress,
    apy,
    link,
    nitroPoolData,
}: {
    poolAddress: string
    apy: string
    link: string
    nitroPoolData: any
}) => {
    const { collateralTokens, rewardTokens, tvl, settings } = nitroPoolData

    const getTimePeriod = () => {
        const start = new Date(Number(settings.startTime) * 1000)
        const end = new Date(Number(settings.endTime) * 1000)
        const now = new Date()
        return now > start && now < end ? 'Active' : 'Inactive'
    }

    return (
        <Link to={`/earn/${poolAddress}`}>
            <BlockContainer id={`${poolAddress}`}>
                <BlockHeader>
                    <PoolInfo>
                        <PoolData>
                            <PoolTitle>{`${collateralTokens[0]?.symbol} - ${collateralTokens[1]?.symbol}`}</PoolTitle>
                            <img src={getTokenLogo(collateralTokens[0]?.symbol)} alt={''} width={'50px'} />
                            <img src={getTokenLogo(collateralTokens[1]?.symbol)} alt={''} width={'50px'} />
                        </PoolData>
                    </PoolInfo>
                </BlockHeader>
                <Block>
                    <Item>
                        <Label>Status</Label>
                        <Value className="status">
                            <Dot></Dot>
                            {getTimePeriod()}
                        </Value>
                    </Item>
                    <Item>
                        <Label>TVL</Label>
                        <Value>${formatWithCommas(tvl?.toFixed(2) || 0)}</Value>
                    </Item>
                    <Item className="apy">
                        <Label>
                            APR{' '}
                            <InfoIcon data-tooltip-id="apy" data-tooltip-content={'APY is updated every 24 hours'}>
                                <Info size={'20px'} />
                            </InfoIcon>
                        </Label>
                        <Value>{apy}</Value>
                    </Item>
                    <Item>
                        <Label>Rewards</Label>
                        <Value>
                            {rewardTokens?.map((token: { symbol: string }, i: number) => {
                                if (i === rewardTokens.length - 1) {
                                    return token.symbol
                                }
                                return `${token.symbol}, `
                            })}
                        </Value>
                    </Item>
                </Block>
                <ReactTooltip
                    style={{ backgroundColor: '#1A74EC' }}
                    id={`apy`}
                    variant="dark"
                    data-effect="solid"
                    place="top"
                />
            </BlockContainer>
        </Link>
    )
}

export default PoolBlock

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

    ${({ theme }) => theme.mediaWidth.upToSmall`
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    `}
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

    ${({ theme }) => theme.mediaWidth.upToSmall`
        display: flex;
        flex-direction: column;
    `}
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
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    @media (max-width: 767px) {
        display: flex;
        flex-direction: row;
        width: auto;
        align-items: center;
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
    display: flex;
    gap: 10px;
    align-items: center;
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

    display: flex;
    align-items: center;

    &.status {
        color: #459d00;
        font-weight: 400;
        border: 1px solid #459d00;
        border-radius: 50px;
        width: fit-content;
        padding: 4px 15px;
    }
`

const Dot = styled.div`
    width: 6px;
    height: 6px;
    background-color: #459d00;
    border-radius: 100%;
    margin-right: 5px;
`

const InfoIcon = styled.div`
    cursor: pointer;
`
