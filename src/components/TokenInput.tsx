import React, { ChangeEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface Props {
    label: string
    rightLabel?: string
    token: { icon: string; name: string } | undefined
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

const TokenInput = ({
    label,
    rightLabel,
    placeholder,
    token,
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
            <Content className={disabled ? 'disabled' : ''}>
                <Flex>
                    <TokenBox>
                        <Icon
                            src={token?.icon}
                            width={iconSize || '24px'}
                            height={iconSize || '24px'}
                        />
                        {token?.name}
                    </TokenBox>
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
                </Flex>
                <Flex>
                    <Label data-test-id={data_test_id + '_label'}>
                        {label}{' '}
                        {disableMax || disabled ? null : (
                            <MaxBtn onClick={handleMaxClick}>
                                ({t(maxText)})
                            </MaxBtn>
                        )}
                    </Label>
                    {rightLabel ? <Label>{rightLabel}</Label> : null}
                </Flex>
            </Content>
        </Container>
    )
}

export default TokenInput

const Container = styled.div``

const Label = styled.div`
    line-height: 21px;
    color: ${(props) => props.theme.colors.secondary};
    font-size: ${(props) => props.theme.font.small};
    letter-spacing: -0.09px;
    text-transform: capitalize;
    display: flex;
    align-items: center;
    @media (max-width: 767px) {
        font-size: ${(props) => props.theme.font.extraSmall};
    }
`

const Content = styled.div`
    background: ${(props) => props.theme.colors.placeholder};
    border: 1px solid ${(props) => props.theme.colors.border};
    border-radius: 10px;
    transition: all 0.3s ease;
    padding: 10px 20px;
    &.disabled {
        cursor: not-allowed;
    }
`

const Icon = styled.img`
    margin-right: 10px;
    max-width: 23px;
`

const CustomInput = styled.input`
    font-size: ${(props) => props.theme.font.large};
    font-family: 'Montserrat', sans-serif;
    transition: all 0.3s ease;
    width: 100%;
    border: none;
    border-radius: 0;
    height: 36px;
    display: flex;
    align-items: center;
    padding: 0 0 0 5px;
    text-align: right;
    background: ${(props) => props.theme.colors.placeholder};
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
    background: transparent;
    padding: 0px;
    font-weight: 600;
    color: ${(props) => props.theme.colors.blueish};
    font-size: ${(props) => props.theme.font.extraSmall};
    border-radius: 0;
    text-transform: capitalize;
    margin-left: 3px;
`

const Flex = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    &:last-child {
        margin-bottom: 0;
    }
`

const TokenBox = styled.div`
    display: flex;
    align-items: center;
    font-size: ${(props) => props.theme.font.medium};
    flex: 0 0 40%;
`
