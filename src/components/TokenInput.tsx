import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader } from 'react-feather'
import styled from 'styled-components'
import { NumericFormat, NumberFormatValues } from 'react-number-format'

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
    maxText = 'max',
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
                        customInput={CustomInput} // You use your styled component as the actual input
                        data-test-id={data_test_id}
                        isAllowed={validateInput}
                    />
                    {disableMax || disabled ? null : <MaxBtn onClick={handleMaxClick}>{t(maxText)}</MaxBtn>}
                </Flex>
            </Content>

            <Flex>
                <Label data-test-id={data_test_id + '_label'}>
                    {console.log({ label })}
                    {label}
                </Label>
                {rightLabel ? <Label>{rightLabel}</Label> : null}
            </Flex>
        </Container>
    )
}

export default TokenInput

const Container = styled.div``

const Label = styled.div`
    line-height: 21px;
    color: ${(props) => props.theme.colors.accent};
    font-size: 13px;
    letter-spacing: -0.09px;
    text-transform: capitalize;
    display: flex;
    align-items: center;
    @media (max-width: 767px) {
        font-size: ${(props) => props.theme.font.xSmall};
    }
`

const Content = styled.div`
    background: ${(props) => props.theme.colors.placeholder};
    border: 2px solid ${(props) => props.theme.colors.primary};
    border-radius: 4px;
    transition: all 0.3s ease;
    padding-right: 12px;
    margin-bottom: 8px;
    &.disabled {
        cursor: not-allowed;
    }
`

export const Icon = styled.img`
    margin-right: 10px;
    max-width: 23px;
`

const CustomInput = styled.input`
    font-size: ${(props) => props.theme.font.large};
    font-family: 'Montserrat', sans-serif;
    transition: all 0.3s ease;
    width: 100%;
    border: none;
    border-radius: 4px;
    height: 36px;
    display: flex;
    align-items: center;
    text-align: right;
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
    background: ${(props) => props.theme.colors.background};
    padding: 0px 6px;
    border-radius: 4px;
    font-weight: 700;
    color: ${(props) => props.theme.colors.primary};
    font-size: ${(props) => props.theme.font.default};
    text-transform: uppercase;
    margin-left: 16px;
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
    background: ${(props) => props.theme.colors.background};
    padding: 12px;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
`
