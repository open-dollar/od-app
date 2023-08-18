import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'

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
import { useState } from 'react'

interface ContractsTableProps {
    title: string
    colums: string[]
    rows: string[][]
}

interface Tooltips {
    [address: string]: string | undefined
}

export const ContractsTable = ({ title, colums, rows }: ContractsTableProps) => {
    const [tooltips, setTooltips] = useState<Tooltips>({})
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

        setTooltips((prevTooltips) => ({
            ...prevTooltips,
            [address]: 'Copied',
        }))

        setTimeout(() => {
            setTooltips((prevTooltips) => ({
                ...prevTooltips,
                [address]: undefined,
            }))
        }, 2000)
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
                                        {valueIndex === 1 && <SecondColumnValue>{value}</SecondColumnValue>}
                                        {valueIndex === 2 && (
                                            <AddressColumm>
                                                <AddressLink address={value} chainId={chainId || 420} />
                                                <WrapperIcon onClick={() => handleCopyAddress(value)}>
                                                    <CopyIconBlue />
                                                </WrapperIcon>
                                                {tooltips[value] === 'Copied' && (
                                                    <Tooltip
                                                        onClick={() => {
                                                            setTooltips((prev) => ({
                                                                ...prev,
                                                                [value]: undefined,
                                                            }))
                                                        }}
                                                    >
                                                        Copied
                                                    </Tooltip>
                                                )}
                                            </AddressColumm>
                                        )}
                                        {valueIndex !== 2 && valueIndex !== 1 && <>{value}</>}
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

const Tooltip = styled.div`
    position: absolute;
    top: -20px;
    right: 0;
    padding: 5px;
    border: 1px solid black;
    background-color: #1499DA;
    border-radius: 5px;
    color: white;
    width: 100px!important;
    height: 30px;
`

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
