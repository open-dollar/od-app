import './index.css'
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    getFilteredRowModel,
    SortingState,
} from '@tanstack/react-table'
import styled from 'styled-components'
import Button from '~/components/Button'
import { useState } from 'react'
import { ArrowDown } from 'react-feather'
import { ArrowUp } from 'react-feather'

type Listing = {
    listingPrice: string
    premium: string
    id: string
    assetName: string
    price: string
    estimatedValue: string
    saleEnd: string
    saleEndMinutes: number
    saleStart: string
    saleStartMinutes: number
    image?: string | any
    actions?: any
}

const columnHelper = createColumnHelper<Listing>()
const columns = [
    columnHelper.accessor('image', {
        header: () => '',
        cell: (info) => {
            const image = info.row.original.image
            return image ? (
                <SVGContainer>
                    <SvgWrapper
                        // style={{
                        //     transform: 'scale(0.33)',
                        // }}
                        dangerouslySetInnerHTML={{ __html: image }}
                    ></SvgWrapper>
                </SVGContainer>
            ) : null
        },
        enableSorting: false,
    }),
    columnHelper.accessor('id', {
        header: () => 'NFV',
        cell: (info) => info.getValue(),
        sortingFn: 'alphanumeric',
    }),
    columnHelper.accessor('assetName', {
        header: () => 'Collateral',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row.listingPrice, {
        id: 'price',
        cell: (info) => {
            const value = info.getValue()
            const convertedValue = `$${Number(value.replace('$', '')).toFixed(2)}`
            return (
                <>
                    <span>{info.row.original.price}</span>
                    <br />
                    <span>{convertedValue}</span>
                </>
            )
        },
        header: () => 'Price',
        sortingFn: (a, b, columnId) => {
            // @ts-ignore
            const priceA = parseFloat(a.getValue(columnId).replace('$', ''))
            // @ts-ignore
            const priceB = parseFloat(b.getValue(columnId).replace('$', ''))
            return priceA > priceB ? 1 : priceA < priceB ? -1 : 0
        },
    }),
    columnHelper.accessor('estimatedValue', {
        header: () => 'Est. Value',
        cell: (info) => {
            const value = info.renderValue()
            const convertedValue = `$${Number(value?.replace('$', '')).toFixed(2)}`
            return <>{convertedValue}</>
        },
        sortingFn: (a, b, columnId) => {
            // @ts-ignore
            const valueA = parseFloat(a.getValue(columnId).replace('$', ''))
            // @ts-ignore
            const valueB = parseFloat(b.getValue(columnId).replace('$', ''))
            return valueA > valueB ? 1 : valueA < valueB ? -1 : 0
        },
    }),
    columnHelper.accessor('premium', {
        header: 'Premium',
        cell: (info) => {
            const value = info.getValue()
            const valueNumber = Number(value.replace('$', ''))
            const color = valueNumber > 0 ? 'green' : 'red'
            const justNumber = valueNumber > 0 ? `$${valueNumber.toFixed(2)}` : `($${(valueNumber * -1).toFixed(2)})`
            return <span style={{ color }}>{justNumber}</span>
        },
        sortingFn: (a, b, columnId) => {
            // @ts-ignore
            const premiumA = parseFloat(a.getValue(columnId).replace('$', ''))
            // @ts-ignore
            const premiumB = parseFloat(b.getValue(columnId).replace('$', ''))
            return premiumA > premiumB ? 1 : premiumA < premiumB ? -1 : 0
        },
    }),
    columnHelper.accessor('saleStartMinutes', {
        header: 'Start',
        cell: (info) => info.row.original.saleStart,
        sortingFn: 'basic',
    }),
    columnHelper.accessor('saleEndMinutes', {
        header: () => 'End',
        cell: (info) => info.row.original.saleEnd,
        sortingFn: 'basic',
    }),
    columnHelper.accessor('actions', {
        header: '',
        cell: (info) => {
            return (
                <ButtonFloat>
                    <Button
                        secondary
                        onClick={() =>
                            window.open(`https://app.opendollar.com/vaults/${info.row.original.id}`, '_blank')
                        }
                    >
                        View
                    </Button>
                    <Button
                        secondary
                        onClick={() =>
                            window.open(
                                `https://opensea.io/assets/arbitrum/0x0005afe00ff7e7ff83667bfe4f2996720baf0b36/${info.row.original.id}`,
                                '_blank'
                            )
                        }
                    >
                        Buy
                    </Button>
                </ButtonFloat>
            )
        },
        enableSorting: false,
    }),
]

const Table = ({ data }: { data: Listing[] }) => {
    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState<string>('')

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
        <TableContainer key={`table-${data}`}>
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
                                                        <StyledArrow>
                                                            <ArrowUp size={16} />
                                                        </StyledArrow>
                                                    ) : (
                                                        <StyledArrow>
                                                            <ArrowDown size={16} />
                                                        </StyledArrow>
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

export default Table

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
    }

    th,
    td {
        padding: 8px 0px;
        text-align: left;
        border: none;
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
        tr,
        td {
            display: block;
            width: 100%;
            box-sizing: border-box;
        }

        tr {
            margin-bottom: 15px;
            border-bottom: 1px solid #ddd;
        }

        td {
            text-align: right;
            position: relative;
            padding-left: 40%;
            text-align: left;
            &:nth-child(1),
            &:last-child {
                padding-left: 0;
                display: flex;
                justify-content: center;
            }
        }

        td::before {
            content: attr(data-label);
            position: absolute;
            left: 10px;
            width: calc(50% - 10px);
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
    width: 150px;
    height: 150px;
    position: relative;

    @media (max-width: 768px) {
        width: 294px;
        height: 294px;
    }
`

const SvgWrapper = styled.div`
    transform: scale(0.33);

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
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    z-index: 2;
    button {
        margin: 5px;
        padding: 5px;
    }
`
