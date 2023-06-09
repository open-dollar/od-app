import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import LoadingIcon from './Icons/LoadingIcon'

interface Props {
    text?: string
    width?: string
    fontSize?: string
    hideSpinner?: boolean | null
    inlineButton?: boolean
}
const Loader = ({
    text,
    width,
    fontSize,
    hideSpinner,
    inlineButton,
}: Props) => {
    return (
        <Container inline={inlineButton}>
            {hideSpinner ? null : (
                <LoadingIcon
                    style={{ width: width || '14px', height: width || '14px' }}
                />
            )}
            <span style={{ fontSize: fontSize }}>{text}</span>
        </Container>
    )
}

export default Loader

const rotating = keyframes`
  from {
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  
  to {
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
`

const Container = styled.div<{ inline?: boolean }>`
    ${(props) =>
        props.inline
            ? css`
                  display: inline;
                  margin-left: 4px;
                  vertical-align: middle;
              `
            : css`
                  display: flex;
                  align-items: center;
              `}

    svg {
        stroke: ${(props) => props.theme.colors.inputBorderColor};
        animation: ${rotating} 1.5s linear infinite;
        margin-right: 10px;
    }

    span {
        font-size: ${(props) => props.theme.font.small};
    }
`
