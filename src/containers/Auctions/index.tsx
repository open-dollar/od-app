import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'
import AlertLabel from '../../components/AlertLabel'
import AuctionsFAQ from '../../components/AuctionsFAQ'
import Button from '../../components/Button'
import Modal from '../../components/Modals/Modal'
import { useActiveWeb3React } from '../../hooks'
import { useStoreActions } from '../../store'
import AuctionsList from './AuctionsList'

export type AuctionEventType = 'DEBT' | 'SURPLUS' | 'STAKED_TOKEN'

const Auctions = ({
    match: {
        params: { auctionType },
    },
}: RouteComponentProps<{ auctionType?: string }>) => {
    const { account } = useActiveWeb3React()
    const { auctionsModel: auctionsActions, popupsModel: popupsActions } =
        useStoreActions((state) => state)
    const [showFaqs, setShowFaqs] = useState(false)
    const [type, setType] = useState<AuctionEventType>('SURPLUS')
    const [error, setError] = useState('')

    useEffect(() => {
        async function init() {
            popupsActions.setIsWaitingModalOpen(true)
            popupsActions.setWaitingPayload({
                title: 'Initializing..',
                status: 'loading',
            })
            await fetchAuctions()
            popupsActions.setIsWaitingModalOpen(false)
        }
        if (auctionType && auctionType.toLowerCase() === 'staked_token') {
            setType('STAKED_TOKEN')
        }
        async function fetchAuctions() {
            try {
                await auctionsActions.fetchAuctions({
                    address: account ? account : '',
                    type:
                        auctionType &&
                        auctionType.toLowerCase() === 'staked_token'
                            ? 'STAKED_TOKEN'
                            : type,
                })
                setError('')
            } catch (error) {
                console.log(error)
                if (
                    error instanceof SyntaxError &&
                    error.message.includes('failed')
                ) {
                    setError('Failed to fetch auctions from the graph node')
                }
            }
        }
        init()
        fetchAuctions()
        const interval = setInterval(() => {
            fetchAuctions()
        }, 2000)

        return () => clearInterval(interval)
    }, [account, auctionsActions, popupsActions, type, auctionType])

    return (
        <>
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
                            <Button onClick={() => setShowFaqs(false)}>
                                {'Close FAQs'}
                            </Button>{' '}
                        </BtnContainer>
                    </ReviewContainer>
                </Modal>
                {error ? <AlertLabel type="danger" text={error} /> : null}
                <Content>
                    <Title>Auctions</Title>
                    <Button
                        primary
                        text={`Show ${
                            type === 'STAKED_TOKEN'
                                ? 'Staked Token'
                                : type.toLowerCase()
                        } Auctions FAQs`}
                        onClick={() => setShowFaqs(!showFaqs)}
                    />
                </Content>

                {auctionType &&
                auctionType.toLowerCase() === 'staked_token' ? null : (
                    <Switcher>
                        <Tab
                            className={type === 'DEBT' ? 'active' : ''}
                            onClick={() => setType('DEBT')}
                        >
                            Debt Auctions
                        </Tab>
                        <Tab
                            className={type === 'SURPLUS' ? 'active' : ''}
                            onClick={() => setType('SURPLUS')}
                        >
                            Surplus Auctions
                        </Tab>
                    </Switcher>
                )}

                <AuctionsList type={type} />
            </Container>
        </>
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
