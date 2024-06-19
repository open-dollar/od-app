import { getTokenLogo } from '~/utils'

const TokenIcon = ({ token, width = '40px', height = '40px' }: { token: string; width?: string; height?: string }) => {
    return <img src={getTokenLogo(token)} alt={token} width={width} height={height} />
}

export default TokenIcon
