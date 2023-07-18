import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Plus } from 'react-feather'

import { useStoreState } from '~/store'
import LinkButton from '~/components/LinkButton'
import SafeBlock from '~/components/SafeBlock'
import CheckBox from '~/components/CheckBox'
import { returnState, ISafe } from '~/utils'
import { useActiveWeb3React } from '~/hooks'

const SafeList = ({ address }: { address?: string }) => {
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
                        <Col>
                            <Title>{'Accounts'}</Title>
                        </Col>
                        <Col>
                            {safeState.safeCreated && isOwner ? (
                                <LinkButton
                                    id="create-safe"
                                    disabled={connectWalletState.isWrongNetwork}
                                    url={'/safes/create'}
                                >
                                    <BtnInner>
                                        <Plus size={18} />
                                        {t('new_safe')}
                                    </BtnInner>
                                </LinkButton>
                            ) : null}
                        </Col>
                    </Header>

                    <SafeBlocks>
                        <Header className="safesList">
                            <Col>Safes({safeState.list.length})</Col>
                            <Col>Risk</Col>
                        </Header>
                        {safes.map((safe: ISafe) => (
                            <div key={safe.id}>
                                {safe.collateralName && <SafeBlock className="safeBlock" {...safe} />}
                            </div>
                        ))}
                    </SafeBlocks>
                    <CheckboxContainer>
                        <CheckBox checked={showEmpty} onChange={setShowEmpty} />
                        <span>Show empty safes</span>
                    </CheckboxContainer>
                </Container>
            )
        }
        return null
    }

    return <>{returnSafeList()}</>
}

export default SafeList

const Container = styled.div`
    max-width: 880px;
    margin: 80px auto;
    padding: 0 15px;
    @media (max-width: 767px) {
        margin: 50px auto;
    }
`
const SafeBlocks = styled.div`
    padding: 15px;
    border-radius: 15px;
    background: ${(props) => props.theme.colors.colorSecondary};
`

const Title = styled.div`
    font-weight: 600;
    font-size: ${(props) => props.theme.font.large};
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
`
const Col = styled.div`
    a {
        min-width: 100px;
        padding: 4px 12px;
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
    margin-top: 20px;
    justify-content: flex-end;
    span {
        margin-left: 10px;
        position: relative;
        font-size: 13px;
        top: -3px;
    }
`
