import { useEffect, useState } from 'react'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { useActiveWeb3React, handleTransactionError, useStartAuction, useQuery, useGetAuctions } from '~/hooks'
import AuctionsFAQ from '~/components/AuctionsFAQ'
import AlertLabel from '~/components/AlertLabel'
import Modal from '~/components/Modals/Modal'
import { AuctionEventType } from '~/types'
import { useStoreActions, useStoreState } from '~/store'
import AuctionsList from './AuctionsList'
import Button from '~/components/Button'
import { formatNumber } from '~/utils'
import useGeb from '~/hooks/useGeb'
import CollateralAuctionsList from './CollateralAuctions/CollateralAuctionsList'

const Auctions = ({
    match: {
        params: { auctionType },
    },
}: RouteComponentProps<{ auctionType?: string }>) => {
    const { account } = useActiveWeb3React()
    const { auctionModel: auctionsActions, popupsModel: popupsActions } = useStoreActions((state) => state)
    const { auctionModel: auctionsState, connectWalletModel: connectWalletState } = useStoreState((state) => state)
    const [showFaqs, setShowFaqs] = useState(false)
    const query = useQuery()
    const queryType = query.get('type') as AuctionEventType | null
    const [type, setType] = useState<AuctionEventType>(queryType || 'SURPLUS')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [selectedItem, setSelectedItem] = useState<string>('WETH')
    const geb = useGeb()
    const history = useHistory()

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

    const { proxyAddress } = connectWalletState

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
        if (query) {
            params.append('type', type)
        } else {
            params.delete('type')
        }
        history.push({ search: params.toString() })
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
            setType('SURPLUS')
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
        <Container>
            <Modal
                isModalOpen={showFaqs}
                closeModal={() => setShowFaqs(false)}
                maxWidth={'650px'}
                backDropClose
                hideHeader
                hideFooter
                handleModalContent
            >
                <ReviewContainer>
                    <AuctionsFAQ type={type} />
                    <BtnContainer>
                        <Button onClick={() => setShowFaqs(false)}>{'Close FAQs'}</Button>{' '}
                    </BtnContainer>
                </ReviewContainer>
            </Modal>
            {error ? <AlertLabel type="danger" text={error} /> : null}
            <Content>
                <Title>Auctions</Title>
                <Button
                    primary
                    text={`Show ${type.toLowerCase()} Auctions FAQs`}
                    onClick={() => setShowFaqs(!showFaqs)}
                />
            </Content>

            <Switcher>
                <Tab className={type === 'DEBT' ? 'active' : ''} onClick={() => onTabClick('DEBT')}>
                    Debt Auctions
                </Tab>
                <Tab className={type === 'SURPLUS' ? 'active' : ''} onClick={() => onTabClick('SURPLUS')}>
                    Surplus Auctions
                </Tab>
                <Tab className={type === 'COLLATERAL' ? 'active' : ''} onClick={() => onTabClick('COLLATERAL')}>
                    Collateral Auctions
                </Tab>
            </Switcher>

            {type === 'SURPLUS' && account ? (
                <StartAuctionContainer>
                    <Box style={{ justifyContent: 'space-between' }}>
                        <div>
                            <Box>
                                <SurplusTitle>System Surplus: </SurplusTitle>
                                <span>{formatNumber(systemSurplus, 2)} HAI</span>
                            </Box>
                            <Box>
                                <SurplusTitle>Surplus Amount to Sell: </SurplusTitle>
                                <span>{formatNumber(surplusAmountToSell, 2)} HAI</span>
                            </Box>

                            {!surplusCooldownDone || allowStartSurplusAuction ? null : (
                                <Box>({formatNumber(deltaToStartSurplusAuction, 2)} HAI) to start an auction</Box>
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
                                <span>{formatNumber(systemDebt, 2)} HAI</span>
                            </Box>
                            <Box>
                                <SurplusTitle>Debt Amount to Sell: </SurplusTitle>
                                <span>{formatNumber(debtAmountToSell, 2)} HAI</span>
                            </Box>
                            <Box>
                                <SurplusTitle>Protocol Tokens to be Offered: </SurplusTitle>
                                <span>{formatNumber(protocolTokensOffered, 2)} KITE</span>
                            </Box>

                            {allowStartDebtAuction ? null : (
                                <Box>({formatNumber(deltaToStartDebtAuction, 2)} HAI) to start an auction</Box>
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
        </Container>
    )
}

export default Auctions

const Container = styled.div`
    max-width: 880px;
    margin: 80px auto;
    padding: 0 15px;
    @media (max-width: 767px) {
        margin: 50px auto;
    }
`

const Title = styled.div`
    font-size: ${(props) => props.theme.font.medium};
    font-weight: 600;
    min-width: 180px;
`
const Content = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    button {
        min-width: 100px;
        padding: 4px 12px;
        font-size: 13px;
        font-weight: normal;
        text-transform: capitalize;
    }
`

const Switcher = styled.div`
    display: flex;
    align-items: 'center';
    border-radius: 20px;
    background: ${(props) => props.theme.colors.colorSecondary};
    width: fit-content;
    margin: 40px auto;
    padding: 10px;
    flex-wrap: wrap;
`

const Tab = styled.div`
    background: transparent;
    flex: 1;
    text-align: center;
    min-width: fit-content;
    cursor: pointer;
    border-radius: 20px;
    padding: 10px 20px;
    color: ${(props) => props.theme.colors.primary};
    &.active {
        background: ${(props) => props.theme.colors.colorPrimary};
    }
`

const ReviewContainer = styled.div`
    padding: 20px;
    border-radius: 10px;
    background: ${(props) => props.theme.colors.colorSecondary};
`

const BtnContainer = styled.div`
    padding-top: 20px;
    text-align: center;
`

const Box = styled.div`
    display: flex;
    align-items: center;
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
`
