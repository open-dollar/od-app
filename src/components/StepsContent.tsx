import React, { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Circle, X } from 'react-feather'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import Button from './Button'
import { formatNumber } from '../utils/helper'
import { useActiveWeb3React } from '../hooks'
import { utils } from 'geb.js'
import { parseRad } from '../utils/gebManager'
import { geb as gebNode } from '../utils/constants'
import Loader from './Loader'
import useGeb from 'src/hooks/useGeb'

interface Props {
    title: string
    text: string
    stepNumber: number
    btnText: string
    handleClick: () => void
    isDisabled: boolean
    isLoading: boolean
    id: string
}

const StepsContent = ({
    title,
    text,
    stepNumber,
    btnText,
    handleClick,
    isDisabled,
    isLoading,
    id,
}: Props) => {
    const geb = useGeb()
    const { t } = useTranslation()
    const { account } = useActiveWeb3React()
    const [debtFloor, setDebtFloor] = useState('')
    const [isOpen, setIsOpen] = useState(true)

    const gebCall = useMemo(() => {
        if (account) {
            return geb
        }
        return gebNode
    }, [account, geb])

    useEffect(() => {
        if (!gebCall) return
        gebCall.contracts.safeEngine
            .collateralTypes(utils.ETH_A)
            .then((res) => setDebtFloor(parseRad(res.debtFloor)))
            .catch((e) => console.log(e))
    }, [gebCall])

    const handleOpenState = () => setIsOpen(!isOpen)

    return (
        <Container id={id}>
            <Title>{t(title)}</Title>
            <Text>
                {t(text)}{' '}
                {isOpen ? null : (
                    <ReadLink onClick={handleOpenState}>Show more</ReadLink>
                )}
            </Text>
            {isOpen ? (
                <Notes>
                    <CloseBtn onClick={handleOpenState}>
                        <X size="14" />
                    </CloseBtn>
                    <Heading>
                        <AlertCircle color={`#D09E41`} size="22" /> Important
                        Notes
                    </Heading>
                    <List>
                        <Item>
                            <Circle className="bullet" size="10" />
                            {`You do not need to create a new account if you already have a MakerDAO or Balancer proxy`}
                        </Item>
                        <Item>
                            <Circle className="bullet" size="10" />
                            The minimum amount to mint per safe is{' '}
                            <span>
                                {!debtFloor ? (
                                    <Loader inlineButton />
                                ) : (
                                    Math.ceil(Number(formatNumber(debtFloor)))
                                )}
                            </span>{' '}
                            RAI
                        </Item>
                    </List>
                </Notes>
            ) : null}
            <Button
                data-test-id="steps-btn"
                id={stepNumber === 2 ? 'create-safe' : ''}
                disabled={isDisabled || isLoading}
                isLoading={isLoading}
                text={t(btnText)}
                onClick={handleClick}
            />
        </Container>
    )
}

export default StepsContent

const Container = styled.div`
    text-align: center;
    margin-top: 20px;
`

const Title = styled.div`
    font-size: ${(props) => props.theme.font.large};
    font-weight: 600;
    color: ${(props) => props.theme.colors.neutral};
    margin-bottom: 10px;
`

const Text = styled.div`
    font-size: ${(props) => props.theme.font.small};
    color: ${(props) => props.theme.colors.secondary};
    margin-bottom: 20px;
    line-height: 21px;
`

const Notes = styled.div`
    background: rgba(65, 193, 208, 0.4);
    border-radius: 25px;
    padding: 20px;
    margin-bottom: 20px;
    position: relative;
`

const Heading = styled.div`
    font-size: 18px;
    text-align: center;
    font-weight: bold;
    color: ${(props) => props.theme.colors.neutral};
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
        margin-right: 5px;
    }
`

const List = styled.ul`
    margin: 0;
    padding-left: 20px;
    list-style: none;
    @media (max-width: 767px) {
        padding-left: 0;
    }
`

const Item = styled.li`
    font-size: 15px;
    text-align: left;
    color: ${(props) => props.theme.colors.neutral};
    margin-top: 5px;

    span > div {
        margin: 0;
    }
    svg {
        margin: 0;
    }

    .bullet {
        margin-right: 5px;
        stroke-width: 0;
        fill: #d09e41;
    }

    @media (max-width: 767px) {
        font-size: 13px;
        svg {
            width: 8px !important;
            height: 8px !important;
        }
    }
`

const CloseBtn = styled.div`
    position: absolute;
    top: 15px;
    right: 15px;
    cursor: pointer;
    svg {
        color: ${(props) => props.theme.colors.secondary};
    }
`

const ReadLink = styled.span`
    color: ${(props) => props.theme.colors.blueish};
    text-decoration: underline;
    cursor: pointer;
`
