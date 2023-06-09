import React from 'react'
import styled from 'styled-components'

interface Props {
    checked: boolean
    onChange: (state: boolean) => void
}

const CheckBox = ({ checked, onChange }: Props) => {
    const getChecked = (e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.checked)

    return (
        <CheckboxContainer>
            <HiddenCheckbox checked={checked} onChange={getChecked} />
            <StyledCheckbox className={checked ? 'checked' : ''}>
                <div>
                    <Icon viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                    </Icon>
                </div>
            </StyledCheckbox>
        </CheckboxContainer>
    )
}

export default CheckBox

const CheckboxContainer = styled.label`
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
`

const Icon = styled.svg`
    fill: none;
    stroke: ${(props) => props.theme.colors.blueish};
    stroke-width: 2px;
    visibility: hidden;
    display: block;
`

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
    border: 0;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px;
`

const StyledCheckbox = styled.div`
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 2.5px;
    transition: all 150ms;
    padding: 1px;
    div {
        border-radius: 2.5px;
        border: 1px solid ${(props) => props.theme.colors.blueish};
    }
    &.checked {
        div {
            border: 1px solid ${(props) => props.theme.colors.blueish};
        }
        svg {
            visibility: visible;
        }
    }
`
