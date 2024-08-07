import styled from 'styled-components'
import { Tooltip as ReactTooltip } from 'react-tooltip'

interface Item {
    title: string
    status: string
}

const QuestBlock = ({ title, text, items, button }: { title: any; text: any; items: any; button: any }) => {
    return (
        <BlockContainer>
            <BlockHeader>
                <HeaderLeft>
                    <QuestTitle>{title}</QuestTitle>
                    <BlockDescription>{text}</BlockDescription>
                </HeaderLeft>
                <QuestBtn>{button}</QuestBtn>
            </BlockHeader>
            <Block>
                {items.map((item: Item, index: number) => (
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

    &.empty {
        background: white;
    }
`

const BlockHeader = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    border-bottom: 1px solid #1c293a33;
    padding-left: 34px;
    padding-top: 22px;
    padding-right: 34px;

    ${({ theme }) => theme.mediaWidth.upToSmall`
        flex-direction: column;
        padding-bottom: 20px;
    `};
`

const HeaderLeft = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`

const QuestBtn = styled.div`
    display: flex;
    gap: 10px;
    height: 42px;

    ${({ theme }) => theme.mediaWidth.upToSmall`
        width: 100%;
    `};
`

const BlockDescription = styled.div`
    font-size: ${(props) => props.theme.font.default};
    color: ${(props) => props.theme.colors.tertiary};
    font-weight: 400;
    margin-top: 8px;
    margin-bottom: 20px;
    line-height: 1.5;
    ${({ theme }) => theme.mediaWidth.upToSmall`
        margin-top: 10px;
    `}
`

const QuestTitle = styled.div`
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
`}
`

const Block = styled.div`
    display: flex;
    justify-content: start;
    padding: 19px 34px 22px;
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
    padding-right: 20px;
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
    align-items: center;
    @media (max-width: 767px) {
        font-size: ${(props) => props.theme.font.small};
        text-align: end;
        max-width: 240px;
    }

    &.status {
        color: #459d00;
        font-weight: 400;
        border: 1px solid #459d00;
        border-radius: 50px;
        width: fit-content;
        padding: 4px 15px;
    }
`
