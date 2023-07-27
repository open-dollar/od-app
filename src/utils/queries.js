import { gql } from '@apollo/client';

export const SYSTEMSTATE_QUERY = gql`
  query GetSystemState {
    systemStates {
      safeCount
      globalDebt
      totalActiveSafeCount
      currentRedemptionPrice {
        value
      }
    }
    collateralPrices(orderBy: timestamp, orderDirection: desc, first: 1) {
      collateral {
        totalCollateral
        currentPrice {
          value
        }
      }
    }
    dailyStats(first: 1, orderBy: timestamp, orderDirection: desc) {
      marketPriceUsd
      redemptionPrice {
        value
      }
    }
    redemptionRates(first: 1, orderBy: createdAt, orderDirection: desc) {
      annualizedRate
    }
    safes(first: 1) {
      collateralType {
        safeCount
        currentPrice {
          collateral {
            liquidationCRatio
          }
          liquidationPrice
        }
      }
    }
  }
`;

export const ALLSAFES_QUERY_WITH_ZERO = gql`
  query GetAllSafes(
    $first: Int
    $skip: Int
    $orderBy: String
    $orderDirection: String
  ) {
    safes(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      safeId
      collateral
      debt
      owner {
        address
      }
      collateralType {
        accumulatedRate
        currentPrice {
          value
          liquidationPrice
          collateral {
            liquidationCRatio
          }
        }
        safeCount
      }
      saviour {
        allowed
      }
    }
  }
`;

export const ALLSAFES_QUERY_NOT_ZERO = gql`
  query GetAllSafes(
    $first: Int
    $skip: Int
    $orderBy: String
    $orderDirection: String
  ) {
    safes(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: { collateral_not: "0" }
    ) {
      id
      safeId
      collateral
      debt
      owner {
        address
      }
      collateralType {
        accumulatedRate
        currentPrice {
          value
          liquidationPrice
          collateral {
            liquidationCRatio
          }
        }
        safeCount
      }
      saviour {
        allowed
      }
    }
  }
`;

export const SAFE_QUERY = gql`
  query GetSafe($id: String) {
    safes(where: { safeId: $id }) {
      id
      safeId
      collateral
      debt
      owner {
        address
      }
      collateralType {
        accumulatedRate
        currentPrice {
          value
          liquidationPrice
          collateral {
            liquidationCRatio
          }
        }
      }
    }
    dailyStats(first: 1, orderBy: timestamp, orderDirection: desc) {
      redemptionPrice {
        value
      }
    }
  }
`;

export const SAFE_ACTIVITY_QUERY = gql`
  query GetSafeActivity($id: String) {
    safe(id: $id) {
      modifySAFECollateralization(orderBy: createdAt, orderDirection: desc) {
        deltaDebt
        deltaCollateral
        createdAt
        createdAtTransaction
        accumulatedRate
      }
    }
  }
`;
