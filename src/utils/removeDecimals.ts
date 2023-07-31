export const sanitizeDecimals = (val: string, decimals: number) => {
    const formattedValue = val.replace(/[^0-9.]/g, '')
    const [integer, decimal] = formattedValue.split('.')
    const formattedDecimal = decimal ? `.${decimal.slice(0, decimals)}` : ''
    return formattedDecimal ? `${integer}${formattedDecimal}` : integer
}
