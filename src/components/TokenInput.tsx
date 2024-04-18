import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader } from 'react-feather'
import styled from 'styled-components'
import { NumericFormat, NumberFormatValues } from 'react-number-format'

interface Props {
    label: React.ReactNode
    rightLabel?: string
    token: { icon: string; name: string } | undefined
    iconSize?: string
    placeholder?: string
    value: string
    onChange: (val: string) => void
    disableMax?: boolean
    handleMaxClick?: () => void
    disabled?: boolean
    maxText?: 'MAX' | 'MIN'
    data_test_id?: string
    decimals?: number
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
    maxText = 'MAX',
    data_test_id,
    decimals = 4,
}: Props) => {
    const { t } = useTranslation()

    const [length] = useState(16)

    const handleValueChange = (values: NumberFormatValues) => {
        const { value } = values

        if (value === '.') {
            onChange('0.')
            return
        }

        onChange(value)
    }

    const validateInput = (values: NumberFormatValues) => {
        const { formattedValue, value } = values
        const [firstChar, secondChar] = [value.charAt(0), value.charAt(1)]

        if (firstChar === '.') {
            return true
        }

        if (firstChar === '0' && secondChar && secondChar !== '.') {
            return false
        }

        return formattedValue === '' || Number(formattedValue.replace(/,/g, '')) >= 0
    }

    return (
        <Container>
            <Content className={disabled ? 'disabled' : ''}>
                <Flex>
                    <TokenBox>
                        {token?.icon ? (
                            <Icon src={token?.icon} width={iconSize || '24px'} height={iconSize || '24px'} />
                        ) : (
                            <Loader width={iconSize || '24px'} />
                        )}
                        {token?.name}
                    </TokenBox>
                    <NumericFormat
                        value={value}
                        onValueChange={handleValueChange}
                        thousandSeparator={true}
                        decimalScale={decimals}
                        allowNegative={false}
                        placeholder={placeholder || '0.00'}
                        type={'text'}
                        inputMode="decimal"
                        maxLength={length}
                        minLength={1}
                        disabled={disabled}
                        customInput={CustomInput}
                        data-test-id={data_test_id}
                        isAllowed={validateInput}
                    />
                    {disableMax || disabled ? null : <MaxBtn onClick={handleMaxClick}>{t(maxText)}</MaxBtn>}
                </Flex>
            </Content>
            <Flex>
                <Label data-test-id={data_test_id + '_label'}>{label} </Label>
                {rightLabel ? <Label>{rightLabel}</Label> : null}
            </Flex>
        </Container>
    )
}

export default TokenInput

const Container = styled.div``

const Label = styled.div`
    line-height: 20px;
    color: #1c293a;
    font-size: 13px;
    font-family: 'Open Sans', sans-serif;
    letter-spacing: -0.09px;
    text-transform: capitalize;
    display: flex;
    align-items: center;
    padding-top: 4px;
`

const Content = styled.div`
    background: white;
    border: 2px solid ${(props) => props.theme.colors.border};
    border-radius: 4px;
    transition: all 0.3s ease;
    &.disabled {
        cursor: not-allowed;
    }
`

export const Icon = styled.img`
    margin-right: 10px;
    max-width: 23px;
`

const CustomInput = styled.input`
    font-size: 18px;
    font-family: 'Open Sans', sans-serif;
    font-weight: 700;
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
    color: #1c293a;
    line-height: 24px;
    outline: none;

    &:disabled {
        cursor: not-allowed;
    }
`

const MaxBtn = styled.div`
    cursor: pointer;
    transition: all 0.3s ease;
    background: #e2f1ff;
    padding: 0 6px 0 6px;
    font-weight: 700;
    font-family: 'Open Sans', sans-serif;
    color: ${(props) => props.theme.colors.blueish};
    border-radius: 4px;
    text-transform: capitalize;
    margin-left: 8px;
    margin-right: 8px;
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
    background: #e2f1ff;
    align-items: center;
    padding: 10px 10px;
    font-size: 14px;
    color: #1c293a;
    font-family: 'Open Sans', sans-serif;
    font-weight: 700;
    flex: 0 0 30%;
`
