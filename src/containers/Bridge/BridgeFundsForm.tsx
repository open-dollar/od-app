import React, { useState } from 'react';
import styled from 'styled-components';
import TokenInput from '~/components/TokenInput';
import { useStoreState } from '~/store';
import { getTokenLogo } from '~/utils';
import { formatWithCommas } from '~/utils';
import Dropdown from '~/components/Dropdown';

interface BridgeFundsFormProps {
  // Add any props you need here
}

const BridgeFundsForm: React.FC<BridgeFundsFormProps> = () => {
  const [selectedItem, setSelectedItem] = useState('OD');
  const [loading, setLoading] = useState(false);
  const [fromTokenAddress, setFromTokenAddress] = useState('');
  const [toTokenAddress, setToTokenAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [fromChain, setFromChain] = useState('');
  const { auctionModel: auctionsState, connectWalletModel: connectWalletState } = useStoreState((state) => state)
  const { proxyAddress, tokensData } = connectWalletState
  const collaterals = tokensData && Object.values(tokensData).filter((token) => token.isCollateral)
  const collateralsDropdown = collaterals?.map((collateral) => {
    return { name: collateral.symbol, icon: getTokenLogo(collateral.symbol) }
  })

  const dropdownSelected = collateralsDropdown?.find((item) => item.name === selectedItem)!
  if (!tokensData?.OD || !selectedItem || !dropdownSelected) return null
  return (
    // Add your JSX code here
    <Container>
      <Content>
        <Dropdown
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
        />
      </Content>
    </Container>
  );
};

export default BridgeFundsForm;

const Container = styled.div``

const Content = styled.div`
    position: relative;
`
