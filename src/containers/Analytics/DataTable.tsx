import { ReactNode } from 'react'
import styled from 'styled-components'
import { ExternalLinkArrow } from '~/GlobalStyle'

export interface TableProps {
    title: string
    colums: { name: string; description?: string }[]
    rows: (string | JSX.Element)[][]
}

interface HeadsContainerProps {
    index?: number
    key?: string
    children: ReactNode
}

interface ListItemProps {
    index?: number
}

export const DataTable = ({ title, colums, rows }: TableProps) => {
    return (
        <Container>
            <Content>
                <SectionContent>
                    <Heads>
                        {colums?.map(({ name, description }, index) => (
                            <HeadsContainer key={title + '-column-' + index} index={index}>
                                <Head data-tooltip-content={description} data-tooltip-id="collaterals-table">
                                    {name}
                                </Head>
                            </HeadsContainer>
                        ))}
                    </Heads>
                    <ListContainer>
                        {rows?.map((item, index) => (
                            <List key={'row-' + index}>
                                {item?.map((value, valueIndex) => (
                                    <HeadsContainer key={'row-item-' + valueIndex}>
                                        <ListItem index={valueIndex}>
                                            <ListItemLabel>{colums[valueIndex].name}</ListItemLabel>
                                            {value}
                                        </ListItem>
                                    </HeadsContainer>
                                ))}
                            </List>
                        ))}
                    </ListContainer>
                </SectionContent>
            </Content>
        </Container>
    )
}

export const Container = styled.div`
    margin-bottom: 15px;

    width: 100%;
    height: fit-content;
`

export const Header = styled.div`
    width: 100%;
    border-radius: 15px 15px 0 0;
    font-size: ${(props) => props.theme.font.small};
    font-weight: 600;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items:flex-start;
  `}
`

export const InfoIcon = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 0;
    top: -2px;

    svg {
        fill: ${(props) => props.theme.colors.foreground};
        color: ${(props) => props.theme.colors.secondary};
        position: relative;
    }
`

export const Content = styled.div`
    position: relative;

    border-radius: 0 0 15px 15px;
    width: 100%;

    max-width: 1350px;
    overflow-x: auto;

    &::-webkit-scrollbar {
        height: 8px;
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.2);
        box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.2);
    }

    &::-webkit-scrollbar-thumb:active {
        background-color: rgba(0, 0, 0, 0.2);
    }

    ${({ theme }) => theme.mediaWidth.upToSmall`
        max-width: unset;
  `}
`

export const SectionContent = styled.div`
    font-size: ${(props) => props.theme.font.default};
    width: 100%;
`

export const LeftAucInfo = styled.div<{ type?: string }>`
    display: flex;
    align-items: center;
    img {
        margin-right: 10px;
        width: 25px;
    }
`

export const HeadsContainer = styled.div<HeadsContainerProps>`
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    width: max-content;

    text-align: ${(props) => (props.index !== undefined && props.index <= 2 ? 'start' : 'end')};
`

export const Heads = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    width: max-content;

    & div:nth-child(1) {
        text-align: start;
        position: -webkit-sticky;
        position: sticky;
        left: 0;
        line-height: 2;
        z-index: 10;
    }

    & div:first-child {
        background-color: ${(props) => props.theme.colors.background};
    }

    ${({ theme }) => theme.mediaWidth.upToSmall`
    display:none;
  `}
`
export const ListContainer = styled.div`
    & div {
        z-index: 0;
    }
    & :nth-child(1) {
        position: -webkit-sticky;
        position: sticky;
        left: 0px;
        border-radius: 4px;
        z-index: 100;
    }
`

export const Head = styled.p`
    /* flex: 0 0 16.6%; */
    font-size: 12px;
    width: 174px;
    font-weight: 400;

    text-transform: uppercase;
    color: ${(props) => props.theme.colors.tertiary};
    padding-left: 10px;
    &:first-child {
        padding: 0 25px;
    }
`

export const ListItemLabel = styled.span`
    display: none;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    display:block;
    margin-bottom:5px;
    font-weight:normal;
    width: max-content;
   color: ${(props) => props.theme.colors.customSecondary};
  `}
`

export const List = styled.div`
    display: flex;
    border-radius: 0px;
    width: max-content;

    align-items: start;
    justify-content: space-between;
    background: white;
    margin-bottom: 24px;

    & div:nth-child(1) div {
        text-align: start;
        text-transform: capitalize;
    }

    ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap:wrap;
    width: unset;
    border:1px solid ${(props) => props.theme.colors.border};
    margin-bottom:10px;
    &:last-child {
      margin-bottom:0;
    }

  `}
`

export const ListItem = styled.div<ListItemProps>`
    /* flex: 0 0 16.6%; */
    width: 174px;
    color: ${(props) => props.theme.colors.tertiary};
    font-size: ${(props) => props.theme.font.xSmall};
    font-weight: 700;
    padding: 15px 10px;
    &:first-child {
        padding: 15px 19px;
    }

    &:nth-child(1) {
        background-color: white;
    }

    text-align: ${(props) => (props.index !== undefined && props.index <= 2 ? 'start' : 'end')};

    a {
        color: ${(props) => props.theme.colors.tertiary};
        font-weight: 700;
        font-size: ${(props) => props.theme.font.xSmall};
    }

    ${({ theme }) => theme.mediaWidth.upToSmall`
      &:first-child {
        padding: 15px 20px;
    }
    padding: 15px 20px;
    text-align: start;

    flex: 0 0 50%;
    min-width:50%;
    font-size: ${(props) => props.theme.font.xSmall};
    font-weight:900;
  `}
`

export const Link = styled.a`
    ${ExternalLinkArrow}
`
