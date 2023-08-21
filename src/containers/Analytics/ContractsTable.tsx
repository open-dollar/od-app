import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { Tooltip as ReactTooltip } from 'react-tooltip'

import {
    Container,
    Content,
    Head,
    Heads,
    HeadsContainer,
    List,
    ListItem,
    ListItemLabel,
    SectionContent,
} from './DataTable'
import { AddressLink } from '~/components/AddressLink'
import CopyIconBlue from '~/components/Icons/CopyIconBlue'
import { useEffect, useRef, useState } from 'react'

interface ContractsTableProps {
    title: string
    colums: string[]
    rows: string[][]
}

interface Tooltips {
    [address: string]: string | undefined
}

export const ContractsTable = ({ title, colums, rows }: ContractsTableProps) => {
    const [tooltips, setTooltips] = useState<{ [key: string]: string }>({})
    const [open, setOpen] = useState(false)
    const { chainId } = useWeb3React()
    // const iconRef = useRef<HTMLDivElement | null>(null)

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

        setTooltips((prevTooltips) => ({
            ...prevTooltips,
            [address]: 'Copied',
        }))

        setTimeout(() => {
            setTooltips((prevTooltips) => ({
                ...prevTooltips,
                [address]: 'Copy',
            }))
        }, 10000)
    }

    return (
        <Container>
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
                                        {valueIndex === 0 && <>{value}</>}
                                        {valueIndex === 1 && <SecondColumnValue>{value}</SecondColumnValue>}
                                        {valueIndex === 2 && (
                                            <AddressColumm>
                                                <AddressLink address={value} chainId={chainId || 420} />
                                                <WrapperIcon
                                                    data-tooltip-content={tooltips[value] || 'Copy'}
                                                    data-tooltip-id={value}
                                                    onClick={() => handleCopyAddress(value)}
                                                >
                                                    <CopyIconBlue />
                                                </WrapperIcon>
                                            </AddressColumm>
                                        )}
                                    </SListItem>
                                </SHeadsContainer>
                            ))}
                            <ReactTooltip id={`${item[2]}`} openOnClick place="top" />
                        </SList>
                    ))}
                </SectionContent>
            </Content>
        </Container>
    )
}

const SecondColumnValue = styled.div`
    opacity: 0.5;
`

const AddressColumm = styled.div`
    display: flex;
    align-items: center;

    div {
        cursor: pointer;
    }
`

const SHeads = styled(Heads)`
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
        justify-content: flex-end;
    }

    width: 100%;
`
const SList = styled(List)`
    @media (min-width: 783px) {
        div:nth-child(2) div {
            width: 100%;
        }

        div:nth-child(2) {
            flex: 2;
        }

        div:nth-child(3) {
            flex: 1;
            justify-content: flex-end;
        }
    }

    width: 100%;
`

const SHeadsContainer = styled(HeadsContainer)`
    text-align: start;
    @media (max-width: 783px) {
        width: 100%;
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
