import * as React from 'react'
import './index.css'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import styled from 'styled-components'
import { useOpenSeaListings } from '~/hooks/useOpenSeaListings'

type Listing = {
    id: string
    assetName: string
    price: string
    estimatedValue: string
    saleEnd: string
    saleStart: string
    image?: string
}

const columnHelper = createColumnHelper<Listing>()

const columns = [
    columnHelper.accessor('image', {
        header: () => 'NFV Listed',
        cell: (info) => {
            const imageUrl = info.row.original.image
            return imageUrl ? <img height={240} width={240} src={imageUrl} alt="img" /> : <Box></Box>
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

const Table = () => {
    const listings = useOpenSeaListings()

    const table = useReactTable({
        data: listings,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div>
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

const Box = styled.div`
    width: 50px;
    height: 50px;
    background-color: green;
`
