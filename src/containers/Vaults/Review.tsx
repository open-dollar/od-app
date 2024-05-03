import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Info } from 'react-feather'

import { useActiveWeb3React, SafeTypes, StatsType, useSafeInfo } from '~/hooks'
import TransactionOverview from '~/components/TransactionOverview'
import { returnConnectorName } from '~/utils'
import { Tooltip as ReactTooltip } from 'react-tooltip'

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
                    // @ts-ignore
                    (returnConnectorName(connector) ? 'on ' + returnConnectorName(connector) : '')
                }
            />
            <Stats>
                <span className="Overview">Overview</span>
                {Object.keys(stats).map((key) => {
                    const isPrimary = key === 'data'
                    return (
                        <div key={key} className="blockie">
                            <ReactTooltip
                                style={{ zIndex: '10' }}
                                id="tooltip-review"
                                variant="light"
                                data-effect="solid"
                            />
                            {stats[key as StatsType].map((item) => {
                                return (
                                    <Flex key={item.label}>
                                        <Label color={isPrimary ? 'primary' : 'secondary'}>
                                            {item.label}
                                            {item.tip ? (
                                                <InfoIcon
                                                    data-tooltip-id="tooltip-review"
                                                    data-tooltip-content={item.tip}
                                                >
                                                    <Info color="#1C293A" size="20" />
                                                </InfoIcon>
                                            ) : null}
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
    .Overview {
        font-size: 22px;
        color: #1c293a;
        line-height: 26.4px;
        font-weight: 700;
    }
    padding: 20px;
    border-radius: 4px;
    background: #e2f1ff;
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
    font-size: 18px;
    font-family: 'Open Sans', sans-serif;
    color: #1c293a;
    display: flex;
    align-items: center;
    svg {
        margin-right: 5px;
    }
`

const Value = styled.div`
    font-size: 20px;
    font-family: 'Open Sans', sans-serif;
    font-weight: 700;
    line-height: 26.4px;
    color: ${(props) => props.theme.colors.primary};
`

const InfoIcon = styled.div`
    cursor: pointer;
    svg {
        opacity: 0.5;
        margin-left: 4px;
        color: #1c293a;
    }
`
