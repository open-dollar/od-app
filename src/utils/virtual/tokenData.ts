import { BigNumber, ethers } from 'ethers';
import { Geb, utils } from '@hai-on-op/sdk';
import { bytecode } from '../../artifacts/contracts/TokensData.sol/TokensData.json';
import { TokenData } from '@hai-on-op/sdk/lib/contracts/addreses';

export interface TokenFetchData {
  balance: string;
}

export async function fetchTokenData(geb: Geb, user: string, tokens: { [token: string]: TokenData }): Promise<{ [token: string]: TokenFetchData }> {
  // Encoded input data to be sent to the batch contract constructor
  const inputData = ethers.utils.defaultAbiCoder.encode(
    ['address', 'address[]'],
    [user, Object.values(tokens).map(token => token.address).filter(address => address !== undefined && address !== '')]
  );

  // Generate payload from input data
  const payload = bytecode.concat(inputData.slice(2));

  // Call the deployment transaction with the payload
  const returnedData = await geb.provider.call({ data: payload });

  // Parse the returned value to the struct type in order
  const decoded = ethers.utils.defaultAbiCoder.decode(
    [
      'tuple(uint256 balance)[]'
    ],
    returnedData
  )[0] as TokenFetchData[];

  const result: { [token: string]: TokenFetchData } = Object.keys(tokens).reduce((obj, key, i) => ({ ...obj, [key]: decoded[i] }), {});
  
  const parsedResult = Object.entries(result).reduce((newObj, [key, value]) => {
    return {
      ...newObj,
      [key]: { ...value, balance: value.balance.toString() }
    };
  }, {})

  return parsedResult;
}