import { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { getTokenLogo, formatWithCommas, getChainId, getUserBalance, bridgeTokens } from '~/utils'
import { ethers } from 'ethers'
import { useStoreActions, useStoreState } from '~/store'
import { getGasToken } from '~/utils'
import Dropdown from '~/components/Dropdown'
import Button from '~/components/Button'
import { useWeb3React } from '@web3-react/core'

const BridgeFundsForm = () => {
    const {
        connectWalletModel: { tokensData, tokensFetchedData },
        bridgeModel: { reason, toTokenSymbol },
    } = useStoreState((state) => state)
    const { account } = useWeb3React()

    const [selectedToken, setSelectedToken] = useState<string>('')
    const [selectedChain, setSelectedChain] = useState<string>('Mainnet')

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
        Object.values(bridgeTokens).forEach((value: any) => {
            console.log(value.publicRPC)
            const balances = getUserBalance(value.chainId, value.tokens, account!, value.publicRPC)
            console.log(balances)
        })
    }, [account])

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

    return (
        <Container>
            <Content>
                <DropDownContainer>
                    <Header>
                        <span className="title">Bridge Funds</span>
                    </Header>
                    <Text>{reason ?? ''}</Text>
                    <SideLabel>{`Select Source Chain`}</SideLabel>
                    <Dropdown
                        items={['Mainnet', 'Optimism', 'Polygon', 'Base']}
                        itemSelected={'Mainnet'}
                        getSelectedItem={setSelectedChain}
                        fontSize="14px"
                    />
                    <SideLabel>{`Select Token to Bridge`}</SideLabel>
                    <Dropdown
                        items={collateralsDropdown}
                        itemSelected={selectedToken}
                        getSelectedItem={setSelectedToken}
                        fontSize="14px"
                    />
                    <Button
                        onClick={() =>
                            bridge({
                                originChain: getChainId(selectedChain),
                                toTokenAddress: selectedToken,
                                fromTokenAddress: getGasToken(selectedChain),
                            })
                        }
                        style={{ marginTop: '1em' }}
                    >
                        Bridge
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
`

const Content = styled.div`
    position: relative;
    width: 100%;
`

const SideLabel = styled.div`
    font-weight: 700;
    color: #1c293a;
    font-family: 'Barlow', sans-serif;
    font-size: 18px;
    line-height: 26.4px;
    margin-bottom: 10px;
    margin-top: 1em;
`

const DropDownContainer = styled.div`
    display: flex;
    flex-direction: column;
    box-shadow: 0px 4px 6px 0px #0d4b9d33;

    padding: 22px;
    border-radius: 8px;
    background: white;
`

const Text = styled.p`
    text-size: 14px;
`

const Header = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 55px;

    span {
        flex: 0 0 55px;
        font-size: 14px;

        &.title {
            display: block;
            flex: 1;
            font-family: 'Barlow', sans-serif;
            text-align: center;
            font-weight: bold;
            font-size: ${(props) => props.theme.font.xxLarge};
            color: #1c293a;
        }
    }
`
