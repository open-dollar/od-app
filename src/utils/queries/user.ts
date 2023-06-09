export const userQuery = (address: string) =>
    `user(id:"${address}"){
  id
}
`

export const getSubgraphBlock = (blockNunber: number) => `{
  systemStates(block: {number: ${blockNunber}}) {
    id
  }
}`
export const getUserQuery = (address: string) => `{
  ${userQuery(address)}
 }`

export const internalBalanceQuery = (proxyAddress: string) => `{
  internalCoinBalances(where: {accountHandler: "${proxyAddress}"}) {
    balance
  }
  protInternalBalance:erc20Balances(where: {address: "${proxyAddress}", label: "PROT_TOKEN"}) {
    balance
  }
}`

export const fetchFLXBalanceQuery = (address: string) => `{
  protBalance:erc20Balances(where: {address: "${address}", label: "PROT_TOKEN"}) {
    balance
    }
}`
