import styled from 'styled-components'
import { Tooltip as ReactTooltip } from 'react-tooltip'

const QuestBlock = ({ title, text, items, button }: { title: any; text: any; items: any; button: any }) => {
    return (
        <BlockContainer>
            <BlockHeader>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
                    <QuestTitle>{title}</QuestTitle>
                    <div style={{ display: 'flex', gap: '10px' }}>{button}</div>
                </div>
                <BlockDescription>{text}</BlockDescription>
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

const BlockContainer = styled.div`
    border-radius: 4px;
    margin-bottom: 30px;
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
    align-items: center;
    border-bottom: 1px solid #1c293a33;
    padding-left: 34px;
    padding-top: 22px;
    padding-right: 34px;

    ${({ theme }) => theme.mediaWidth.upToSmall`
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    `}
`

const BlockDescription = styled.div`
    font-size: ${(props) => props.theme.font.default};
    color: ${(props) => props.theme.colors.tertiary};
    font-weight: 400;
    margin-top: 20px;
    margin-bottom: 20px;
    line-height: 1.5;
    ${({ theme }) => theme.mediaWidth.upToSmall`
        margin-top: 10px;
    `}
`

const QuestTitle = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${(props) => props.theme.font.large};
    font-family: ${(props) => props.theme.family.headers};
    color: ${(props) => props.theme.colors.accent};
    font-weight: 700;

    margin-right: 22px;

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
    margin-left: 10px;

`}
`

const Block = styled.div`
    display: flex;
    justify-content: start;

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
    min-width: 200px;
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
    display: flex;
    gap: 10px;
    min-height: 37px;
    @media (max-width: 767px) {
        font-size: ${(props) => props.theme.font.small};
    }

    display: flex;
    align-items: end;

    &.status {
        color: #459d00;
        font-weight: 400;
        border: 1px solid #459d00;
        border-radius: 50px;
        width: fit-content;
        padding: 4px 15px;
    }
`
