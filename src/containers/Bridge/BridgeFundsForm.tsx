import React, { useState } from 'react'
import styled from 'styled-components'
import Button from '~/components/Button'
import { useStoreActions, useStoreState } from '~/store'

interface BridgeFundsFormProps {
    // Add any props you need here
}

const BridgeFundsForm: React.FC<BridgeFundsFormProps> = () => {
    const [loading, setLoading] = useState(false)

    const { bridgeModel: bridgeModelState } = useStoreState((state) => state)
    const { setFromTokenAddress, setToTokenAddress, setToChain, setOriginChain, setAmount, bridge } = useStoreActions(
        (state) => state.bridgeModel
    )
    const { fromTokenAddress, toTokenAddress, toChain, originChain, amount } = bridgeModelState

    return (
        <Container>
            <Content>
                <h1>Bridge Funds Form</h1>
                <p>From Token Address: {fromTokenAddress}</p>
                <p>To Token Address: {toTokenAddress}</p>
                <p>To Chain: {toChain}</p>
                <p>Origin Chain: {originChain}</p>
                <p>Amount: {amount}</p>
                <p>{loading ? 'loading' : 'ready'}</p>
                <Button onClick={() => setLoading(!loading)}>Toggle Loading</Button>
                <Button onClick={() => setFromTokenAddress('0x6B175474E89094C44Da98b954EedeAC495271d0F')}>
                    Set From Token Address
                </Button>
                <Button onClick={() => setToTokenAddress('0x5979D7b546E38E414F7E9822514be443A4800529')}>
                    Set To Token Address
                </Button>
                <Button onClick={() => setToChain(42161)}>Set To Chain</Button>
                <Button onClick={() => setOriginChain(1)}>Set Origin Chain</Button>
                <Button onClick={() => setAmount('amountValue')}>Set Amount</Button>
                <Button onClick={() => bridge(bridgeModelState)}>Bridge</Button>
            </Content>
        </Container>
    )
}

export default BridgeFundsForm

const Container = styled.div``

const Content = styled.div`
    position: relative;
`
