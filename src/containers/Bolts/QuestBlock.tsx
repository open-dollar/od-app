import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { formatWithCommas, getTokenLogo } from '~/utils'
import { Tooltip as ReactTooltip } from 'react-tooltip'

const QuestBlock = ({ title, text, items, button }: { title: any; text: any; items: any; button: any }) => {
    return (
        <BlockContainer>
            <BlockHeader>
                <QuestInfo>
                    <QuestData>
                        <QuestTitle>{title}</QuestTitle>
                    </QuestData>
                </QuestInfo>
                <div style={{ display: 'flex', gap: '10px' }}>{button}</div>
            </BlockHeader>
            <Block>
                {items.map((item: any, index: string) => (
                    <Item key={index}>
                        <Label>{item.title}</Label>
                        <Value>{item.status}</Value>
                    </Item>
                ))}
            </Block>
            <ReactTooltip
                style={{ backgroundColor: '#1A74EC' }}
                id={`apy`}
                variant="dark"
                data-effect="solid"
                place="top"
            />
        </BlockContainer>
    )
}

export default QuestBlock

const ExternalLink = styled.a`
    display: flex;
    align-items: center;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 700;
    font-size: 14px;
    color: ${(props) => props.theme.colors.primary};
`

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

const QuestInfo = styled.div`
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

const QuestData = styled.div`
    display: flex;
    ${({ theme }) => theme.mediaWidth.upToSmall`
        margin-left: 10px;
    `}
`

const QuestTitle = styled.div`
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
