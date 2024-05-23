import { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { getTokenLogo, formatWithCommas, getChainId, getUserBalance, bridgeTokens } from '~/utils'
import { ethers } from 'ethers'
import { useStoreActions, useStoreState } from '~/store'
import { getGasToken } from '~/utils'
import Dropdown from '~/components/Dropdown'
import Button from '~/components/Button'
import { ExternalLink } from 'react-feather'
import { useWeb3React } from '@web3-react/core'

const BridgeFundsForm = () => {
    const {
        connectWalletModel: { tokensData, tokensFetchedData },
        bridgeModel: { reason, toTokenSymbol },
    } = useStoreState((state) => state)
    const { account } = useWeb3React()

    const [selectedToken, setSelectedToken] = useState<string>('')
    const [selectedChain, setSelectedChain] = useState<string>('Mainnet')
    const [balances, setBalances] = useState<any[]>([])

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
            setBalances(balances!)
        }
        fetchBalances()
    }, [account, selectedChain])

    const formattedCollateralBalances = useMemo(() => {
        return collaterals.reduce((acc, collateral) => {
            const balance = tokensFetchedData[collateral.symbol]?.balanceE18 || '0'
            const formattedBalance = ethers.utils.formatEther(balance)
            return { ...acc, [collateral.symbol]: formattedBalance }
        }, {} as { [symbol: string]: string })
    }, [collaterals, tokensFetchedData])

    const collateralsDropdown = collaterals.map((collateral) => {
        return {
            name: collateral.symbol,
            icon: getTokenLogo(collateral.symbol),
            value: formatWithCommas(formattedCollateralBalances[collateral.symbol]),
        }
    })
    console.log('balances', balances)
    return (
        <Container>
            <Content>
                <DropDownContainer>
                    <Header>
                        <Title>Bridge</Title>
                        <SubTitle>Select an asset to bridge to the Arbitrum network.</SubTitle>
                    </Header>
                    <Text>{reason ?? ''}</Text>
                    <Description>Assets on Network</Description>
                    <Row>
                        <SideLabel>{`Select Source Chain`}</SideLabel>
                        <Dropdown
                            items={['Mainnet', 'Optimism', 'Polygon', 'Base']}
                            itemSelected={'Mainnet'}
                            getSelectedItem={setSelectedChain}
                            fontSize="14px"
                        />
                    </Row>
                    <Row>
                        <SideLabel>{`Select Token to Bridge`}</SideLabel>
                        <Dropdown
                            items={collateralsDropdown}
                            itemSelected={selectedToken}
                            getSelectedItem={setSelectedToken}
                            fontSize="14px"
                        />
                    </Row>
                    <Button
                        onClick={() =>
                            bridge({
                                originChain: getChainId(selectedChain),
                                toTokenAddress: selectedToken,
                                fromTokenAddress: getGasToken(selectedChain),
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

const SideLabel = styled.div`
    color: #1c293a;
    font-family: 'Barlow', sans-serif;
    font-size: ${(props) => props.theme.font.default};
    line-height: 26.4px;
    margin-bottom: 5px;
`

const DropDownContainer = styled.div`
    box-shadow: 0px 4px 6px 0px #0d4b9d33;

    padding: 22px;
    border-radius: 4px;
    background: white;
`

const Text = styled.p`
    font-size: 14px;
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
`

const Row = styled.div`
    margin-bottom: 10px;
`
