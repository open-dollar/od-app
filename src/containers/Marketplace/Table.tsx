import './index.css'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import styled from 'styled-components'
import Button from '~/components/Button'
import { formatDataNumber } from '~/utils'

type Listing = {
    listingPrice: string
    premium: string
    id: string
    assetName: string
    price: string
    estimatedValue: string
    saleEnd: string
    saleStart: string
    image?: string | any
    actions?: any
}

const columnHelper = createColumnHelper<Listing>()
const columns = [
    columnHelper.accessor('id', {
        header: () => 'NFV',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('image', {
        header: () => '',
        cell: (info) => {
            const image = info.row.original.image
            return image ? (
                <SVGContainer>
                    <div
                        style={{
                            transform: 'scale(0.33)',
                        }}
                        dangerouslySetInnerHTML={{ __html: image }}
                    ></div>
                </SVGContainer>
            ) : null
        },
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
    }),
    columnHelper.accessor('estimatedValue', {
        header: () => 'Est. Value',
        cell: (info) => {
            const value = info.renderValue()
            const convertedValue = `$${Number(value?.replace('$', '')).toFixed(2)}`
            return <>{convertedValue}</>
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
    }),

    columnHelper.accessor('saleEnd', {
        header: () => 'End',
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
    }),
]

const Table = ({ data }: { data: Listing[] }) => {
    const table = useReactTable({
        data: data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })
    return (
        <TableContainer key={`table-${data}`}>
            <table>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
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

const TableContainer = styled.div`
    overflow-x: auto;
    table {
        width: 100%;
        border-collapse: collapse;
        min-width: 600px;
    }

    th,
    td {
        padding: 8px 12px;
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

            &:nth-child(2),
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
