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
import CopyIconBlue from '~/components/Icons/CopyIconBlue'

interface ContractsTableProps {
    title: string
    colums: string[]
    rows: string[][]
}

export const ContractsTable = ({ title, colums, rows }: ContractsTableProps) => {
    const { chainId } = useWeb3React()

    const reorderedColumns = colums && [...colums]
    if (reorderedColumns && reorderedColumns.length > 2) {
        ;[reorderedColumns[1], reorderedColumns[2]] = [reorderedColumns[2], reorderedColumns[1]]
    }

    let reorderedRows =
        rows &&
        rows.map((row) => {
            if (row && row.length > 2) {
                const newRow = [...row]
                ;[newRow[1], newRow[2]] = [newRow[2], newRow[1]]
                return newRow
            }
            return row
        })

    if (reorderedRows && reorderedRows.length > 2) {
        const lastTwoItems = reorderedRows.slice(-2)
        reorderedRows = lastTwoItems.concat(reorderedRows.slice(0, -2))
    }
    console.log({ rows }, { colums })
    return (
        <Container>
            {/* <Header>
                <LeftAucInfo>
                    {/* Temporary title style */}
            {/* <img src={Icon} alt="auction" /> */}
            {/* <h1 className="text-egg font-semibold font-poppins text-3xl"> {title}</h1> */}
            {/* </LeftAucInfo> */}
            {/* </Header> */}
            <Content>
                <SectionContent>
                    <SHeads>
                        {reorderedColumns?.map((colName, index) => (
                            <SHeadsContainer key={title + '-column-' + index}>
                                <Head>{colName}</Head>
                            </SHeadsContainer>
                        ))}
                    </SHeads>

                    {reorderedRows?.map((item, index) => (
                        <SList key={'row-' + index}>
                            {item?.map((value, valueIndex) => (
                                <SHeadsContainer key={'row-item-' + valueIndex}>
                                    <SListItem>
                                        <ListItemLabel>{colums[valueIndex]}</ListItemLabel>
                                        {valueIndex === 2 && (
                                            <AddressColumm>
                                                <AddressLink address={value} chainId={chainId || 420} />
                                                <CopyIconBlue />
                                            </AddressColumm>
                                        )}
                                        {valueIndex !== 2 && <>{value}</>}
                                    </SListItem>
                                </SHeadsContainer>
                            ))}
                        </SList>
                    ))}
                </SectionContent>
            </Content>
        </Container>
    )
}

const AddressColumm = styled.div`
    display: flex;
    align-items: center;

    svg {
        cursor: pointer;
    }
`

const SHeads = styled(Heads)`
    div:nth-child(2) {
        width: 100%;
    }

    div:nth-child(1) {
        width: 174px;
    }

    width: 100%;
`
const SList = styled(List)`
    div:nth-child(2) div {
        max-width: 884px;
        width: 100%;
        opacity: 50%;
    }
    div:nth-child(1) {
        width: 174px;
    }
    justify-content: flex-start;
    width: 100%;
`

const SHeadsContainer = styled(HeadsContainer)`
    text-align: start;
    width: 100%;
`
const SListItem = styled(ListItem)`
    text-align: start;
    text-overflow: ellipsis;
    font-size: 16px;
    font-weight: 400;
    & a {
        color: white;
        font-size: 16px;
        font-weight: 400;
    }
`
