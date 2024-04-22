import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { useStoreState } from '~/store'
import LinkButton from '~/components/LinkButton'
import VaultBlock from '~/components/VaultBlock'
import CheckBox from '~/components/CheckBox'
import { returnState, ISafe } from '~/utils'
import { useActiveWeb3React } from '~/hooks'

const VaultList = ({ address }: { address?: string }) => {
    const [showEmpty, setShowEmpty] = useState(true)

    const { account } = useActiveWeb3React()

    const { t } = useTranslation()

    const { connectWalletModel: connectWalletState, safeModel: safeState } = useStoreState((state) => state)

    const safes = useMemo(() => {
        if (safeState.list.length > 0) {
            return showEmpty ? safeState.list : safeState.list.filter((safe) => returnState(safe.riskState) !== '')
        }
        return []
    }, [safeState.list, showEmpty])

    const isOwner = useMemo(
        () => (address && account ? account.toLowerCase() === address.toLowerCase() : true),
        [account, address]
    )

    const returnSafeList = () => {
        if (safeState.list.length > 0) {
            return (
                <Container>
                    <Header>
                        <Col className="first-col">
                            <Title>{'Vaults'}</Title>
                        </Col>
                        <CheckboxContainer>
                            <CheckBox checked={showEmpty} onChange={setShowEmpty} />
                            <span>Show empty vaults</span>
                        </CheckboxContainer>
                        <Col className={'last-col'}>
                            {safeState.safeCreated && isOwner ? (
                                <LinkBtnContainer>
                                    <LinkButton
                                        id="create-safe"
                                        disabled={connectWalletState.isWrongNetwork}
                                        url={'/vaults/create'}
                                    >
                                        <BtnInner>{t('create_safe')}</BtnInner>
                                    </LinkButton>
                                </LinkBtnContainer>
                            ) : null}
                        </Col>
                    </Header>

                    <SafeBlocks>
                        {safes.map((safe: ISafe) => (
                            <div key={safe.id}>
                                {safe.collateralName && <VaultBlock className="safeBlock" {...safe} />}
                            </div>
                        ))}
                    </SafeBlocks>
                </Container>
            )
        }
        return null
    }

    return <>{returnSafeList()}</>
}

export default VaultList

const Container = styled.div`
    max-width: 1360px;
    margin: 80px auto;
    padding: 0 15px;
    @media (max-width: 767px) {
        margin: 50px auto;
    }
`

const LinkBtnContainer = styled.div`
    outline: none;
    cursor: pointer;
    min-width: 100px;
    padding: 8px 20px;
    font-weight: 700;
    background: ${(props) => props.theme.colors.gradientBg};
    border-radius: 3px;
    transition: all 0.3s ease;
    font-family: ${(props) => props.theme.family.headers};

    a {
        color: white;
    }
    
    &:hover {
        opacity: 0.8;
    }
`

const SafeBlocks = styled.div`
    border-radius: 8px;
`

const Title = styled.div`
    font-weight: 700;
    font-size: 34px;
    font-family: ${(props) => props.theme.family.headers};
    color: ${(props) => props.theme.colors.accent};
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

    @media (max-width: 767px) {
        flex-direction: column;
    }
`
const Col = styled.div`
    a {
        min-width: 100px;
        padding: 4px 12px;
    }

    &.first-col {
        margin-right: 33px;
    }

    &.last-col {
        margin-left: auto;
    }

    @media (max-width: 767px) {
        &.last-col {
            margin-left: 0;
            margin-top: 30px;
        }
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
    justify-content: flex-end;
    margin-top: 5px;
    span {
        margin-left: 10px;
        position: relative;
        font-size: 12px;
        text-transform: uppercase;
        font-weight: 700;
        color: ${(props) => props.theme.colors.accent};
        letter-spacing: 3px;
    }
`
