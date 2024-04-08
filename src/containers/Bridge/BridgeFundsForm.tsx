import React, { useState } from 'react';
import styled from 'styled-components';
import TokenInput from '~/components/TokenInput';
import { useStoreState } from '~/store';
import { getTokenLogo } from '~/utils';
import { formatWithCommas } from '~/utils';
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
 
  const handleBridge = async () => {
    setLoading(true)
    const url = formatBridgeUrl(amount, fromTokenAddress, fromChain, toTokenAddress)
    window.open(url, '_blank')
  }

  // const dropdownSelected = collateralsDropdown?.find((item) => item.name === selectedItem)!
  // if (!tokensData?.OD || !selectedItem || !dropdownSelected) return <>No items</>
  return (
    // Add your JSX code here
    <Container>
      <Content>
        {/* <Dropdown
          items={collateralsDropdown!}
          itemSelected={dropdownSelected!}
          getSelectedItem={setSelectedItem}
        />
        <TokenInput
          token={
              tokensData.OD && {
                  icon: getTokenLogo(tokensData.OD.symbol),
                  name: tokensData.OD.symbol,
              }
          }
          label={`Amount`}
          rightLabel={`~$${formatWithCommas(amount)}`}
          onChange={(e: any) => setAmount(e.target.value)}
          value={amount}
          handleMaxClick={() => setAmount('')}
          data_test_id="repay_withdraw"
        /> */}
        <button onClick={handleBridge}>Bridge</button>
      </Content>
    </Container>
  );
};

export default BridgeFundsForm;

const Container = styled.div``

const Content = styled.div`
    position: relative;
`
