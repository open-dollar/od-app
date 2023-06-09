import React, { useMemo, useState } from 'react'
import { BarChart2, Plus, Settings } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import CheckBox from '../../components/CheckBox'
import LinkButton from '../../components/LinkButton'
import SafeBlock from '../../components/SafeBlock'
import { useActiveWeb3React } from '../../hooks'
import { useStoreActions, useStoreState } from '../../store'
import { returnState } from '../../utils/helper'
import { ISafe } from '../../utils/interfaces'

const SafeList = ({ address }: { address?: string }) => {
    const [showEmpty, setShowEmpty] = useState(true)

    const { account } = useActiveWeb3React()

    const { t } = useTranslation()

    const { connectWalletModel: connectWalletState, safeModel: safeState } =
        useStoreState((state) => state)

    const { popupsModel: popupsActions } = useStoreActions((state) => state)

    const safes = useMemo(() => {
        if (safeState.list.length > 0) {
            return showEmpty
                ? safeState.list
                : safeState.list.filter(
                      (safe) => returnState(safe.riskState) !== ''
                  )
        }
        return []
    }, [safeState.list, showEmpty])

    const isOwner = useMemo(
        () =>
            address && account
                ? account.toLowerCase() === address.toLowerCase()
                : true,
        [account, address]
    )

    const handleTopup = () => {
        if (!connectWalletState.isWrongNetwork) {
            popupsActions.setIsSafeManagerOpen(true)
        }
        return
    }

    const returnSafeList = () => {
        if (safeState.list.length > 0) {
            return (
                <Container>
                    <Header>
                        <Col>
                            <Title>{'Accounts'}</Title>
                        </Col>
                        <Col>
                            {safeState.safeCreated && isOwner ? (
                                <LinkButton
                                    id="create-safe"
                                    disabled={connectWalletState.isWrongNetwork}
                                    url={'/safes/create'}
                                >
                                    <BtnInner>
                                        <Plus size={18} />
                                        {t('new_safe')}
                                    </BtnInner>
                                </LinkButton>
                            ) : null}
                        </Col>
                    </Header>

                    <InfoBox>
                        <LeftSide>
                            <InfoTitle>
                                <BarChart2 size="16" /> Pools And Incentives
                            </InfoTitle>
                            <InfoText>
                                Check about FLX distribution campaigns from our{' '}
                                <Link to="/earn/incentives">
                                    Incentives page
                                </Link>
                                , also you can read more about incentives from
                                our{' '}
                                <a
                                    href="https://docs.reflexer.finance/incentives/rai-mint-+-lp-incentives-program"
                                    rel="noopener noreferrer"
                                    target="_blank"
                                >
                                    docs
                                </a>
                            </InfoText>
                        </LeftSide>
                        <RightSide onClick={handleTopup}>
                            <InfoTitle>
                                <Settings size="16" /> View / Top-up other Safes
                            </InfoTitle>
                            <InfoText className="bigFont">
                                You can add ETH or repay RAI for any Safe
                            </InfoText>
                        </RightSide>
                    </InfoBox>
                    <SafeBlocks>
                        <Header className="safesList">
                            <Col>Safes({safeState.list.length})</Col>
                            <Col>Risk</Col>
                        </Header>
                        {safes.map((safe: ISafe) => (
                            <SafeBlock
                                className="safeBlock"
                                key={safe.id}
                                {...safe}
                            />
                        ))}
                    </SafeBlocks>
                    <CheckboxContainer>
                        <CheckBox checked={showEmpty} onChange={setShowEmpty} />
                        <span>Show empty safes</span>
                    </CheckboxContainer>
                </Container>
            )
        }
        return null
    }

    return <>{returnSafeList()}</>
}

export default SafeList

const Container = styled.div`
    max-width: 880px;
    margin: 80px auto;
    padding: 0 15px;
    @media (max-width: 767px) {
        margin: 50px auto;
    }
`
const SafeBlocks = styled.div`
    padding: 15px;
    border-radius: 15px;
    background: ${(props) => props.theme.colors.colorSecondary};
`

const Title = styled.div`
    font-weight: 600;
    font-size: ${(props) => props.theme.font.large};
`

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
    &.safesList {
        padding: 0 20px;
        margin: 20px 0;
    }
`
const Col = styled.div`
    a {
        min-width: 100px;
        padding: 4px 12px;
    }
`

const BtnInner = styled.div`
    display: flex;
    align-items: center;
    svg {
        margin-right: 5px;
    }
`

const CheckboxContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: 20px;
    justify-content: flex-end;
    span {
        margin-left: 10px;
        position: relative;
        font-size: 13px;
        top: -3px;
    }
`

const InfoBox = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    @media (max-width: 767px) {
        display: none;
    }
`

const LeftSide = styled.div`
    flex: 0 0 56%;
    background: url(${require('../../assets/blueish-bg.png').default});
    background-repeat: no-repeat;
    background-size: cover;
    padding: 20px;
    border-radius: 15px;
`
const RightSide = styled.div`
    flex: 0 0 42%;
    background: url(${require('../../assets/greenish-bg.png').default});
    background-repeat: no-repeat;
    background-size: cover;
    padding: 20px;
    border-radius: 15px;
    cursor: pointer;
`

const InfoTitle = styled.div`
    display: flex;
    align-items: center;
    font-size: ${(props) => props.theme.font.default};
    font-weight: 600;
    svg {
        margin-right: 5px;
    }
`

const InfoText = styled.div`
    font-size: ${(props) => props.theme.font.small};
    margin-top: 10px;
    a {
        color: ${(props) => props.theme.colors.blueish};
        text-decoration: underline;
    }
    &.bigFont {
        font-size: ${(props) => props.theme.font.default};
    }
`
