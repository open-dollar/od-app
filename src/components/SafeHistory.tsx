import React, { useEffect, useState, useCallback } from 'react'
import ReactPaginate from 'react-paginate'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useStoreState } from '../store'
import { ISafeHistory } from '../utils/interfaces'
import dayjs from 'dayjs'
import { returnWalletAddress } from '../utils/helper'
import FeatherIconWrapper, { IconName } from './FeatherIconWrapper'
import SafeIcon from './Icons/SafeIcon'

interface Props {
    hideHistory?: boolean
}
const SafeHistory = ({ hideHistory }: Props) => {
    const { t } = useTranslation()
    const [page, setPage] = useState(0)
    const [perPage] = useState(5)
    const [total, setTotal] = useState(0)
    const { safeModel: safeState } = useStoreState((state) => state)

    const returnIcon = (color: string, icon: IconName) => {
        if (color) {
            return <FeatherIconWrapper name={icon} className={color} />
        }
        return <SafeIcon />
    }
    const formatRow = (item: ISafeHistory, i: number) => {
        const { title, date, amount, link, txHash, icon, color } = item
        const humanizedAmount =
            amount.toString().length < 4 ? amount : amount.toFixed(4)
        const humanizedDate = dayjs
            .unix(Number(date))
            .format('MMM D, YYYY h:mm A')
        return (
            <Row key={title + i}>
                <Col>
                    {returnIcon(color, icon)}
                    {title}
                </Col>
                <Col>{humanizedDate}</Col>
                <Col>{humanizedAmount}</Col>
                <Col>
                    <ExternalLink href={link} target="_blank">
                        {returnWalletAddress(txHash)}{' '}
                        <img
                            src={require('../assets/arrow-up.svg').default}
                            alt=""
                        />
                    </ExternalLink>
                </Col>
            </Row>
        )
    }

    const handlePageClick = ({ selected }: any) => {
        setPage(selected)
    }

    const setPagination = (history: Array<ISafeHistory>) => {
        if (!history.length) return
        setTotal(Math.ceil(history.length / perPage))
    }

    const setPaginationCB = useCallback(setPagination, [perPage])

    useEffect(() => {
        setPaginationCB(safeState.historyList)
    }, [setPaginationCB, safeState.historyList])

    return (
        <Container>
            <Title>
                {t('history')}{' '}
                {safeState.historyList.length
                    ? `- (${safeState.historyList.length})`
                    : null}
            </Title>
            {!safeState.historyList.length || hideHistory ? null : (
                <Header>
                    <Thead>Action</Thead>
                    <Thead>Date</Thead>
                    <Thead>Amount</Thead>
                    <Thead>Receipt</Thead>
                </Header>
            )}

            {!hideHistory || safeState.historyList.length > 0 ? (
                <>
                    {' '}
                    <List>
                        {safeState.historyList
                            .slice(page * perPage, (page + 1) * perPage)
                            .map((item: ISafeHistory, i: number) =>
                                formatRow(item, i)
                            )}
                    </List>
                    {safeState.historyList.length > perPage ? (
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
                    ) : null}
                </>
            ) : (
                <HideHistory>{t('no_history')}</HideHistory>
            )}
        </Container>
    )
}

export default SafeHistory

const Container = styled.div`
    border-radius: 15px;
    background: ${(props) => props.theme.colors.foreground};
    margin-top: 20px;
`

const Title = styled.div`
    color: ${(props) => props.theme.colors.primary};
    font-size: ${(props) => props.theme.font.default};
    line-height: 25px;
    letter-spacing: -0.47px;
    font-weight: 600;
    padding: 15px 20px;
`

const List = styled.div`
    padding: 0 20px;
`

const Header = styled.div`
    display: flex;
    padding: 12px 20px;
`
const Thead = styled.div`
    flex: 0 0 20%;
    text-align: right;
    font-size: 12px;
    &:first-child {
        flex: 0 0 40%;
        text-align: left;
    }
    color: ${(props) => props.theme.colors.blueish};
    letter-spacing: 0.01px;
    font-weight: normal;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    &:nth-child(2),
    &:nth-child(3) {
      display: none;
    }
    flex: 0 0 50%;
    &:nth-child(1) {
      flex: 0 0 50%;
    }
  `}
`

const Row = styled.div`
    display: flex;
    padding: 12px 0;
    border-top: 1px solid ${(props) => props.theme.colors.border};
`

const Col = styled.div`
    flex: 0 0 20%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    letter-spacing: -0.09px;
    &:first-child {
        flex: 0 0 40%;
        justify-content: flex-start;
    }
    color: ${(props) => props.theme.colors.secondary};
    font-size: ${(props) => props.theme.font.small};
    svg {
        margin-right: 11px;
        color: gray;
        width: 23px;
        height: 23px;
        &.gray {
            color: gray;
        }
        &.green {
            color: #4ac6b2;
        }
        &.red {
            color: red;
        }
    }
    &:nth-child(3) {
        color: ${(props) => props.theme.colors.primary};
    }

    ${({ theme }) => theme.mediaWidth.upToSmall`
    &:nth-child(2),
    &:nth-child(3) {
      display: none;
    }
    flex: 0 0 50%;
    &:nth-child(1) {
      flex: 0 0 50%;
    }
  `}

    ${({ theme }) => theme.mediaWidth.upToSmall`
      font-size:${(props) => props.theme.font.extraSmall};
    `}
`

const ExternalLink = styled.a`
    color: ${(props) => props.theme.colors.blueish};
    img {
        width: 8px;
        height: 8px;
        border-radius: 0;
        ${({ theme }) => theme.mediaWidth.upToSmall`
      width:8px;
      height:8px;
    `}
    }
`

const HideHistory = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 50px 0;
    font-size: ${(props) => props.theme.font.small};
`

const PaginationContainer = styled.div`
    text-align: right;
    border-top: 1px solid ${(props) => props.theme.colors.border};
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
                background: ${(props) => props.theme.colors.gradient};
                color: #fff;
                border-radius: 2px;
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
