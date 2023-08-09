import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import ReactTooltip from 'react-tooltip'

import {
    Container,
    Content,
    Head,
    Header,
    Heads,
    HeadsContainer,
    LeftAucInfo,
    List,
    ListItem,
    ListItemLabel,
    SectionContent,
} from './DataTable'
import { AddressLink } from '~/components/AddressLink'

interface ContractsTableProps {
    title: string
    colums: string[]
    rows: string[][]
}

export const ContractsTable = ({ title, colums, rows }: ContractsTableProps) => {
    const { chainId } = useWeb3React()
    return (
        <Container>
            <Header>
                <LeftAucInfo>
                    {/* Temporary title style */}
                    {/* <img src={Icon} alt="auction" /> */}
                    <h1 className="text-egg font-semibold font-poppins text-3xl"> {title}</h1>
                </LeftAucInfo>
            </Header>
            <Content>
                <SectionContent>
                    <SHeads>
                        {colums?.map((colName, index) => (
                            <SHeadsContainer key={title + '-column-' + index}>
                                <Head>{colName}</Head>
                            </SHeadsContainer>
                        ))}
                    </SHeads>

                    {rows?.map((item, index) => (
                        <SList key={'row-' + index}>
                            {item?.map((value, valueIndex) => (
                                <HeadsContainer key={'row-item-' + valueIndex}>
                                    <SListItem>
                                        <ListItemLabel>{colums[valueIndex]}</ListItemLabel>
                                        {valueIndex === 1 && <AddressLink address={value} chainId={chainId || 420} />}
                                        {valueIndex !== 1 && <>{value}</>}
                                    </SListItem>
                                </HeadsContainer>
                            ))}
                        </SList>
                    ))}
                </SectionContent>
            </Content>
        </Container>
    )
}

// Description column width variable
const descriptionColumnWidth = '500px'

const SHeads = styled(Heads)`
    div:last-child {
        width: ${descriptionColumnWidth};
    }
`
const SList = styled(List)`
    div:last-child div {
        width: ${descriptionColumnWidth};
    }
`

const SHeadsContainer = styled(HeadsContainer)`
    text-align: start;
`
const SListItem = styled(ListItem)`
    text-align: start;
    text-overflow: ellipsis;
`
