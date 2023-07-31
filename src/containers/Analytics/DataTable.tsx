import styled from 'styled-components'
import { ExternalLinkArrow } from '~/GlobalStyle'

export interface TableProps {
    title: string
    colums: string[]
    rows: (string | JSX.Element)[][]
}

export const DataTable = ({ title, colums, rows }: TableProps) => {
    return (
        <Container>
            <Header>
                <LeftAucInfo>
                    {/* <img src={Icon} alt="auction" /> */}
                    <h1 className="text-egg font-semibold font-poppins text-3xl"> {title}</h1>
                </LeftAucInfo>
            </Header>
            <Content>
                <SectionContent>
                    <Heads>
                        {colums?.map((colName, index) => (
                            <HeadsContainer key={title + '-column-' + index}>
                                <Head>{colName}</Head>
                            </HeadsContainer>
                        ))}
                    </Heads>

                    {rows?.map((item, index) => (
                        <List key={'row-' + index}>
                            {item?.map((value, valueIndex) => (
                                <HeadsContainer key={'row-item-' + valueIndex}>
                                    <ListItem>
                                        <ListItemLabel>{colums[valueIndex]}</ListItemLabel>
                                        {value}
                                    </ListItem>
                                </HeadsContainer>
                            ))}
                        </List>
                    ))}
                </SectionContent>
            </Content>
        </Container>
    )
}

export const Container = styled.div`
    border-radius: 15px;
    margin-bottom: 15px;
    background: #05284c;
    width: fit-content;
    height: fit-content;
    margin: 10px;
`

export const Header = styled.div`
    width: 100%;
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

export const Content = styled.div`
    padding: 20px 20px 20px 20px;
    border-top: 1px solid ${(props) => props.theme.colors.border};
    background: #031f3a;
    border-radius: 0 0 15px 15px;
    width: 100%;
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

export const HeadsContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    width: max-content;
    text-align: end;
`

export const Heads = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    width: max-content;

    & div:nth-child(1) {
        text-align: start;
    }

    ${({ theme }) => theme.mediaWidth.upToSmall`
    display:none;
  `}
`

export const Head = styled.p`
    /* flex: 0 0 16.6%; */
    font-size: 12px;
    width: 166px;
    font-weight: bold;
    text-transform: uppercase;
    color: ${(props) => props.theme.colors.secondary};
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
    border-radius: 10px;

    align-items: start;
    justify-content: space-between;

    &:nth-child(even) {
        background: #12385e;
    }

    & div:nth-child(1) div {
        text-align: start;
        text-transform: capitalize;
    }

    ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap:wrap;
    border:1px solid ${(props) => props.theme.colors.border};
    margin-bottom:10px;
    &:last-child {
      margin-bottom:0;
    }

  `}
`

export const ListItem = styled.div`
    /* flex: 0 0 16.6%; */
    width: 166px;
    color: ${(props) => props.theme.colors.customSecondary};
    font-size: ${(props) => props.theme.font.extraSmall};
    padding: 15px 10px;
    &:first-child {
        padding: 15px 25px;
    }

    text-align: end;

    ${({ theme }) => theme.mediaWidth.upToSmall`
      &:first-child {
        padding: 15px 20px;
    }
    padding: 15px 20px;
    text-align: start;

    flex: 0 0 50%;
    min-width:50%;
    font-size: ${(props) => props.theme.font.extraSmall};
    font-weight:900;
  `}
`

export const Link = styled.a`
    ${ExternalLinkArrow}
`
