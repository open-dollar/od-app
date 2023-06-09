import React, { useCallback, useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import styled from 'styled-components'
import { IPaging } from '../utils/interfaces'

interface Props {
    items: Array<any>
    perPage: number
    handlePagingMargin: ({ from, to }: IPaging) => void
}

const Pagination = ({ items, handlePagingMargin, perPage = 5 }: Props) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [total, setTotal] = useState(0)

    const setPagination = (itemsArray: Array<any>) => {
        if (!itemsArray.length) return
        setTotal(Math.ceil(itemsArray.length / perPage))
    }

    const setPaginationCB = useCallback(setPagination, [perPage])

    useEffect(() => {
        setPaginationCB(items)
    }, [setPaginationCB, items])

    const handlePageClick = ({ selected }: any) => {
        const from = selected * perPage
        const to = (selected + 1) * perPage
        handlePagingMargin({ from, to })
    }

    return items.length > perPage ? (
        <PaginationContainer>
            <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={total}
                marginPagesDisplayed={2}
                pageRangeDisplayed={4}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
            />
        </PaginationContainer>
    ) : null
}

export default Pagination

const PaginationContainer = styled.div`
    text-align: right;
    margin-top: 0.5rem;
    padding-right: 0.7rem;

    .pagination {
        padding: 0;
        list-style: none;
        display: inline-block;
        border-radius: ${(props) => props.theme.global.borderRadius};

        li {
            display: inline-block;
            vertical-align: middle;
            cursor: pointer;
            text-align: center;
            outline: none;
            box-shadow: none;
            margin: 0 2px;
            font-size: ${(props) => props.theme.font.small};
            &.active {
                background: ${(props) => props.theme.colors.blueish};
                color: #fff;
                border-radius: 50%;
            }
            a {
                justify-content: center;
                display: flex;
                align-items: center;
                height: 20px;
                width: 20px;
                outline: none;
                box-shadow: none;

                &:hover {
                    background: rgba(0, 0, 0, 0.08);
                }
            }

            &:first-child {
                margin-right: 10px;
            }

            &:last-child {
                margin-left: 10px;
            }

            &:first-child,
            &:last-child {
                padding: 0;
                a {
                    height: auto;
                    width: auto;
                    padding: 3px 8px;
                    border-radius: 2px;
                    &:hover {
                        background: rgba(0, 0, 0, 0.08);
                    }
                    text-align: center;
                }

                &.active {
                    a {
                        background: ${(props) => props.theme.colors.gradient};
                        color: #fff;
                        border-radius: ${(props) =>
                            props.theme.global.borderRadius};
                    }
                }

                &.disabled {
                    pointer-events: none;
                    opacity: 0.2;
                }
            }
        }
    }
`
