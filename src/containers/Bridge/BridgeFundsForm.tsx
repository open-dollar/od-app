import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '~/components/Button';
import { useStoreActions, useStoreState } from '~/store';

interface BridgeFundsFormProps {
  // Add any props you need here
}

const BridgeFundsForm: React.FC<BridgeFundsFormProps> = () => {
  const [loading, setLoading] = useState(false);
  
  const { bridgeModel: bridgeModelState } = useStoreState((state) => state);
  const { setFromTokenAddress, setToTokenAddress, setToChain, setOriginChain, setAmount, bridge } = useStoreActions((state) => state.bridgeModel)
  const { fromTokenAddress, toTokenAddress, toChain, originChain, amount } = bridgeModelState

  return (
    <Container>
      <Content>
        <Button onClick={() => bridge(bridgeModelState)}>Bridge</Button>
      </Content>
    </Container>
  );
};

export default BridgeFundsForm;

const Container = styled.div``

const Content = styled.div`
    position: relative;
`
