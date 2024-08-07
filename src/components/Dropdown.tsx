import { useState, useRef, useEffect } from 'react'
import { ArrowUpRight, ChevronDown } from 'react-feather'
import Scrollbars from 'react-custom-scrollbars'
import styled from 'styled-components'

type Item =
    | string
    | {
          name: string
          value?: string | number
          icon: string
          href?: string
          isExternal?: boolean
          [U: string]: boolean | number | string | undefined
      }
interface Props {
    itemSelected: Item
    items: Array<Item>
    getSelectedItem?: (item: string) => void
    padding?: string
    minWidth?: string
    fontSize?: string
    width?: string
    extraWord?: string
    label?: string
    itemPadding?: string
    imgSize?: string
    dropSelection?: boolean
}
const Dropdown = (props: Props) => {
    const wrapperRef = useRef<HTMLDivElement>(null)
    const {
        itemSelected,
        items,
        padding,
        minWidth,
        width,
        extraWord,
        fontSize,
        getSelectedItem,
        label,
        itemPadding,
        imgSize,
        dropSelection,
    } = props
    const [isOpen, setIsOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<Item>(itemSelected)

    const handleItemClick = (selected: Item) => {
        setIsOpen(!isOpen)
        if (dropSelection) {
            return
        }
        setSelectedItem(selected)
        if (typeof selected === 'string') {
            getSelectedItem && getSelectedItem(selected)
        } else {
            getSelectedItem && getSelectedItem(selected.name)
        }
    }

    const handleClickOutside = (event: MouseEvent) => {
        const wrapper = wrapperRef.current
        if (wrapper && !wrapper.contains(event.target as Node)) {
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
    }, [])

    useEffect(() => {
        setSelectedItem(itemSelected)
    }, [itemSelected])

    return (
        <Container className={isOpen ? 'isOpen' : ''} style={{ width: width || '100%' }}>
            {label ? <Label>{label}</Label> : null}
            <InnerContainer ref={wrapperRef}>
                <DropdownBtn
                    style={{
                        padding: padding || '15px',
                        fontSize: fontSize || '14px',
                    }}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="text">
                        <span>{extraWord}</span>{' '}
                        {typeof selectedItem === 'string' ? (
                            selectedItem
                        ) : (
                            <ItemImg>
                                <img
                                    src={selectedItem.icon}
                                    alt=""
                                    style={{
                                        width: imgSize || '20px',
                                    }}
                                />{' '}
                                {selectedItem.href ? (
                                    <Link href={selectedItem.href} target={selectedItem.isExternal ? '_blank' : ''}>
                                        {selectedItem.name} <ArrowUpRight width={17} height={17} />
                                    </Link>
                                ) : (
                                    selectedItem.name
                                )}
                            </ItemImg>
                        )}
                    </span>

                    {items.length > 0 ? <ChevronDown size="25" color="#0071E7" strokeWidth={3} /> : null}
                </DropdownBtn>
                {items.length > 0 ? (
                    <DropdownMenu
                        style={{
                            display: isOpen ? 'block' : 'none',
                            minWidth: minWidth || '100%',
                        }}
                    >
                        <Scrollbars style={{ width: '100%' }} autoHeight autoHeightMax={185}>
                            {items.map((item: Item, index: number) => (
                                <DropDownItem
                                    key={index}
                                    onClick={() => handleItemClick(item)}
                                    style={{ padding: itemPadding || '20px' }}
                                >
                                    {typeof item === 'string' ? (
                                        item
                                    ) : (
                                        <ItemContainer>
                                            <ItemImg>
                                                <img
                                                    src={item.icon}
                                                    alt=""
                                                    style={{
                                                        width: imgSize || '20px',
                                                    }}
                                                />{' '}
                                                {item.name}
                                            </ItemImg>
                                            {item.value}
                                        </ItemContainer>
                                    )}
                                </DropDownItem>
                            ))}
                        </Scrollbars>
                    </DropdownMenu>
                ) : null}
            </InnerContainer>
        </Container>
    )
}

export default Dropdown

const Container = styled.div`
    display: inline-block;
    &.isOpen {
        position: relative;
        z-index: 305;
    }
`

const InnerContainer = styled.div`
    position: relative;
    z-index: 1;
`
const DropdownBtn = styled.button`
    border: 2px solid ${(props) => props.theme.colors.primary};
    box-shadow: none;
    background: ${(props) => props.theme.colors.placeholder};
    color: ${(props) => props.theme.colors.accent};
    border-radius: 4px;
    font-weight: 700;

    outline: none;
    text-align: left;
    cursor: pointer;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .text {
        display: inline-block;
        vertical-align: middle;
    }
`

const DropdownMenu = styled.div`
    position: absolute;
    top: calc(100%);
    left: 0;
    border-radius: ${(props) => props.theme.global.borderRadius};
    background: ${(props) => props.theme.colors.background};
    border: 2px solid ${(props) => props.theme.colors.border};
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.02);
    text-align: left;
    z-index: 5;
`

const DropDownItem = styled.div`
    padding: 20px;
    color: ${(props) => props.theme.colors.primary};
    cursor: pointer;
    &:hover {
        background: ${(props) => props.theme.colors.foreground};
    }
`

const Label = styled.div`
    line-height: 21px;
    color: ${(props) => props.theme.colors.secondary};
    font-size: ${(props) => props.theme.font.small};
    letter-spacing: -0.09px;
    margin-bottom: 4px;
    text-transform: capitalize;
`

const ItemImg = styled.div`
    display: flex;
    align-items: center;
    img {
        margin-right: 10px;
    }
`

const ItemContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const Link = styled.a`
    color: inherit;
    text-decoration: underline;
    display: flex;
    align-items: center;
    svg {
        position: static !important;
    }
    &:hover {
        color: ${(props) => props.theme.colors.inputBorderColor};
    }
`
