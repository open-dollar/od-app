import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CSSTransition } from 'react-transition-group'
import styled from 'styled-components'
import { useStoreActions } from '../../store'
import Button from '../Button'
import Confetti from '../Confetti'

interface Props {
    title?: string
    children: React.ReactNode
    submitBtnText?: string
    handleSubmit?: () => void
    maxWidth?: string
    width?: string
    isModalOpen: boolean
    closeModal?: () => void
    handleModalContent?: boolean
    showXButton?: boolean
    borderRadius?: string
    backDropClose?: boolean
    hideHeader?: boolean
    hideFooter?: boolean
    backDropColor?: string
    startConfetti?: boolean
}
const Modal = ({
    title,
    children,
    submitBtnText,
    handleSubmit,
    width,
    maxWidth,
    isModalOpen,
    closeModal,
    handleModalContent,
    showXButton,
    borderRadius,
    backDropClose,
    hideHeader,
    startConfetti = false,
    backDropColor,
}: Props) => {
    const { t } = useTranslation()
    const nodeRef = React.useRef(null)
    const { settingsModel: settingsActions } = useStoreActions((state) => state)

    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (isModalOpen) {
            settingsActions.setBodyOverFlow(true)
        } else {
            settingsActions.setBodyOverFlow(false)
        }
        setIsOpen(isModalOpen)
        // eslint-disable-next-line
    }, [isModalOpen])

    const handleBackdrop = () => {
        if (backDropClose && closeModal) {
            return closeModal()
        }
    }

    return isOpen ? (
        <CSSTransition
            in={isOpen}
            timeout={300}
            appear={isOpen}
            nodeRef={nodeRef}
            classNames="fade"
            unmountOnExit
            mountOnEnter
        >
            <Container ref={nodeRef}>
                <Confetti start={startConfetti} />
                <InnerContent>
                    <BackDrop bg={backDropColor} onClick={handleBackdrop} />
                    <ChildrenHolder
                        style={{
                            maxWidth: maxWidth || '720px',
                            width: width || '100%',
                        }}
                    >
                        {handleModalContent ? (
                            <>{children}</>
                        ) : (
                            <ModalContent
                                style={{
                                    width: width || '100%',
                                    maxWidth: maxWidth || '720px',
                                    borderRadius,
                                }}
                            >
                                {hideHeader ? null : (
                                    <HeaderContainer>
                                        {
                                            <Header>
                                                {title ? t(title) : null}
                                            </Header>
                                        }
                                        {showXButton ? (
                                            <CloseBtn onClick={closeModal}>
                                                &times;
                                            </CloseBtn>
                                        ) : null}
                                    </HeaderContainer>
                                )}
                                <Body>{children}</Body>

                                {showXButton && !submitBtnText ? null : (
                                    <Footer>
                                        <Button
                                            dimmed
                                            onClick={closeModal}
                                            text={t('cancel')}
                                        />

                                        {submitBtnText && handleSubmit ? (
                                            <Button
                                                withArrow
                                                onClick={handleSubmit}
                                                text={t(submitBtnText)}
                                            />
                                        ) : null}
                                    </Footer>
                                )}
                            </ModalContent>
                        )}
                    </ChildrenHolder>
                </InnerContent>
            </Container>
        </CSSTransition>
    ) : null
}

export default Modal

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    overflow-y: auto;
    overflow-x: hidden;
    &.fade-appear {
        opacity: 0;
    }
    &.fade-appear-active {
        opacity: 1;
        transition: all 300ms;
    }
`

const InnerContent = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    position: relative;
    padding: 50px 0;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 50px 20px;
  `}
`

const ModalContent = styled.div`
    background: ${(props) => props.theme.colors.background};
    border-radius: ${(props) => props.theme.global.borderRadius};
    border: 1px solid ${(props) => props.theme.colors.border};
`

const Header = styled.div`
    padding: 20px;
    font-size: ${(props) => props.theme.font.large};
    font-weight: 600;
    color: ${(props) => props.theme.colors.neutral};
    letter-spacing: -0.47px;
`

const Body = styled.div`
    padding: 20px;
`

const Footer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px;
`

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid ${(props) => props.theme.colors.border};
`

const CloseBtn = styled.button`
    cursor: pointer;
    border: none;
    box-shadow: none;
    outline: none;
    background: transparent;
    border-radius: 0;
    color: #a4abb7;
    font-size: 30px;
    font-weight: 600;
    line-height: 24px;
    padding: 0;
    margin: 5px 20px 0 0;
`

const BackDrop = styled.div<{ bg?: string }>`
    background: ${({ theme, bg }) => (bg ? bg : theme.colors.overlay)};
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
`

const ChildrenHolder = styled.div`
    position: relative;
    z-index: 2;
`
