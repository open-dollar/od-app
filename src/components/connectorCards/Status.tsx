import type { Web3ReactHooks } from '@web3-react/core'
import styled from 'styled-components'

export function Status({
    userInitiatedConnection,
    isActivating,
    isActive,
    error,
}: {
    userInitiatedConnection: boolean
    isActivating: ReturnType<Web3ReactHooks['useIsActivating']>
    isActive: ReturnType<Web3ReactHooks['useIsActive']>
    error?: Error
}) {
    return (
        <StatusText>
            {isActive ? (
                <>Connected</>
            ) : error ? (
                <></>
            ) : isActivating && userInitiatedConnection ? (
                <>Awaiting Connection...</>
            ) : (
                <></>
            )}
        </StatusText>
    )
}

const StatusText = styled.div`
    font-weight: 400;
    font-family: 'Open Sans', serif;
    font-size: 16px;
    line-height: 24px;
    color: #e2f1ff;
`
