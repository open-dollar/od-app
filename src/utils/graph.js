import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'https://subgraph.reflexer.finance/subgraphs/name/reflexer-labs/rai',
  cache: new InMemoryCache()
});
