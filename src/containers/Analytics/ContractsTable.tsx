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
import { useState } from 'react'

interface ContractsTableProps {
    title: string
    colums: string[]
    rows: string[][]
}

export const ContractsTable = ({ title, colums, rows }: ContractsTableProps) => {
    const [tooltipText, setTooltipText] = useState('Copy')
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

    const handleCopyAddress = (address: string) => {
        navigator.clipboard.writeText(address || '')
        setTooltipText("Copied!");
    }

    return (
        <Container>
            <ReactTooltip multiline type="dark" data-effect="solid" arrowColor="#001828" />
            <Content>
                <SectionContent>
                    <SHeads className="s-heads">
                        {reorderedColumns?.map((colName, index) => (
                            <SHeadsContainer key={title + '-column-' + index} className="s-heads__s-heads-container">
                                <Head>{colName}</Head>
                            </SHeadsContainer>
                        ))}
                    </SHeads>

                    {reorderedRows?.map((item, index) => (
                        <SList key={'row-' + index} className="s-list">
                            {item?.map((value, valueIndex) => (
                                <SHeadsContainer key={'row-item-' + valueIndex} className="s-heads-container">
                                    <SListItem className="s-list-item">
                                        <ListItemLabel className="list-item-label">
                                            {reorderedColumns[valueIndex]}
                                        </ListItemLabel>
                                        {valueIndex === 2 && (
                                            <AddressColumm>
                                                <AddressLink address={value} chainId={chainId || 420} />
                                                <WrapperIcon data-tip={tooltipText} onClick={() => handleCopyAddress(value)}>
                                                    <CopyIconBlue />
                                                </WrapperIcon>
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
    justify-content: space-between;

    div {
        cursor: pointer;
    }
`

const SHeads = styled(Heads)`
    // first column

    div:nth-child(1) {
        width: 174px;
    }

    div:nth-child(2) {
        width: 100%;
        flex: 2;
        display: flex;
        justify-content: flex-start;
    }

    div:nth-child(3) {
        flex: 1;
        text-align: center;
    }

    width: 100%;
`
const SList = styled(List)`
    div:nth-child(2) div {
        opacity: 50%;
    }
    // first column
    @media (min-width: 783px) {
        div:nth-child(2) div {
            max-width: 884px;
            width: 100%;
            opacity: 50%;
        }

        div:nth-child(1) {
            width: 174px;
        }

        div:nth-child(2) {
            flex: 2;
        }

        div:nth-child(3) {
            flex: 1;
        }
    }

    width: 100%;
`

const SHeadsContainer = styled(HeadsContainer)`
    text-align: start;
    width: 100%;
    @media (min-width: 783px) {
        justify-content: flex-end;
    }
`

const SListItem = styled(ListItem)`
    text-align: start;
    text-overflow: ellipsis;
    font-size: 16px;
    font-weight: 400;
    border-radius: 4px;
    & a {
        color: white;
        font-size: 16px;
        font-weight: 400;
    }
`

const WrapperIcon = styled.div`
    display: flex;
    justify-content: center;
    margin-left: 16px;
    width: 20px;
    height: 20px;
`
