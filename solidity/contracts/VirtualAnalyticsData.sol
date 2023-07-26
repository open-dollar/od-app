// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface ISAFEEngine {
  struct SAFEEngineCollateralData {
    uint256 /* WAD */ debtAmount;
    uint256 /* RAY */ accumulatedRate;
    uint256 /* RAY */ safetyPrice;
    uint256 /* RAY */ liquidationPrice;
  }
  function cData(bytes32 _cType) external view returns (SAFEEngineCollateralData memory _cData);
}

interface IBaseOracle {
  function getResultWithValidity() external view returns (uint256 _result, bool _validity);
  function read() external view returns (uint256 _value);
}

interface IDelayedOracle is IBaseOracle {
  function priceSource() external view returns (IBaseOracle _priceSource);
  function getNextResultWithValidity() external view returns (uint256 _result, bool _validity);
  function lastUpdateTime() external view returns (uint256 _lastUpdateTime);
}

interface IOracleRelayer {
    struct OracleRelayerCollateralParams {
        IDelayedOracle oracle;
        uint256 safetyCRatio;
        uint256 PriceCRatio;
    }
    function marketPrice() external view returns (uint256 _marketPrice);
    function redemptionPrice() external returns (uint256 _redemptionPrice);
    function redemptionRate() external view returns (uint256 _redemptionRate);
    function cParams(bytes32 _cType) external view returns (OracleRelayerCollateralParams memory _cParams);
}

contract VirtualAnalyticsData {
    struct AnalyticsData {
        uint256 marketPrice;
        uint256 redemptionPrice;
        uint256 redemptionRate;
        TokenAnalyticsData[] tokenData;
    }

    struct TokenAnalyticsData {
        uint256 debtAmount;
        // TODO: add lockedAmount from SAFEEngine when available
        // uint256 lockedAmount;
        uint256 currentPrice;
        uint256 nextPrice;
    }

    constructor(
        ISAFEEngine _safeEngine,
        IOracleRelayer _oracleRelayer,
        bytes32[] memory cTypes
    ) {
        TokenAnalyticsData[] memory tokenAnalyticsData = new TokenAnalyticsData[](cTypes.length);
        for (uint256 i = 0; i < cTypes.length; i++) {
            bytes32 cType = cTypes[i];
            uint256 _debtAmount = _safeEngine.cData(cType).debtAmount;
            IDelayedOracle _oracle = _oracleRelayer.cParams(cType).oracle;
            (uint256 _currentPrice,) = _oracle.getResultWithValidity();
            (uint256 _nextPrice,) = _oracle.getNextResultWithValidity();

            tokenAnalyticsData[i] = TokenAnalyticsData({
                debtAmount: _debtAmount,
                currentPrice: _currentPrice,
                nextPrice: _nextPrice
            });
        }

        AnalyticsData memory analyticsData = AnalyticsData({
            marketPrice: _oracleRelayer.marketPrice(),
            redemptionPrice: _oracleRelayer.redemptionPrice(),
            redemptionRate: _oracleRelayer.redemptionRate(),
            tokenData: tokenAnalyticsData
        });

        // encode return data
        bytes memory data = abi.encode(analyticsData);

        // force constructor return via assembly
        assembly {
            let dataStart := add(data, 32) // abi.encode adds an additional offset
            return(dataStart, sub(msize(), dataStart))
        }
    }
}
