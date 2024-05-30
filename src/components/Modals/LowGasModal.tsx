import { AlertCircle } from 'react-feather'
import Modal from './Modal'
import styled from 'styled-components'
import LinkButton from '../LinkButton'
import { useStoreActions, useStoreState } from '~/store'

const LowGasModal = () => {
    const { popupsModel: popupsState } = useStoreState((state) => state)
    const { popupsModel: popupsActions } = useStoreActions((state) => state)

    const handleCancel = () => {
        popupsActions.setIsLowGasModalOpen(false)
    }
    return (
        <Modal
            maxWidth="400px"
            closeModal={handleCancel}
            isModalOpen={popupsState.isLowGasModalOpen}
            backDropClose={!popupsState.blockBackdrop}
        >
            <Container>
                <AlertCircle color="#ffaf1d" size="50px" />
                <Title>No funds for Gas fee</Title>
                <Text>Use the Bridge option and transfer our funds from Ethereum mainnet to Arbitrium One.</Text>
                <LinkBtnContainer onClick={handleCancel}>
                    <LinkButton id="create-safe" url={'/bridge'}>
                        Bridge
                    </LinkButton>
                </LinkBtnContainer>
            </Container>
        </Modal>
    )
}

export default LowGasModal

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    width: 300px;
    margin: 0 auto;
`

const LinkBtnContainer = styled.div`
    a {
        color: white;
        outline: none;
        cursor: pointer;
        min-width: 100px;
        padding: 12px 40px;
        font-weight: 700;
        background: transparent;
        border-radius: 4px;
        border: 2px solid white;
        font-family: ${(props) => props.theme.family.headers};
    }

    &:hover {
        opacity: 0.8;
    }
`

const BtnInner = styled.div`
    display: flex;
    align-items: center;
    svg {
        margin-right: 5px;
    }
`

const Title = styled.h2`
    font-family: ${(props) => props.theme.family.headers};
    font-size: ${(props) => props.theme.font.large};
    font-weight: 700;
    margin-top: 20px;
    margin-bottom: 10px;
`

const Text = styled.p`
    font-size: ${(props) => props.theme.font.default};
    text-align: center;
    margin-bottom: 40px;
`
