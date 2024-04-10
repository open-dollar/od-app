import { ReactNode } from 'react'
import { Info } from 'react-feather'
import styled from 'styled-components'

export interface DataCardProps {
    title: string
    value: string
    description?: string
    bg: 'light' | 'dark'
    children?: React.ReactChildren | React.ReactChild
}

const DataCard = ({ title, bg, value, description, children }: DataCardProps) => {
    return (
        <Block bg={bg}>
            {description && (
                <InfoIcon data-tooltip-id="analitics" data-tooltip-content={description}>
                    <Info size="20" />
                </InfoIcon>
            )}
            <DataTitle bg={bg}>{title}</DataTitle>
            <DataValue>{value}</DataValue>
            {children}
        </Block>
    )
}

export default DataCard

const Block = styled.div<{ bg: 'light' | 'dark'; children: ReactNode }>`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 48px 0px;
    border: ${(props) => (props.bg === 'light' ? '3px solid #1A74EC' : '3px solid #ffffff')};
    box-shadow: ${(props) =>
        props.bg === 'light'
            ? `6px 6px 0px 0px #1A74EC, 5px 5px 0px 0px #1A74EC, 4px 4px 0px 0px #1A74EC, 3px 3px 0px 0px #1A74EC, 2px 2px 0px 0px #1A74EC, 1px 1px 0px 0px #1A74EC`
            : `6px 6px 0px 0px #ffffff, 5px 5px 0px 0px #ffffff, 4px 4px 0px 0px #ffffff, 3px 3px 0px 0px #ffffff,
        2px 2px 0px 0px #ffffff, 1px 1px 0px 0px #ffffff`};

    width: 100%;
    height: 100%;
    border-radius: 8px;
    color: ${(props) => (props.bg === 'light' ? props.theme.colors.primary : 'white')};
    background: ${(props) => (props.bg === 'light' ? 'white' : props.theme.colors.primary)};

    ${({ theme }) => theme.mediaWidth.upToSmall`
        max-width: 100%;
    `}

    & img {
        margin-bottom: 32px;
    }
`

export const InfoIcon = styled.div`
    cursor: pointer;
    position: absolute;
    right: 12px;
    top: 12px;
    svg {
        color: ${(props) => props.theme.colors.blueish};
        position: relative;
        top: 2px;
        margin-right: 5px;
    }
`

const DataTitle = styled.div<{ bg: 'light' | 'dark' }>`
    font-size: ${(props) => props.theme.font.xSmall};
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 8px;
    text-align: center;
    color: ${(props) => (props.bg === 'light' ? props.theme.colors.accent : 'white')};
`

const DataValue = styled.div`
    font-size: 24px;
    font-weight: 700;
    text-align: center;
    line-height: 28.8px;
`
