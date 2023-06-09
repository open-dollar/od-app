import React, { ChangeEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface Props {
    label: string
    icon?: string
    iconSize?: string
    placeholder?: string
    value: string
    onChange: (val: string) => void
    disableMax?: boolean
    handleMaxClick?: () => void
    disabled?: boolean
    maxText?: 'max' | 'min'
    data_test_id?: string
}

const DecimalInput = ({
    label,
    placeholder,
    icon,
    iconSize,
    value,
    onChange,
    disableMax,
    handleMaxClick,
    disabled,
    maxText = 'max',
    data_test_id,
}: Props) => {
    const { t } = useTranslation()

    const [length, setLength] = useState(16)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        if (/^-?\d*[.,]?\d*$/.test(val) && /^\d*(\.\d{0,4})?$/.test(val)) {
            val.includes('.') ? setLength(17) : setLength(16)
            if (val.startsWith('0') && val.charAt(1) !== '.') {
                const returnedVal = val.replace(/(\d)(?=(\d))/, '$1.')
                onChange(returnedVal)
            } else if (val.startsWith('.')) {
                onChange('0' + val)
            } else if (val.replace(/[^.]/g, '').length > 1) {
                onChange(value)
            } else if (val.length === 6 && Number(val) === 0) {
                onChange('')
            } else {
                onChange(val)
            }
        }
    }

    return (
        <Container>
            <Label data-test-id={data_test_id + '_label'}>{label}</Label>
            <Content className={disabled ? 'disabled' : ''}>
                {icon ? (
                    <Icon
                        src={icon}
                        width={iconSize || '24px'}
                        height={iconSize || '24px'}
                    />
                ) : null}
                <CustomInput
                    placeholder={placeholder || '0.00'}
                    type={'text'}
                    inputMode="decimal"
                    value={value || ''}
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    maxLength={length}
                    minLength={1}
                    onChange={handleChange}
                    disabled={disabled}
                    data-test-id={data_test_id}
                />

                {disableMax || disabled ? null : (
                    <MaxBtn onClick={handleMaxClick}>{t(maxText)}</MaxBtn>
                )}
            </Content>
        </Container>
    )
}

export default DecimalInput

const Container = styled.div``

const Label = styled.div`
    line-height: 21px;
    color: ${(props) => props.theme.colors.secondary};
    font-size: ${(props) => props.theme.font.small};
    letter-spacing: -0.09px;
    margin-bottom: 4px;
    text-transform: capitalize;
`

const Content = styled.div`
    display: flex;
    align-items: center;
    border: 1px solid ${(props) => props.theme.colors.border};
    border-radius: ${(props) => props.theme.global.borderRadius};
    transition: all 0.3s ease;

    &.disabled {
        cursor: not-allowed;
    }
`

const Icon = styled.img`
    margin-left: 20px;
`

const CustomInput = styled.input`
    font-size: ${(props) => props.theme.font.default};
    transition: all 0.3s ease;
    width: 100%;
    border: none;
    border-radius: 0;
    padding: 20px;
    background: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.primary};
    line-height: 24px;
    outline: none;

    &:disabled {
        cursor: not-allowed;
    }
`

const MaxBtn = styled.div`
    cursor: pointer;
    transition: all 0.3s ease;
    background: ${(props) => props.theme.colors.secondary};
    padding: 6px;
    font-weight: 600;
    color: ${(props) => props.theme.colors.neutral};
    font-size: ${(props) => props.theme.font.extraSmall};
    border-radius: ${(props) => props.theme.global.borderRadius};
    margin-right: 20px;
    &:hover {
        background: ${(props) => props.theme.colors.gradient};
    }
`
