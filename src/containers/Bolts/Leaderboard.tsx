import './leaderboard.css'
import React, { useEffect, useMemo, useState } from 'react'
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table'
import styled from 'styled-components'
import { ArrowDown, ArrowUp } from 'react-feather'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import leaderboardLeadersBadge from '~/assets/leaderboard-leaders-badge.svg'
import leaderboardPillars from '~/assets/leaderboard-pillars.svg'
import AddressCell from '~/components/Bolts/AddressCell'
import { LeaderboardUser } from '~/model/boltsModel'

const columnHelper = createColumnHelper()

// @ts-ignore
const Table = ({ data, userFuulData }) => {
    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState<string>('')
    const [isTableReady, setIsTableReady] = useState(false)
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        if (isTableReady) {
            setIsReady(true)
        }
    }, [isTableReady])

    useEffect(() => {
        setIsTableReady(true)
    }, [data])

    const displayData = useMemo(() => {
        let dataToDisplay = [...data.slice(0, 10)]
        if (userFuulData.points) {
            const userInTop10 = data.find(
                (user: LeaderboardUser) => user.address === userFuulData.address && user.rank <= 10
            )
            if (!userInTop10) {
                dataToDisplay.push(userFuulData)
            }
        }
        return dataToDisplay
    }, [data, userFuulData])

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
                    color = '#1A74EC'
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
                return <AddressCell address={address} userFuulDataAddress={userFuulData.address} data={data} />
            },
        }),
        columnHelper.accessor('points', {
            header: 'Points',
            // @ts-ignore
            cell: (info) => <Points>{info.getValue().toLocaleString()}</Points>,
        }),
    ]

    const table = useReactTable({
        data: displayData,
        // @ts-ignore
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
            {isReady && <PillarsImage src={leaderboardPillars} alt="leaderboard-pillars" />}
            <TableWrapper>
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
                    {isTableReady
                        ? table.getRowModel().rows.map((row, rowIndex) => (
                              <tr
                                  key={row.id}
                                  style={
                                      // @ts-ignore
                                      row.original.address === userFuulData.address
                                          ? { backgroundColor: '#8DB2FF99' }
                                          : { backgroundColor: '#1A74EC' }
                                  }
                              >
                                  {row.getVisibleCells().map((cell, index) => {
                                      let tdStyle: any = {}
                                      if (index === 2)
                                          tdStyle = { textAlign: 'right', paddingRight: '20px', color: '#eeeeee' }
                                      else tdStyle = { paddingTop: '10px', color: '#eeeeee' }
                                      if (index === 0) tdStyle.paddingBottom = '10px'
                                      // @ts-ignore
                                      if (row?.original.address === userFuulData.address) tdStyle.color = '#1A74EC'

                                      return (
                                          <td key={cell.id} style={tdStyle}>
                                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                          </td>
                                      )
                                  })}
                              </tr>
                          ))
                        : new Array(10).fill(0).map((_, index) => (
                              <tr key={index} style={{ backgroundColor: '#1A74EC' }}>
                                  <td style={{ paddingTop: '10px', paddingBottom: '10px', color: '#eeeeee' }}>
                                      <Skeleton height={20} width={50} />
                                  </td>
                                  <td style={{ paddingTop: '10px', paddingBottom: '10px', color: '#eeeeee' }}>
                                      <Skeleton height={20} width={150} />
                                  </td>
                                  <td style={{ textAlign: 'right', paddingRight: '20px', color: '#eeeeee' }}>
                                      <Skeleton height={20} width={80} />
                                  </td>
                              </tr>
                          ))}
                </tbody>
            </TableWrapper>
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
    position: fixed;
    padding-left: 8px;
    width: 48px;
    height: 48px;
`

const Rank = styled.span`
    font-family: 'Open Sans', sans-serif;
    font-weight: 700;
    padding-top: 4px;
    padding-bottom: 4px;
    padding-left: 8px;
    font-size: ${(props: any) => props.theme.font.default};
    line-height: 27px;
    z-index: 1;
`

const Points = styled.span`
    font-family: 'Open Sans', sans-serif;
    font-weight: 700;
    font-size: 13px;
    line-height: 20px;
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

const TableWrapper = styled.table`
    width: 100%;
    min-width: 100%;
    min-height: 400px;
    border-collapse: collapse;
    background-color: rgba(255, 255, 255, 0);
    backdrop-filter: blur(10px);
    @media (max-width: 768px) {
        border-radius: 14px;
    }
`

const TableContainer = styled.div`
    overflow: visible;
    position: relative;
    margin-bottom: 20px;
    min-height: 400px;
    min-width: 100%;
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
            display: block;
            width: 100%;
            overflow-x: auto;
        }

        thead {
            display: none;
        }

        tbody {
            display: flex;
            flex-direction: column;
        }

        tr {
            display: flex;
            flex-direction: row;
            align-items: center;
            border-radius: 0;
        }

        td {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0px 24px 0px 24px;
            border: none;
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
    pointer-events: none;
    z-index: 10;

    @media (max-width: 768px) {
        display: none;
    }
`
