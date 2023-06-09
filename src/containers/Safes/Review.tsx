import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import TransactionOverview from '../../components/TransactionOverview'
import { useActiveWeb3React } from '../../hooks'
import { returnConnectorName } from '../../utils/helper'

import { Info } from 'react-feather'
import { SafeTypes, StatsType, useSafeInfo } from '../../hooks/useSafe'

const ReviewTransaction = ({ type }: { type: SafeTypes }) => {
    const { stats } = useSafeInfo(type)
    const { t } = useTranslation()
    const { connector } = useActiveWeb3React()

    return (
        <Box>
            <TransactionOverview
                isChecked={false}
                title={t('confirm_transaction_details')}
                description={
                    t('confirm_details_text') +
                    (returnConnectorName(connector)
                        ? 'on ' + returnConnectorName(connector)
                        : '')
                }
            />
            <Stats>
                {Object.keys(stats).map((key) => {
                    const isPrimary = key === 'data'
                    return (
                        <div key={key} className="blockie">
                            {stats[key as StatsType].map((item) => {
                                return (
                                    <Flex key={item.label}>
                                        <Label
                                            color={
                                                isPrimary
                                                    ? 'primary'
                                                    : 'secondary'
                                            }
                                        >
                                            {item.tip ? (
                                                <InfoIcon data-tip={item.tip}>
                                                    <Info size="13" />
                                                </InfoIcon>
                                            ) : null}
                                            {item.label}
                                        </Label>
                                        <Value>{item.value}</Value>
                                    </Flex>
                                )
                            })}
                        </div>
                    )
                })}
            </Stats>
        </Box>
    )
}

export default ReviewTransaction
const Box = styled.div``
const Stats = styled.div`
    padding: 20px;
    border-radius: 10px;
    background: ${(props) => props.theme.colors.placeholder};
    .blockie {
        border-bottom: 1px solid ${(props) => props.theme.colors.border};
        &:last-child {
            border: 0;
        }
    }
    @media (max-width: 767px) {
        margin-top: 20px;
    }
`

const Flex = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 13px 0;
    &.hasBtn {
        margin: 0 0 20px 0;
        button {
            width: 100%;
            text-align: center;
            flex: 0 0 48%;
        }
        @media (max-width: 767px) {
            flex-direction: column;
            button {
                margin-top: 20px;
            }
        }
    }
`
const Label = styled.div<{ color?: 'primary' | 'secondary' }>`
    font-size: ${(props) => props.theme.font.small};
    color: ${({ theme, color }) =>
        color ? theme.colors[color] : theme.colors.primary};
    display: flex;
    align-items: center;
    svg {
        margin-right: 5px;
    }
`

const Value = styled.div`
    font-size: ${(props) => props.theme.font.small};
    color: ${(props) => props.theme.colors.primary};
`

const InfoIcon = styled.div`
    cursor: pointer;
    svg {
        fill: ${(props) => props.theme.colors.secondary};
        color: ${(props) => props.theme.colors.placeholder};
        position: relative;
        top: 2px;
    }
`
