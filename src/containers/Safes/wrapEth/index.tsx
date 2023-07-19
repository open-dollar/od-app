import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import styled from 'styled-components'

import { useStoreState } from '~/store'
import TxConfirmation from './TxConfirmation'
import Wrap from './Wrap'

const AuctionsOperations = () => {
    const nodeRef = React.useRef(null)
    const { safeModel: safeState } = useStoreState((state) => state)

    const returnBody = () => {
        switch (safeState.operation) {
            case 0:
                return <Wrap />
            case 2:
                return <TxConfirmation />
            default:
                break
        }
    }

    return (
        <SwitchTransition mode={'out-in'}>
            <CSSTransition nodeRef={nodeRef} key={safeState.operation} timeout={250} classNames="fade">
                <Fade
                    ref={nodeRef}
                    style={{
                        width: '100%',
                        maxWidth: '720px',
                    }}
                >
                    <ModalContent
                        style={{
                            width: '100%',
                            maxWidth: '720px',
                        }}
                    >
                        <Header>Wrap ETH</Header>
                        {returnBody()}
                    </ModalContent>
                </Fade>
            </CSSTransition>
        </SwitchTransition>
    )
}

export default AuctionsOperations

const ModalContent = styled.div`
    background: ${(props) => props.theme.colors.background};
    border-radius: ${(props) => props.theme.global.borderRadius};
    border: 1px solid ${(props) => props.theme.colors.border};
`

const Header = styled.div`
    padding: 20px;
    font-size: ${(props) => props.theme.font.large};
    font-weight: 600;
    color: ${(props) => props.theme.colors.primary};
    border-bottom: 1px solid ${(props) => props.theme.colors.border};
    letter-spacing: -0.47px;
    span {
        text-transform: capitalize;
    }
`

const Fade = styled.div`
    &.fade-enter {
        opacity: 0;
        transform: translateX(50px);
    }
    &.fade-enter-active {
        opacity: 1;
        transform: translateX(0);
    }
    &.fade-exit {
        opacity: 1;
        transform: translateX(0);
    }
    &.fade-exit-active {
        opacity: 0;
        transform: translateX(-50px);
    }
    &.fade-enter-active,
    &.fade-exit-active {
        transition: opacity 300ms, transform 300ms;
    }
`
