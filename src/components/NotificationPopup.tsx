import React, { useEffect, useRef, useState } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import styled from 'styled-components'
import BellIcon from './Icons/BellIcon'

const NotificationPopup = () => {
    const wrapperRef = useRef(null)
    const [isOpen, setIsOpen] = useState(false)

    const handleClickOutside = (e: any) => {
        const wrapper: any = wrapperRef.current
        if (!wrapper.contains(e.target)) {
            setTimeout(() => {
                setIsOpen(false)
            }, 10)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    })

    return (
        <InnerContent ref={wrapperRef}>
            <BellBtn
                className={isOpen ? 'active' : ''}
                onClick={() => setIsOpen(!isOpen)}
            >
                <BellIcon />
            </BellBtn>
            {isOpen ? (
                <>
                    <CaretImg src={require('../assets/caret-up.svg').default} />

                    <Menu>
                        <Scrollbars
                            autoHide
                            style={{ width: '100%' }}
                            autoHeight
                            autoHeightMax={'calc(100vh - 100px)'}
                        >
                            {[...new Array(4)].map((_) => (
                                <NotificationItem key={Math.random()}>
                                    <Left>
                                        <Label>Recieved ETH</Label>
                                        <Date>June 12, 2012</Date>
                                    </Left>
                                    <Right>
                                        <Value>0.000</Value>
                                        <ExternalLink href="">
                                            Etherscan{' '}
                                            <img
                                                src={
                                                    require('../assets/arrow-up.svg')
                                                        .default
                                                }
                                                alt=""
                                            />
                                        </ExternalLink>
                                    </Right>
                                </NotificationItem>
                            ))}
                        </Scrollbars>
                    </Menu>
                </>
            ) : null}
        </InnerContent>
    )
}

export default NotificationPopup

const InnerContent = styled.div`
    position: relative;
    z-index: 99;
`

const Menu = styled.div`
    background: ${(props) => props.theme.colors.background};
    border-radius: ${(props) => props.theme.global.borderRadius};
    border: 1px solid ${(props) => props.theme.colors.border};
    position: absolute;
    top: 65px;
    left: -30px;
    width: 340px;
    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width:290px;
    left:-143px;
  `}
`

const CaretImg = styled.img`
    position: absolute;
    top: 57px;
    z-index: 1;
`

const BellBtn = styled.div`
    cursor: pointer;
    transition: all 0.3s ease;
    svg {
        stop {
            transition: all 0.3s ease;
            stopcolor: gray;
        }
    }

    &.active,
    &:hover {
        svg {
            stop {
                stopcolor: #78d8ff;
                &[offset='1'] {
                    stopcolor: #4ce096;
                }
            }
        }
    }

    ${({ theme }) => theme.mediaWidth.upToSmall`
    svg {
      width:24px;
      height:24px;
    }
  `}
`

const NotificationItem = styled.div`
    display: flex;
    padding: 13px 18px;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid ${(props) => props.theme.colors.border};
    &:last-child {
        border-bottom: 0;
    }
`

const Left = styled.div``
const Right = styled.div``

const Label = styled.div`
    letter-spacing: -0.09px;
    line-height: 21px;
    font-weight: 600;
    color: ${(props) => props.theme.colors.primary};
    font-size: ${(props) => props.theme.font.small};
`

const Date = styled.div`
    letter-spacing: 0.01px;
    color: ${(props) => props.theme.colors.secondary};
    font-size: ${(props) => props.theme.font.extraSmall};
`

const Value = styled.div`
    letter-spacing: -0.09px;
    line-height: 21px;
    font-weight: 600;
    color: ${(props) => props.theme.colors.primary};
    font-size: ${(props) => props.theme.font.small};
`

const ExternalLink = styled.a`
    font-size: ${(props) => props.theme.font.extraSmall};
    background: ${(props) => props.theme.colors.gradient};
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: ${(props) => props.theme.colors.inputBorderColor};

    img {
        width: 8px;
        height: 8px;
        border-radius: 0;
    }
`
