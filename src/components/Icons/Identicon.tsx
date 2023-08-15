import React, { useEffect, useRef } from 'react'

import styled from 'styled-components'

// @ts-ignore
import Jazzicon from 'jazzicon'
import {useWeb3React} from "@web3-react/core";

const StyledIdenticonContainer = styled.div`
    border-radius: 1.125rem;
    background-color: ${({ theme }) => theme.colors.background};
`

export default function Identicon() {
    const ref = useRef<HTMLDivElement>()

    const { account } = useWeb3React()

    useEffect(() => {
        if (account && ref.current) {
            ref.current.innerHTML = ''
            ref.current.appendChild(Jazzicon(16, parseInt(account.slice(2, 10), 16)))
        }
    }, [account])

    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    return <StyledIdenticonContainer ref={ref as any} />
}
