import { createGlobalStyle, css } from 'styled-components'

interface Props {
    bodyOverflow?: boolean
}

const GlobalStyle = createGlobalStyle`
        body {
          color: ${(props) => props.theme.colors.primary};
          background-color:${(props) => props.theme.colors.background};
          background-image: url(${require('./assets/boxes.svg').default});
          background-size: contain;
          background-position: center 100px;
          background-repeat: no-repeat;
          overflow: ${(props: Props) =>
              props.bodyOverflow ? 'hidden' : 'visible'};

.web3modal-modal-lightbox {
  z-index: 999;

  .web3modal-modal-card {
    display:block;
    max-width:400px;
    .web3modal-provider-container {
      display:flex;
      flex-direction:row;
     justify-content:space-between;
     align-items:center;
     padding:16px;
      
     .web3modal-provider-name{
       font-size: 16px;
       width:auto;
     }

     .web3modal-provider-icon{
       order:2;
       width:30px;
       height:30px;

     }
      .web3modal-provider-description {
      display:none;
    }
    }
   
  }
}
.place-left {
    &:after{
      border-left-color:${(props) => props.theme.colors.foreground} !important
    }
  }

  .place-top {
    &:after{
      border-top-color:${(props) => props.theme.colors.foreground} !important
    }
  }
  .place-bottom {
    &:after{
      border-bottom-color:${(props) => props.theme.colors.foreground} !important
    }
  }
  .place-right {
    &:after{
      border-right-color:${(props) => props.theme.colors.foreground} !important
    }
  }
.__react_component_tooltip {
    max-width: 250px;
    padding-top: 20px;
    padding-bottom: 20px;
    border-radius: 5px;
    color:${(props) => props.theme.colors.primary};
    opacity: 1 !important;
    background: ${(props) => props.theme.colors.foreground};
    border: ${(props) => props.theme.colors.border} !important;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.16);
   
  }
        }
`

export const ExternalLinkArrow = css`
    border: 0;
    cursor: pointer;
    box-shadow: none;
    outline: none;
    padding: 0;
    margin: 0;
    color: ${(props) => props.theme.colors.blueish};
    font-size: ${(props) => props.theme.font.small};
    font-weight: 600;
    line-height: 24px;
    letter-spacing: -0.18px;
    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
        &:hover {
            opacity: 0.5;
        }
    }
    transition: all 0.3s ease;
    &:hover {
        opacity: 0.8;
    }
    img {
        position: relative;
        top: 1px;
    }
`

export const BtnStyle = css<{
    disabled?: boolean
    color?:
        | 'blueish'
        | 'greenish'
        | 'yellowish'
        | 'colorPrimary'
        | 'colorSecondary'
}>`
    pointer-events: ${({ theme, disabled }) => (disabled ? 'none' : 'inherit')};
    outline: none;
    cursor: ${({ theme, disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    min-width: 134px;
    border: none;
    box-shadow: none;
    line-height: 24px;
    font-size: ${(props) => props.theme.font.small};
    font-weight: 600;
    padding: 8px 30px;
    color: ${(props) => props.theme.colors.neutral};
    background: ${({ theme, disabled, color }) =>
        disabled
            ? theme.colors.dimmedBackground
            : theme.colors[color ?? 'blueish']};
    border-radius: ${(props) => props.theme.global.borderRadius};
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    border-radius: 50px;
    justify-content: space-between;
`

export default GlobalStyle
