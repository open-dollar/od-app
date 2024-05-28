import './index.css'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import styled from 'styled-components'
import Button from '~/components/Button'

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
                        // style={{
                        //     width: '200px',
                        //     height: '200px',
                        //     transform: 'scale(0.25)',
                        // }}
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
    columnHelper.accessor((row) => row.listingPrice, {
        id: 'price',
        cell: (info) => {
            return (
                <>
                    <span>{info.row.original.price} ETH</span>
                    <br />
                    <span>{info.getValue()}</span>
                </>
            )
        },
        header: () => <span>Price</span>,
    }),
    columnHelper.accessor('estimatedValue', {
        header: () => 'Estimated Value',
        cell: (info) => info.renderValue(),
    }),
    columnHelper.accessor('premium', {
        header: 'Premium',
        cell: (info) => info.renderValue(),
    }),
    columnHelper.accessor('saleStart', {
        header: 'Sale Start',
    }),
    columnHelper.accessor('saleEnd', {
        header: () => <span>Sale End</span>,
    }),
    columnHelper.accessor('actions', {
        header: 'Actions',
        cell: (info) => {
            return (
                <ButtonFloat>
                    <Button
                        onClick={() =>
                            window.open(`https://app.opendollar.com/vaults/${info.row.original.id}`, '_blank')
                        }
                    >
                        View
                    </Button>
                    <Button
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
    //columnHelper.accessor('actions', { header: 'Actions' }),
]

const Table = ({ data }: { data: Listing[] }) => {
    const table = useReactTable({
        data: data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })
    return (
        <div key={`table-${data}`} style={{ overflowX: 'auto' }}>
            <table style={{ minWidth: '350px' }}>
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
                    {table.getRowModel().rows.map((row, i) => (
                        <>
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                                ))}
                            </tr>
                        </>
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

const TableContainer = styled.div`
    display: block;
    overflow-x: auto;
    max-width: 100%;
`
