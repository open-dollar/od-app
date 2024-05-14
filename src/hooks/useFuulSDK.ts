import { Fuul } from '@fuul/sdk';
import { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';

function useFuulSDK() {
  const { provider } = useWeb3React();

  useEffect(() => {
    Fuul.init({
      apiKey: process.env.REACT_APP_FUUL_API_KEY!
    })
  }, []);

  const fuulSendPageViewEvent = async (pageName: string) => {
    const response = await Fuul.sendPageview(pageName)
    return response;
  }

  const sendConnectWalletEvent = async (walletAddress: string) => {
    const time = new Date().toDateString();
    const signature = await provider?.getSigner().signMessage(`Accept affiliate on ${time}`)
    const response = await Fuul.sendConnectWallet({
      address: walletAddress,
      signature,
      message: `Accept affiliate on ${time}`
    });
    return response;
  }

  return {
    Fuul,
    fuulSendPageViewEvent,
    sendConnectWalletEvent,
  };
}

export default useFuulSDK;