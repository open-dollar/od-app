import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { Tooltip as ReactTooltip } from 'react-tooltip'

import { Container, Content, Head, Heads, HeadsContainer, List, ListItemLabel, SectionContent } from './DataTable'
import { AddressLink } from '~/components/AddressLink'
import CopyIconBlue from '~/components/Icons/CopyIconBlue'
import { useState } from 'react'

interface ContractsTableProps {
    title: string
    colums: string[]
    rows: string[][]
}

const reorderColumns = (columns: string[]) => {
    const reordered = [...columns]
    if (reordered.length > 2) {
        ;[reordered[1], reordered[2]] = [reordered[2], reordered[1]]
    }
    return reordered
}

const reorderRows = (rows: string[][]) => {
    const SPECIAL_ROWS = ['SystemCoin', 'ProtocolToken']

    // Checking if the special rows are already on top
    const areSpecialRowsOnTop = SPECIAL_ROWS.every((name, idx) => rows[idx] && rows[idx][0] === name)

    if (areSpecialRowsOnTop) {
        return rows.map((row) => {
            if (row.length > 2) {
                const newRow = [...row]
                ;[newRow[1], newRow[2]] = [newRow[2], newRow[1]]
                return newRow
            }
            return row
        })
    }

    // Extracting special rows and filtering undefined values
    const specialRows = SPECIAL_ROWS.map((name) => rows.find((row) => row[0] === name)).filter(Boolean) as string[][]

    const otherRows = rows.filter((row) => !SPECIAL_ROWS.includes(row[0]))

    return [...specialRows, ...otherRows].map((row) => {
        if (row.length > 2) {
            const newRow = [...row]
            ;[newRow[1], newRow[2]] = [newRow[2], newRow[1]]
            return newRow
        }
        return row
    })
}

export const ContractsTable = ({ title, colums, rows }: ContractsTableProps) => {
    const [tooltips, setTooltips] = useState<{ [key: string]: string }>({})
    const { chainId } = useWeb3React()

    const reorderedColumns = reorderColumns(colums)
    const reorderedRows = reorderRows(rows)

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
                                    <SListItem className={valueIndex === 0 ? 's-list-item-first' : 's-list-item'}>
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
                            <ReactTooltip variant="light" id={`${item[2]}`} openOnClick place="top" />
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
        width: 310px;
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

    & .s-list-item-first {
        width: 310px;
        word-wrap: break-word;
    }
`

interface ListItemProps {
    index?: number
}

const SListItem = styled.div<ListItemProps>`
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
    width: 174px;
    color: ${(props) => props.theme.colors.customSecondary};
    padding: 15px 10px;
    &:first-child {
        padding: 15px 25px;
    }

    &:nth-child(1) {
        background-color: #002b40;
    }
    ${({ theme }) => theme.mediaWidth.upToSmall`
      &:first-child {
        padding: 15px 20px;
    }
    padding: 15px 20px;
    text-align: start;
    flex: 0 0 100%;
    min-width:50%;
  `}
`

const WrapperIcon = styled.div`
    display: flex;
    justify-content: center;
    margin-left: 16px;
    width: 20px;
    height: 20px;
`
