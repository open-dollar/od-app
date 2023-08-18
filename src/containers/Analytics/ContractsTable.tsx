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
    // const [tooltips, setTooltips] = useState<{ [key: string]: string }>({})
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
            [address]: 'Clicked',
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
                                        {valueIndex === 2 && (
                                            <AddressColumm>
                                                <AddressLink address={value} chainId={chainId || 420} />
                                                <WrapperIcon onClick={() => handleCopyAddress(value)}>
                                                    <CopyIconBlue />
                                                </WrapperIcon>
                                                {tooltips[value] === 'Clicked' && (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            top: '20px',
                                                            left: '0',
                                                            padding: '5px',
                                                            border: '1px solid black',
                                                            backgroundColor: 'white',
                                                            borderRadius: '5px',
                                                        }}
                                                        onClick={() => {
                                                            setTooltips((prev) => ({
                                                                ...prev,
                                                                [value]: undefined,
                                                            }))
                                                        }}
                                                    >
                                                        Clicked
                                                    </div>
                                                )}
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
    & div:nth-child(2) div {
        opacity: 50%;
    }
    @media (min-width: 783px) {
        div:nth-child(2) div {
            width: 100%;
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
    position: relative;
    display: flex;
    justify-content: center;
    margin-left: 16px;
    width: 20px;
    height: 20px;
    opacity: 1 !important;
`
