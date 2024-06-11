import './leaderboard.css'
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
import { useState } from 'react'
import { ArrowDown, ArrowUp } from 'react-feather'
import { returnWalletAddress } from '~/utils'
import leaderboardLeadersBadge from '~/assets/leaderboard-leaders-badge.svg'
import leaderboardPillars from '~/assets/leaderboard-pillars.svg'

const columnHelper = createColumnHelper()

//@ts-ignore
const Table = ({ data, userFuulData }) => {
    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState<string>('')

    const columns = [
        columnHelper.accessor('rank', {
            header: 'Rank',
            cell: (info) => {
                const rank = info.getValue()
                let color = '#8DB2FF'
                let badge = null
                if (rank <= 3) {
                    color = '#FFFFFF'
                    badge = <BadgeImage src={leaderboardLeadersBadge} alt="leaderboard-badge" />
                } else if (rank === userFuulData.rank) {
                    color = '#FFFFFF'
                }
                return (
                    <RankContainer>
                        {badge}
                        <Rank style={{ color }}>{rank}</Rank>
                    </RankContainer>
                )
            },
        }),
        columnHelper.accessor('address', {
            header: 'Address',
            cell: (info) => {
                const address = info.getValue()
                return (
                    <Address>
                        {userFuulData.address === address && <Badge>YOU</Badge>}
                        {returnWalletAddress(address, 2)}
                    </Address>
                )
            },
        }),
        columnHelper.accessor('points', {
            header: 'Points',
            //@ts-ignore
            cell: (info) => <Points>{info.getValue().toLocaleString()}</Points>,
        }),
    ]

    let displayData = [...data.slice(0, 10)]
    if (userFuulData.points) {
        //@ts-ignore
        const userInTop10 = data.find((user) => user.address === userFuulData.address && user.rank <= 10)
        if (!userInTop10) {
            displayData.push(userFuulData)
        }
    }

    const table = useReactTable({
        data: displayData,
        //@ts-ignore
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
            <PillarsImage src={leaderboardPillars} alt="leaderboard-pillars" />
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
                        //@ts-ignore
                        <tr
                            key={row.id}
                            style={
                                //@ts-ignore
                                row.original.address === userFuulData.address
                                    ? { backgroundColor: '#8DB2FF99', borderRadius: '14px' }
                                    : { backgroundColor: '#1A74EC', borderRadius: '14px' }
                            }
                        >
                            {row.getVisibleCells().map((cell, index) => (
                                <td
                                    key={cell.id}
                                    style={
                                        index === 2
                                            ? { textAlign: 'right', paddingRight: '20px' }
                                            : { paddingRight: '20px' } && index === 0
                                            ? { paddingTop: '16px', paddingBottom: '16px' }
                                            : {}
                                    }
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </TableContainer>
    )
}

export default Table

const RankContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
`

const BadgeImage = styled.img`
    position: absolute;
    width: 48px;
    height: 48px;
`

const Rank = styled.span`
    font-family: 'Open Sans', sans-serif;
    font-weight: 700;
    font-size: ${(props: any) => props.theme.font.default};
    line-height: 27px;
    z-index: 1;
`

const Address = styled.span`
    font-family: 'Open Sans', sans-serif;
    font-weight: 700;
    font-size: ${(props: any) => props.theme.font.xSmall};
    line-height: 21.79px;
    letter-spacing: 0.05em;
    color: #eeeeee;
`

const Points = styled.span`
    font-family: 'Open Sans', sans-serif';
    font-weight: 700;
    font-size: 13px;
    line-height: 20px;
`

const Badge = styled.span`
    background-color: #e2f1ff;
    color: #1a74ec;
    padding: 2px 8px;
    border-radius: 4px;
    margin-right: 8px;
    font-family: 'Open Sans', sans-serif;
    font-weight: 700;
    font-size: 12px;
`

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
    overflow: visible;
    position: relative;
    table {
        width: 100%;
        border-collapse: collapse;
        gap: 16px;
        background-color: rgba(255, 255, 255, 0);
        backdrop-filter: blur(10px);
        border-radius: 14px;
    }
    th,
    td {
        padding: 8px 0 8px 0;
        text-align: left;
        text-transform: uppercase;
    }

    th {
        display: none;
    }

    tr:not(:last-child) td {
        border-bottom: none;
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
            margin-bottom: 20px;
            border-bottom: 4px solid #ddd;
        }

        td {
            position: relative;
            text-align: center;
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

const PillarsImage = styled.img`
    display: block;
    position: absolute;
    top: -197px;
    right: -0.6px;
    width: 217px;
    height: auto;
    z-index: 10;

    @media (max-width: 768px) {
        display: none;
    }
`
