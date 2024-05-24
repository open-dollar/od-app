import * as React from 'react'

import './index.css'

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

type Person = {
    firstName: string
    lastName: string
    age: number
    visits: number
    status: string
    progress: number
}

const defaultData: Person[] = [
    {
        firstName: 'tanner',
        lastName: 'linsley',
        age: 24,
        visits: 100,
        status: 'In Relationship',
        progress: 50,
    },
    {
        firstName: 'tandy',
        lastName: 'miller',
        age: 40,
        visits: 40,
        status: 'Single',
        progress: 80,
    },
    {
        firstName: 'joe',
        lastName: 'dirte',
        age: 45,
        visits: 20,
        status: 'Complicated',
        progress: 10,
    },
]

type Listing = {
    id: string
    assetName: string
    price: string
    estimatedValue: string
    saleEnd: string
    saleStart: string
    image?: string
}

const defaultListings: Listing[] = [
    {
        id: '1',
        assetName: 'RETH',
        price: '1 ETH ($3,000)',
        estimatedValue: '$2,990',
        saleEnd: 'In 2 days',
        saleStart: '10h ago',
    },
    {
        id: '2',
        assetName: 'WSTETH',
        price: '1 ETH ($3,000)',
        estimatedValue: '$2,990',
        saleEnd: 'In 2 days',
        saleStart: '10h ago',
    },
    {
        id: '3',
        assetName: 'ARB',
        price: '1 ETH ($3,000)',
        estimatedValue: '$2,990',
        saleEnd: 'In 2 days',
        saleStart: '10h ago',
    },
]

const columnHelper = createColumnHelper<Listing>()

const columns = [
    columnHelper.accessor('assetName', {
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.price, {
        id: 'price',
        cell: (info) => info.getValue(),
        header: () => <span>Price</span>,
        footer: (info) => info.column.id,
    }),
    columnHelper.accessor('estimatedValue', {
        header: () => 'estimated Value',
        cell: (info) => info.renderValue(),
        footer: (info) => info.column.id,
    }),
    columnHelper.accessor('saleEnd', {
        header: () => <span>sale End</span>,
        footer: (info) => info.column.id,
    }),
    columnHelper.accessor('saleStart', {
        header: 'sale Start',
        footer: (info) => info.column.id,
    }),
]

const Table = () => {
    const [data, _setData] = React.useState(() => [...defaultListings])

    const table = useReactTable({
        data,
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
