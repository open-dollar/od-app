import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { useStoreActions, useStoreState } from '~/store'
import DecimalInput from '~/components/DecimalInput'
import Button from '~/components/Button'
import Results from './Results'
import { useWeb3React } from '@web3-react/core'

const Wrap = () => {
    const { t } = useTranslation()
    const { chainId } = useWeb3React()
    const [value, setValue] = useState('')
    const [error, setError] = useState('')
    const { popupsModel: popupsActions, safeModel: safeActions } = useStoreActions((state) => state)
    const { connectWalletModel: connectWalletState } = useStoreState((state) => state)

    const ethBalance = useMemo(() => {
        let amount = 0
        if (connectWalletState && chainId) {
            amount = Number(connectWalletState.ethBalance[chainId]) - 0.01
        }

        return amount <= 0 ? '0' : amount.toString()
    }, [chainId, connectWalletState])

    const passedChecks = () => {
        if (connectWalletState && chainId) {
            const ethBalance = Number(connectWalletState.ethBalance[chainId])
            if (ethBalance < 0.01 || Number(value) > ethBalance) {
                setError('Insufficient ETH balance')
                return false
            }
        }
        setError('')
        return true
    }

    const handleAmountChange = (val: string) => {
        setValue(val)
    }

    const handleSubmit = () => {
        if (passedChecks()) {
            safeActions.setAmount(value)
            safeActions.setOperation(2)
        }
    }

    const handleCancel = () => {
        popupsActions.setAuctionOperationPayload({
            isOpen: false,
            type: '',
            auctionType: '',
        })
        safeActions.setOperation(0)
        safeActions.setAmount('')
    }

    return (
        <Container>
            <DecimalInput
                onChange={handleAmountChange}
                value={value}
                label="ETH to wrap"
                maxText={'max'}
                handleMaxClick={() => handleAmountChange(ethBalance)}
            />
            {error && <Error>{error}</Error>}
            <Results amount={value} ethBalance={connectWalletState.ethBalance[chainId || 420].toString()} />
            <Footer>
                <Button dimmed text={t('cancel')} onClick={handleCancel} />
                <Button withArrow onClick={handleSubmit} text={t('review_transaction')} />
            </Footer>
        </Container>
    )
}

export default Wrap

const Container = styled.div`
    padding: 20px;
`

const Footer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px 0 0 0;
`

const Error = styled.p`
    color: ${(props) => props.theme.colors.dangerColor};
    font-size: ${(props) => props.theme.font.extraSmall};
    width: 100%;
    margin: 16px 0;
`
