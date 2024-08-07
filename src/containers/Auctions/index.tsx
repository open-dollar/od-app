import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import styled from 'styled-components'

import { useActiveWeb3React, handleTransactionError, useStartAuction, useGetAuctions } from '~/hooks'
import AlertLabel from '~/components/AlertLabel'
import { AuctionEventType } from '~/types'
import { useStoreActions, useStoreState } from '~/store'
import AuctionsList from './AuctionsList'
import Button from '~/components/Button'
import { formatNumber } from '~/utils'
import useGeb from '~/hooks/useGeb'
import CollateralAuctionsList from './CollateralAuctions/CollateralAuctionsList'
import MetaTags from '~/components/MetaTags'
import metaInfo from '~/utils/metaInfo'

interface AuctionsProps {
    className?: string
}

const Auctions = ({ className }: AuctionsProps) => {
    const { id } = useParams<{ id: string }>()
    const auctionType = id ?? ''
    const location = useLocation()
    const query = new URLSearchParams(location.search)
    const queryType = query.get('type') as AuctionEventType | null
    const [type, setType] = useState<AuctionEventType>(queryType || 'COLLATERAL')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [selectedItem, setSelectedItem] = useState<string>('WSTETH')
    const navigate = useNavigate()
    const { account } = useActiveWeb3React()
    const geb = useGeb()
    const { auctionModel: auctionsActions, popupsModel: popupsActions } = useStoreActions((state) => state)
    const { auctionModel: auctionsState, connectWalletModel: connectWalletState } = useStoreState((state) => state)
    const { proxyAddress } = connectWalletState

    const {
        startSurplusAcution,
        startDebtAcution,
        surplusAmountToSell,
        debtAmountToSell,
        protocolTokensOffered,
        systemSurplus,
        systemDebt,
        allowStartSurplusAuction,
        allowStartDebtAuction,
        deltaToStartSurplusAuction,
        deltaToStartDebtAuction,
        surplusCooldownDone,
    } = useStartAuction()

    const getText = () => {
        switch (type) {
            case 'COLLATERAL':
                return 'Collateral seized during liquidations are sold at a discount. The OD received is burned.'
            case 'SURPLUS':
                return 'Surplus auctions sell OD that has accrued inside the protocol in exchange for ODG. The ODG that is received by an auction is burned.'
            case 'DEBT':
                return 'Debt auctions mint and auction new ODG in exchange for OD. The OD that is received by an auction will be used to eliminate bad (uncovered) debt from the system.'
        }
    }

    const handleStartSurplusAuction = async () => {
        setIsLoading(true)
        try {
            popupsActions.setIsWaitingModalOpen(true)
            popupsActions.setWaitingPayload({
                title: 'Waiting For Confirmation',
                hint: 'Confirm this transaction in your wallet',
                status: 'loading',
            })
            await startSurplusAcution()
        } catch (e) {
            handleTransactionError(e)
        } finally {
            setIsLoading(false)
        }
    }

    const handleStartDebtAuction = async () => {
        setIsLoading(true)
        try {
            popupsActions.setIsWaitingModalOpen(true)
            popupsActions.setWaitingPayload({
                title: 'Waiting For Confirmation',
                hint: 'Confirm this transaction in your wallet',
                status: 'loading',
            })
            await startDebtAcution()
        } catch (e) {
            handleTransactionError(e)
        } finally {
            setIsLoading(false)
        }
    }

    const onTabClick = (type: AuctionEventType) => {
        const params = new URLSearchParams()
        if (type) {
            params.append('type', type)
        }
        navigate({ search: params.toString() })
        setType(type)
    }

    const auctions = useGetAuctions(type, selectedItem)

    // fetch collateral price every time selectedItem changes
    useEffect(() => {
        if (geb && auctions) {
            const auctionsIds = auctions.map((auction) => auction.auctionId)
            auctionsActions.fetchCollateralData({ geb, collateral: selectedItem, auctionIds: auctionsIds })
        }
    }, [auctions, auctionsActions, geb, selectedItem])

    useEffect(() => {
        if (queryType) {
            setType(queryType)
        } else {
            setType('COLLATERAL')
        }
    }, [queryType])

    useEffect(() => {
        async function fetchAuctions() {
            try {
                await auctionsActions.fetchAuctions({
                    geb,
                    type,
                    tokenSymbol: type && type === 'COLLATERAL' ? selectedItem : undefined,
                })
                setError('')
            } catch (error) {
                console.log(error)
                if (error instanceof SyntaxError && error.message.includes('failed')) {
                    setError('Failed to fetch auctions from the graph node')
                }
            }
        }
        if (geb && !auctions) fetchAuctions()
    }, [auctionType, auctions, auctionsActions, geb, selectedItem, type])

    useEffect(() => {
        if (geb && proxyAddress && !auctionsState.auctionsData) auctionsActions.fetchAuctionsData({ geb, proxyAddress })
    }, [auctionsActions, geb, proxyAddress, auctionsState.auctionsData])

    return (
        <>
            <MetaTags page={metaInfo.auctions} />
            <Container className={className}>
                {error ? <AlertLabel type="danger" text={error} /> : null}
                <Content>
                    <Title>Auctions</Title>
                </Content>

                <Switcher>
                    <Tab className={type === 'COLLATERAL' ? 'active' : ''} onClick={() => onTabClick('COLLATERAL')}>
                        Collateral
                    </Tab>
                    <Tab className={type === 'SURPLUS' ? 'active' : ''} onClick={() => onTabClick('SURPLUS')}>
                        Surplus
                    </Tab>
                    <Tab className={type === 'DEBT' ? 'active' : ''} onClick={() => onTabClick('DEBT')}>
                        Debt
                    </Tab>
                </Switcher>
                <Description>{getText()}</Description>
                <Wrapper>
                    {type === 'SURPLUS' && account ? (
                        <StartAuctionContainer>
                            <Box style={{ justifyContent: 'space-between' }}>
                                <div>
                                    <Box>
                                        <SurplusTitle>System Surplus: </SurplusTitle>
                                        <span>{formatNumber(systemSurplus, 2)} OD</span>
                                    </Box>
                                    <Box>
                                        <SurplusTitle>Surplus Amount to Sell: </SurplusTitle>
                                        <span>{formatNumber(surplusAmountToSell, 2)} OD</span>
                                    </Box>

                                    {!surplusCooldownDone || allowStartSurplusAuction ? null : (
                                        <Box>
                                            ({formatNumber(deltaToStartSurplusAuction, 2)} OD) to start an auction
                                        </Box>
                                    )}

                                    {!surplusCooldownDone && <Box>Cooldown period is active</Box>}
                                </div>
                                <Button
                                    text={'Start Surplus Auction'}
                                    onClick={handleStartSurplusAuction}
                                    isLoading={isLoading}
                                    disabled={isLoading || !allowStartSurplusAuction}
                                />
                            </Box>
                        </StartAuctionContainer>
                    ) : null}

                    {type === 'DEBT' && account ? (
                        <StartAuctionContainer>
                            <Box style={{ justifyContent: 'space-between' }}>
                                <div>
                                    <Box>
                                        <SurplusTitle>System Debt: </SurplusTitle>
                                        <span>{formatNumber(systemDebt, 2)} OD</span>
                                    </Box>
                                    <Box>
                                        <SurplusTitle>Debt Amount to Sell: </SurplusTitle>
                                        <span>{formatNumber(debtAmountToSell, 2)} OD</span>
                                    </Box>
                                    <Box>
                                        <SurplusTitle>Protocol Tokens to be Offered: </SurplusTitle>
                                        <span>{formatNumber(protocolTokensOffered, 2)} ODG</span>
                                    </Box>

                                    {allowStartDebtAuction ? null : (
                                        <Box>({formatNumber(deltaToStartDebtAuction, 2)} OD) to start an auction</Box>
                                    )}
                                </div>
                                <Button
                                    text={'Start Debt Auction'}
                                    onClick={handleStartDebtAuction}
                                    isLoading={isLoading}
                                    disabled={isLoading || !allowStartDebtAuction}
                                />
                            </Box>
                        </StartAuctionContainer>
                    ) : null}
                    {type === 'COLLATERAL' ? (
                        <CollateralAuctionsList selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
                    ) : (
                        <AuctionsList type={type} selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
                    )}
                </Wrapper>
            </Container>
        </>
    )
}

export default Auctions

const Container = styled.div`
    max-width: 1362px;
    margin: 80px auto;
    padding: 0 15px;
    @media (max-width: 767px) {
        margin: 50px auto;
    }
`

const Wrapper = styled.div`
    background: white;
    border-radius: 4px;
`

const Description = styled.div`
    border-radius: 3px;
    padding: 10px 20px;
    background: white;

    font-weight: 700;
    color: ${(props) => props.theme.colors.accent};
    text-align: center;
`

const Title = styled.div`
    font-size: 34px;
    font-weight: 700;
    font-family: ${(props) => props.theme.family.headers};
    color: ${(props) => props.theme.colors.accent};
    min-width: 180px;
`
const Content = styled.div`
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    button {
        display: flex;
        align-items: center;
        min-width: 100px;
        padding: 4px 12px;
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 2px;
        color: ${(props) => props.theme.colors.accent};
    }
`

const Switcher = styled.div`
    display: flex;
    align-items: 'center';
    border-radius: 8px;
    background: white;
    width: 100%;
    margin: 10px 0 0 0;
    padding: 10px;
    flex-wrap: wrap;
    gap: 25px;
`

const Tab = styled.div`
    background: white;
    flex: 1;
    text-align: center;
    min-width: fit-content;
    cursor: pointer;
    border-radius: 3px;
    padding: 10px 20px;
    color: ${(props) => props.theme.colors.primary};
    font-weight: 700;
    font-family: ${(props) => props.theme.family.headers};
    &.active {
        background: ${(props) => props.theme.colors.primary};
        color: white;
    }
`

const Box = styled.div`
    display: flex;
    align-items: center;
    color: ${(props) => props.theme.colors.tertiary};
    span {
        font-weight: bold;
    }

    @media (max-width: 767px) {
        flex-direction: column;
        margin-bottom: 15px;
    }
`
const SurplusTitle = styled.h3`
    font-size: 16px;
    margin-right: 10px;
    font-weight: normal;
`

const StartAuctionContainer = styled.div`
    padding: 10px 20px;
    border-radius: 15px;
    background: ${(props) => props.theme.colors.colorSecondary};

    button {
        width: 300px;
    }
`
