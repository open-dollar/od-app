import React from 'react'
import { Check } from 'react-feather'
import styled from 'styled-components'

interface Props {
    checked: boolean
    onChange: (state: boolean) => void
}

const CheckBox = ({ checked, onChange }: Props) => {
    const getChecked = (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.checked)

    return (
        <CheckboxContainer>
            <HiddenCheckbox checked={checked} onChange={getChecked} />
            <StyledCheckbox className={checked ? 'checked' : ''}>
                <div>{checked && <Check color="white" size={17} />}</div>
            </StyledCheckbox>
        </CheckboxContainer>
    )
}

export default CheckBox

const CheckboxContainer = styled.label`
    display: flex;
    cursor: pointer;
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
    transition: all 150ms;
    padding: 1px;

    div {
        border-radius: 4px;
        background: ${(props) => props.theme.colors.primary};
        width: 32px;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
`
