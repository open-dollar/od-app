import React from 'react';
import styled from 'styled-components';
import Logo from '../assets/od-full-logo-grey.svg'

const Footer: React.FC = () => {
    return (
        <FooterContainer>
            <Column>
                <LogoContainer><a href={'/'}>
                    <img src={Logo} height={'17px'} width={'89px'} alt="OD" />
                </a></LogoContainer>
            </Column>
            <Column>
                <Link>Blog</Link>
                <Link>Lite Paper</Link>
            </Column>
            <Column>
                <Link>App</Link>
                <Link>Auctions</Link>
                <Link>Stats</Link>
            </Column>
            <Column>
                <Link>Discord</Link>
                <Link>Twitter</Link>
                <Link>Lens</Link>
            </Column>
            <Column>
                <SmallerLink>Privacy Policy</SmallerLink>
                <SmallerLink>Terms of Service</SmallerLink>
            </Column>
        </FooterContainer>
    );
};

export default Footer;

const FooterContainer = styled.div`
  display: flex;
  justify-content: space-around;
  padding-bottom: 20px;
  padding-top: 20px;
  color: ${(props) => props.theme.colors.blueish};
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogoContainer = styled.div`
  a {
    color: inherit;
    text-decoration: none;
    img {
      &.small {
        width: 50px;
        height: 50px;
      }
    }
  }
`

const SmallerLink = styled.a`
  cursor: pointer;
  margin: 5px 0;
  color: #00587e;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Link = styled.a`
  cursor: pointer;
  margin: 5px 0;
  color: inherit;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
