import { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { getChainId, getUserBalance, bridgeTokens, getTokenLogo } from '~/utils'
// import { getTokenLogo, formatWithCommas } from '~/utils'
// import { ethers } from 'ethers'
import { useStoreActions, useStoreState } from '~/store'
// import { getGasToken } from '~/utils'
import Dropdown from '~/components/Dropdown'
import Button from '~/components/Button'
import { ExternalLink, Info } from 'react-feather'
import { useWeb3React } from '@web3-react/core'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { set } from 'numeral'
// import { from } from '@apollo/client'

const BridgeFundsForm = () => {
    const [clickedItem, setClickedItem] = useState<any>('')

    const {
        connectWalletModel: { tokensData },
        bridgeModel: { reason, toTokenSymbol, fromTokenSymbol },
    } = useStoreState((state) => state)
    const { account } = useWeb3React()

    const [selectedToken, setSelectedToken] = useState<string>('')
    const [selectedChain, setSelectedChain] = useState<string>('Ethereum')
    const [balances, setBalances] = useState<any[]>([])
    const networksList = ['Ethereum', 'Optimism', 'Polygon', 'Base']

    const collaterals = useMemo(() => {
        return tokensData ? Object.values(tokensData).filter((token) => token.isCollateral) : []
    }, [tokensData])

    const { bridge } = useStoreActions((state) => state.bridgeModel)

    useEffect(() => {
        if (collaterals.length > 0 && selectedToken === '') setSelectedToken(toTokenSymbol)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collaterals])

    useEffect(() => {
        if (!account) return
        async function fetchBalances() {
            const { tokens, publicRPC } = bridgeTokens[getChainId(selectedChain)]
            const balances = await getUserBalance(tokens, account!, publicRPC)
            if (fromTokenSymbol) {
                const token = tokens.find((token: any) => token.name === fromTokenSymbol)
                setClickedItem(token)
                setSelectedToken(token.name)
            } else {
                setClickedItem(balances![0])
                setSelectedToken(balances![0].name)
            }
            setBalances(balances!)
        }
        fetchBalances()
    }, [account, selectedChain, fromTokenSymbol])

    // const formattedCollateralBalances = useMemo(() => {
    //     return collaterals.reduce((acc, collateral) => {
    //         const balance = tokensFetchedData[collateral.symbol]?.balanceE18 || '0'
    //         const formattedBalance = ethers.utils.formatEther(balance)
    //         return { ...acc, [collateral.symbol]: formattedBalance }
    //     }, {} as { [symbol: string]: string })
    // }, [collaterals, tokensFetchedData])

    // const collateralsDropdown = collaterals.map((collateral) => {
    //     return {
    //         name: collateral.symbol,
    //         icon: getTokenLogo(collateral.symbol),
    //         value: formatWithCommas(formattedCollateralBalances[collateral.symbol]),
    //     }
    // })

    const handleNetworkChange = (network: string) => () => {
        setSelectedChain(network)
    }

    console.log('selectedChain', selectedChain)
    return (
        <Container>
            <Content>
                <DropDownContainer>
                    <Header>
                        <Title>Bridge</Title>
                        <SubTitle>Select an asset to bridge to the Arbitrum network.</SubTitle>
                    </Header>
                    <Text>{reason ?? ''}</Text>
                    <Description>Assets on the Network</Description>
                    <ButtonsRow>
                        {networksList.map((network) => (
                            <NetworkButton
                                key={network}
                                onClick={() => {
                                    setSelectedChain(network)
                                }}
                                selectedChain={selectedChain}
                                id={network}
                                color={selectedChain === network ? 'red' : 'transparent'}
                            >
                                {network}
                            </NetworkButton>
                        ))}
                    </ButtonsRow>
                    <Table>
                        <List>
                            {balances &&
                                balances.map((balance) => {
                                    return (
                                        <Item
                                            onClick={() => {
                                                if (balance.comingSoon) return
                                                setSelectedToken(balance.name)
                                                setClickedItem(balance)
                                            }}
                                            style={{
                                                backgroundColor:
                                                    selectedToken === balance.name ? '#1A74EC' : 'transparent',
                                                color: selectedToken === balance.name ? 'white' : '#1A74EC',
                                            }}
                                            key={`bridge-${balance.name}`}
                                            token={selectedToken}
                                        >
                                            <Text>
                                                <img
                                                    src={getTokenLogo(balance.name)}
                                                    alt=""
                                                    width="20px"
                                                    height="20px"
                                                />{' '}
                                                {balance.name}
                                                {balance.name === 'ETH' && (
                                                    <Info
                                                        data-tooltip-id="tooltip-token"
                                                        data-tooltip-content={
                                                            'Bridge ETH assets to pay gas fees on the network'
                                                        }
                                                        size={'15px'}
                                                    ></Info>
                                                )}
                                                {balance.name === 'pufETH' && <span>coming soon</span>}
                                            </Text>
                                            <Text>{balance.balance}</Text>
                                        </Item>
                                    )
                                })}
                        </List>
                    </Table>
                    <ReactTooltip id={`tooltip-token`} variant="dark" data-effect="solid" place="top" />
                    <Button
                        onClick={() =>
                            bridge({
                                originChain: getChainId(selectedChain),
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
    border-radius: 4px;
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

    &:not(:last-child) {
        border-bottom: 1px solid #1c293a33;
    }
`

const DropDownWrapper = styled.div`
    border-bottom: 2px solid ${(props) => props.theme.colors.primary};

    button {
        border: none;
        border-color: red;
    }

    span {
        color: ${(props) => props.theme.colors.primary};
        font-size: ${(props) => props.theme.font.default};
    }
`

const ButtonsRow = styled.div`
    display: flex;
    align-items: center;
    a {
        min-width: 100px;
        padding: 4px 12px;
        &:first-child {
            margin-right: 10px;
        }
    }
    @media (max-width: 767px) {
        min-width: 100%;
        margin-top: 20px;
        justify-content: space-between;
        &:first-child {
            margin-right: 0;
        }
        a {
            min-width: 49%;
            display: flex;
            justify-content: center;
        }
    }
`

const NetworkButton = styled.div<{ color: string; selectedChain: string; id: string }>`
    background-color: ${(props) => (props.selectedChain === props.id ? 'red' : 'transparent')};
    color: ${(props) => (props.selectedChain === props.id ? 'white' : 'black')};
    padding: 10px 20px;
`
