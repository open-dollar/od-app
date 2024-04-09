import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '~/components/Button';
import Dropdown from '~/components/Dropdown';
import { formatBridgeUrl } from '~/utils/formatBridgeUrl';

interface BridgeFundsFormProps {
  // Add any props you need here
}

const BridgeFundsForm: React.FC<BridgeFundsFormProps> = () => {
  const [loading, setLoading] = useState(false);
  const [fromTokenAddress, setFromTokenAddress] = useState('0x6B175474E89094C44Da98b954EedeAC495271d0F'); //DAI ETH
  const [toTokenAddress, setToTokenAddress] = useState('0x5979D7b546E38E414F7E9822514be443A4800529'); //WSETH ARB
  const [amount, setAmount] = useState('100');
  const [fromChain, setFromChain] = useState(10);

  const chains = [{ name: 'Ethereum', value: 1, icon: ''}, { name: 'Arbitrum', value: 412621, icon: ''}, { name: 'Polygon', value: 137, icon: ''}]
  const tokens = [{ name: 'Token 1', value: '', icon: '' }, { name: 'Token 2', value: '', icon: '' }, { name: 'Token 3', value: '', icon: '' }]
  const handleBridge = async () => {
    setLoading(true)
    const url = formatBridgeUrl(amount, fromTokenAddress, fromChain, toTokenAddress)
    window.open(url, '_blank')
  }

  return (
    // Add your JSX code here
    <Container>
      <Content>
        <Dropdown
          items={chains}
          itemSelected={'Ethereum'}
        />
        <Dropdown
          items={tokens}
          itemSelected={tokens[0]}
        />
        <Dropdown
          items={[{ name: 'Arbitrum', value: 42161, icon: ''}]}
          itemSelected={{ name: 'Arbitrum', value: 42161, icon: ''}}
        />
        <Button onClick={handleBridge} style={{ backgroundColor: 'black' }}>Bridge</Button>
      </Content>
    </Container>
  );
};

export default BridgeFundsForm;

const Container = styled.div``

const Content = styled.div`
    position: relative;
`
