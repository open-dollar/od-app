import React from 'react'

import { useSpring, animated } from '@react-spring/web'
import styled from 'styled-components'

// <AnimationLoop reset native config={{ duration: 2000 }}>

const LoadingDots = () => {
    const items = new Array(3).fill(null)

    const { values } = useSpring({
        from: { values: 0 },
        to: { values: 2 * Math.PI },
        loop: true,
        config: {
            duration: 2000,
        },
        keys: items,
    })
    return (
        <Wrapper>
            {items.map((item, i) => (
                <animated.div
                    className="loading-dots__dot"
                    key={i}
                    style={{
                        transform: values.to((r) => `translate3d(0, ${2 * Math.sin(r + (i * 2 * Math.PI) / 5)}px, 0)`),
                    }}
                />
            ))}
        </Wrapper>
    )
}

export default LoadingDots

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 0 0 3px;

    & .loading-dots__dot {
        display: inline-block;
        border-radius: 100%;
        width: 4px;
        height: 4px;
        background-color: white;
        &:not(:last-child) {
            margin-right: 3px;
        }
    }
`
