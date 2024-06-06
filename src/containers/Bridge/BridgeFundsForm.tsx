import { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { getChainId, getUserBalance, bridgeTokens, getTokenLogo, formatWithCommas } from '~/utils'
import { useStoreActions, useStoreState } from '~/store'
import Button from '~/components/Button'
import { ExternalLink, Info } from 'react-feather'
import { useWeb3React } from '@web3-react/core'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import Loader from '~/components/Loader'
import OPTIMISM from '~/assets/optimism.svg'
import ETHEREUM from '~/assets/ethereum.svg'
import BASE from '~/assets/base.svg'
import POLYGON from '~/assets/polygon.svg'

const chainMapping = {
    Ethereum: 'Mainnet',
    Optimism: 'Optimism',
    Polygon: 'Polygon',
    Base: 'Base',
}

type SelectedChain = 'Ethereum' | 'Optimism' | 'Polygon' | 'Base'

const BridgeFundsForm = () => {
    const [clickedItem, setClickedItem] = useState<any>('')
    const [selectedToken, setSelectedToken] = useState<string>('')
    const [selectedChain, setSelectedChain] = useState<SelectedChain>('Ethereum')
    const [balances, setBalances] = useState<Record<string, any[]>>({})
    const [loading, setLoading] = useState<boolean>(true)

    const {
        connectWalletModel: { tokensData },
        bridgeModel: { reason, toTokenSymbol },
    } = useStoreState((state) => state)
    const { account } = useWeb3React()

    const { bridge } = useStoreActions((state) => state.bridgeModel)

    const fixedTokens = bridgeTokens[getChainId('Mainnet')].tokens

    const collaterals = useMemo(() => {
        return tokensData ? Object.values(tokensData).filter((token) => token.isCollateral) : []
    }, [tokensData])

    useEffect(() => {
        if (collaterals.length > 0 && selectedToken === '') setSelectedToken(toTokenSymbol)
    }, [collaterals, toTokenSymbol, selectedToken])

    useEffect(() => {
        if (!account) return
        const fetchAllBalances = async () => {
            setLoading(true)
            const balancePromises = Object.keys(chainMapping).map(async (network) => {
                const chainId = chainMapping[network as SelectedChain]
                const { tokens, publicRPC } = bridgeTokens[getChainId(chainId)]
                const fetchedBalances = await getUserBalance(tokens, account!, publicRPC)
                return { network, balances: fetchedBalances }
            })

            const results = await Promise.all(balancePromises)
            const newBalances = results.reduce((acc: Record<string, any[]>, result) => {
                if (result.balances) {
                    acc[result.network] = result.balances
                }

                return acc
            }, {})
            setBalances(newBalances)
            setLoading(false)
        }
        fetchAllBalances()
    }, [account])

    const getBalance = (token: string) => {
        const tokenBalances = balances[selectedChain] || []
        token = token.toLocaleLowerCase()
        const balance = tokenBalances.find((b) => {
            return b.name.toLowerCase() === token
        })
        return balance ? formatWithCommas(balance.balance, 4) : '-'
    }

    const getNrtworkLogo = (network: string) => {
        switch (network) {
            case 'Optimism':
                return <img src={OPTIMISM} alt="" />
            case 'Mainnet':
                return <img src={ETHEREUM} alt="" />
            case 'Polygon':
                return <img src={POLYGON} alt="" />
            case 'Base':
                return <img src={BASE} alt="" />
            default:
                return ''
        }
    }
    return (
        <Container>
            <Content>
                <DropDownContainer>
                    <Header>
                        <Title>Bridge</Title>
                        <SubTitle>View and bridge collateral from other networks</SubTitle>
                    </Header>
                    <Text>{reason ?? ''}</Text>
                    <Description>Networks</Description>
                    <ButtonsRow>
                        {Object.keys(chainMapping).map((network) => (
                            <>
                                <NetworkButton
                                    key={network}
                                    onClick={() => {
                                        setSelectedChain(network as SelectedChain)
                                    }}
                                    selectedChain={selectedChain}
                                    id={network}
                                >
                                    {getNrtworkLogo(network)}
                                    {network === 'Mainnet' ? 'Ethereum' : network}
                                </NetworkButton>
                            </>
                        ))}
                    </ButtonsRow>
                    <Table>
                        <List>
                            {fixedTokens.map((token: any) => {
                                return (
                                    <Item
                                        className={token.name === 'pufETH' ? 'disabled' : ''}
                                        onClick={() => {
                                            if (token.comingSoon) return
                                            setSelectedToken(token.name)
                                            setClickedItem(token)
                                        }}
                                        style={{
                                            backgroundColor: selectedToken === token.name ? '#1A74EC' : 'transparent',
                                            color: selectedToken === token.name ? 'white' : '#1A74EC',
                                        }}
                                        key={`bridge-${token.name}`}
                                        token={selectedToken}
                                    >
                                        <Text>
                                            <img
                                                src={getTokenLogo(token.name.toUpperCase())}
                                                alt=""
                                                width="20px"
                                                height="20px"
                                            />
                                            {token.name}
                                            {token.name === 'ETH' && (
                                                <Info
                                                    data-tooltip-id="tooltip-token"
                                                    data-tooltip-content={
                                                        'Bridge ETH assets to pay gas fees on the network'
                                                    }
                                                    size={'15px'}
                                                ></Info>
                                            )}
                                            {token.name === 'pufETH' ? <span>coming soon</span> : null}
                                        </Text>

                                        {account ? (
                                            !loading ? (
                                                <Text>{getBalance(token.name)}</Text>
                                            ) : (
                                                <LoaderContainer>
                                                    <Loader
                                                        color={selectedToken === token.name ? 'white' : '#1A74EC'}
                                                    />
                                                </LoaderContainer>
                                            )
                                        ) : null}
                                    </Item>
                                )
                            })}
                        </List>
                    </Table>
                    <ReactTooltip id={`tooltip-token`} variant="dark" data-effect="solid" place="top" />
                    <Button
                        onClick={() =>
                            bridge({
                                originChain: getChainId(chainMapping[selectedChain]),
                                toTokenAddress: selectedToken,
                                fromTokenAddress: selectedToken ? clickedItem.address : '',
                            })
                        }
                        style={{
                            marginTop: '1em',
                            padding: '20px',
                            width: '100%',
                            maxWidth: '311px',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                        }}
                    >
                        Bridge
                        <ExternalLink size={20} style={{ marginLeft: '10px' }} />
                    </Button>
                </DropDownContainer>
            </Content>
        </Container>
    )
}

export default BridgeFundsForm

const Container = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    min-height: 80vh;
    width: 100%;
    padding: 0 10px;
`

const Content = styled.div`
    position: relative;
    width: 100%;
`

const DropDownContainer = styled.div`
    box-shadow: 0px 4px 6px 0px #0d4b9d33;

    padding: 22px;
    border-radius: 4px;
    background: white;
`

const Text = styled.p`
    font-size: ${(props) => props.theme.font.default};
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 5px;
`

const Header = styled.div`
    margin-bottom: 20px;
`

const Title = styled.h2`
    font-family: ${(props) => props.theme.family.headers};
    font-size: 34px;
    color: ${(props) => props.theme.colors.accent};
    font-weight: 700;
`
const SubTitle = styled.p`
    font-size: ${(props) => props.theme.font.default};
    color: ${(props) => props.theme.colors.tertiary};
`

const Description = styled.div`
    color: ${(props) => props.theme.colors.accent};
    font-size: ${(props) => props.theme.font.medium};
    font-weight: 700;
    margin-bottom: 10px;
`

const Table = styled.div`
    border: 3px solid ${(props) => props.theme.colors.primary};
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
`

const List = styled.div``

const Item = styled.div<{ token?: string }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 10px 15px;

    span {
        font-size: ${(props) => props.theme.font.xSmall};
        color: white;
        background-color: ${(props) => props.theme.colors.primary};
        padding: 2px 10px;
        border-radius: 4px;
    }

    &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: #f5f5f5 !important;
    }

    &:not(:last-child) {
        border-bottom: 1px solid #1c293a33;
    }
`

const ButtonsRow = styled.div`
    display: flex;
    align-items: center;
    column-gap: 10px;

    @media (max-width: 767px) {
        flex-wrap: wrap;
        column-gap: 0;
        div {
            flex: 1;
        }
    }
`

const NetworkButton = styled.div<{ selectedChain: string; id: string }>`
    background-color: ${(props) =>
        props.selectedChain === props.id ? props.theme.colors.primary : props.theme.colors.background};
    color: ${(props) => (props.selectedChain === props.id ? 'white' : props.theme.colors.accent)};
    border-bottom: none;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    padding: 10px 20px;
    cursor: pointer;
    display: flex;
    gap: 5px;
    justify-content: flex-start;
    width: 150px;
`

const LoaderContainer = styled.div`
    span {
        display: none;
    }
`
