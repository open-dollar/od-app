import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    getFilteredRowModel,
    SortingState,
    ColumnDef,
} from '@tanstack/react-table'
import './index.css'
import styled from 'styled-components'
import Button from '~/components/Button'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Vault = {
    id: string
    collateral: string
    image?: string | any
    collateralAmount: string
    debtAmount: string
    riskStatus: string
    actions?: any
}

const riskStatusMapping: { [key: string]: number } = {
    NO: 0,
    LOW: 1,
    ELEVATED: 2,
    HIGH: 3,
    LIQUIDATION: 4,
}

const parseDebtAmount = (value: string): number => {
    return parseFloat(value.replace(/,/g, '').replace(' OD', ''))
}

const columnHelper = createColumnHelper<Vault>()

const ExploreTable = ({ data }: { data: Vault[] }) => {
    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState<string>('')
    const navigate = useNavigate()

    const columns: ColumnDef<Vault, any>[] = [
        columnHelper.accessor('id', {
            header: () => 'ID',
            cell: (info) => info.getValue(),
            sortingFn: 'alphanumeric',
            enableSorting: true,
        }),
        columnHelper.accessor('image', {
            header: () => '',
            cell: (info) => {
                const image = info.row.original.image
                const vaultID = info.row.original.id
                return image ? (
                    <SVGContainer key={vaultID}>
                        <SvgWrapper key={vaultID} dangerouslySetInnerHTML={{ __html: image }}></SvgWrapper>
                    </SVGContainer>
                ) : null
            },
            enableSorting: false,
        }),
        columnHelper.accessor('collateralAmount', {
            header: () => 'Collateral Amount',
            cell: (info) => info.getValue().toLocaleString(),
            sortingFn: (rowA, rowB) => {
                const a = rowA.getValue<number>('collateralAmount')
                const b = rowB.getValue<number>('collateralAmount')
                return a - b
            },
            filterFn: (row, columnId, filterValue) => {
                const value = row.getValue<number>(columnId)
                return value.toString().includes(filterValue)
            },
        }),
        columnHelper.accessor('collateral', {
            header: () => 'Collateral',
            cell: (info) => info.getValue(),
            sortingFn: 'alphanumeric',
            enableSorting: true,
        }),
        columnHelper.accessor('debtAmount', {
            header: () => 'Debt Amount',
            cell: (info) => info.getValue(),
            sortingFn: (rowA, rowB) => {
                const a = parseDebtAmount(rowA.getValue<string>('debtAmount'))
                const b = parseDebtAmount(rowB.getValue<string>('debtAmount'))
                return a - b
            },
            filterFn: (row, columnId, filterValue) => {
                const value = parseDebtAmount(row.getValue<string>(columnId))
                return value.toString().includes(filterValue)
            },
        }),
        columnHelper.accessor('riskStatus', {
            header: () => 'Risk Status',
            cell: (info) => info.getValue().toLocaleString(),
            sortingFn: (rowA, rowB) => {
                const a = riskStatusMapping[rowA.getValue<string>('riskStatus')] || 1
                const b = riskStatusMapping[rowB.getValue<string>('riskStatus')] || 1
                return a - b
            },
            filterFn: (row, columnId, filterValue) => {
                const value = row.getValue<string>(columnId)
                return value.includes(filterValue)
            },
        }),
        columnHelper.accessor('actions', {
            header: '',
            cell: (info) => {
                return (
                    <ButtonFloat>
                        <Button secondary onClick={() => navigate(`/vaults/${info.row.original.id}`)}>
                            View
                        </Button>
                    </ButtonFloat>
                )
            },
            enableSorting: false,
        }),
    ]

    const table = useReactTable({
        data: data,
        columns,
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })

    return (
        <TableContainer>
            <input
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(String(e.target.value))}
                placeholder="Search all columns..."
                style={{ marginBottom: '10px', padding: '8px', width: '100%', fontFamily: 'Barlow' }}
            />
            <table>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id}>
                                    {header.isPlaceholder ? null : (
                                        <SortableHeader
                                            onClick={header.column.getToggleSortingHandler()}
                                            style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getCanSort() ? (
                                                header.column.getIsSorted() ? (
                                                    header.column.getIsSorted() === 'asc' ? (
                                                        <StyledArrow>▲</StyledArrow>
                                                    ) : (
                                                        <StyledArrow>▼</StyledArrow>
                                                    )
                                                ) : (
                                                    <ArrowUpAndDownIcon>&nbsp;⇅</ArrowUpAndDownIcon>
                                                )
                                            ) : null}
                                        </SortableHeader>
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => {
                                const header = cell.column.columnDef.header
                                let headerText = ''

                                if (typeof header === 'function') {
                                    // @ts-ignore
                                    const renderedHeader = header(cell.getContext())
                                    if (typeof renderedHeader === 'string') {
                                        headerText = renderedHeader
                                    } else if (
                                        typeof renderedHeader === 'object' &&
                                        renderedHeader.props &&
                                        renderedHeader.props.children
                                    ) {
                                        headerText = renderedHeader.props.children
                                    }
                                } else {
                                    headerText = header ? header.toString() : ''
                                }

                                return (
                                    <td key={cell.id} data-label={headerText}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </TableContainer>
    )
}

export default ExploreTable

const ArrowUpAndDownIcon = styled.span`
    font-size: 15px;
    padding-bottom: 4px;
`

const StyledArrow = styled.div`
    padding-left: 4px;
`

const SortableHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: start;
    cursor: pointer;
    font-family: 'Open Sans', sans-serif;
    font-size: ${(props) => props.theme.font.xSmall};
`

const TableContainer = styled.div`
    overflow-x: auto;
    table {
        width: 100%;
        border-collapse: collapse;
        min-width: 600px;
        padding: 20px;
        background-color: rgba(255, 255, 255, 0);
        backdrop-filter: blur(10px);
    }
    th,
    td {
        padding: 8px 0px;
        text-align: left;
    }

    th {
        background-color: #fff;
        border-top: 2px solid #000;
        border-bottom: 2px solid #000;
    }

    tr {
        margin-bottom: 20px;
    }

    tr:not(:last-child) td {
        border-bottom: 1px solid #ddd;
    }

    @media (max-width: 768px) {
        table {
            min-width: 100%;
            display: block;
            overflow-x: auto;
        }

        thead {
            display: none;
        }

        tbody,
        td {
            display: block;
            width: 100%;
            box-sizing: border-box;
        }

        tr {
            display: flex;
            flex-direction: column;
            margin-bottom: 20px;
            border-bottom: 4px solid #ddd;
        }

        td {
            display: flex;
            justify-content: space-between;
            padding: 10px;
        }

        td::before {
            display: flex;
            content: attr(data-label);
            left: 10px;
            white-space: nowrap;
            font-weight: bold;
            text-align: left;
        }
    }
`

const SVGContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 70px;
    height: 70px;
    position: relative;

    @media (max-width: 768px) {
        width: 140px;
        height: 140px;
        justify-content: center;
        margin-left: auto;
        margin-right: auto;
    }
`

const SvgWrapper = styled.div`
    transform: scale(0.33);
    border-radius: 10px;

    @media (max-width: 768px) {
        transform: scale(0.7);
    }
`

const ButtonFloat = styled.div`
    position: relative;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    border-radius: 5px;
    z-index: 2;
    button {
        margin: 5px;
        padding: 5px;
    }
`
