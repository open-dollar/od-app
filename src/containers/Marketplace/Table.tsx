import * as React from 'react'
import './index.css'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import styled from 'styled-components'

type Listing = {
    id: string
    assetName: string
    price: string
    estimatedValue: string
    saleEnd: string
    saleStart: string
    image?: string | any
}

const columnHelper = createColumnHelper<Listing>()

const columns = [
    columnHelper.accessor('id', {
        header: () => 'ID',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('image', {
        header: () => 'NFV Listed',
        cell: (info) => {
            const image = info.row.original.image
            return image ? (
                <SVGContainer>
                    <div
                        style={{
                            width: '200px',
                            height: '200px',
                            transform: 'scale(0.25)',
                        }}
                        dangerouslySetInnerHTML={{ __html: image }}
                    ></div>
                </SVGContainer>
            ) : null
            // return image ? <SVGCol img={image} /> : null
        },
    }),
    columnHelper.accessor('assetName', {
        header: () => 'Asset Name',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row.price, {
        id: 'price',
        cell: (info) => info.getValue(),
        header: () => <span>Price</span>,
    }),
    columnHelper.accessor('estimatedValue', {
        header: () => 'Estimated Value',
        cell: (info) => info.renderValue(),
    }),
    columnHelper.accessor('saleEnd', {
        header: () => <span>Sale End</span>,
    }),
    columnHelper.accessor('saleStart', {
        header: 'Sale Start',
    }),
]

const Table = ({ data }: { data: Listing[] }) => {
    const table = useReactTable({
        data: data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div key={`table-${data}`}>
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
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Table

const SVGContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    position: relative;
    overflow: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
        width: 0;
        background: transparent;
    }
`
