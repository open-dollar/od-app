// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

uint256 constant RAY = 1e27;

interface IERC20 {
    function balanceOf(address _user) external view returns (uint256 _balance);
    function totalSupply() external view returns (uint256 _totalSupply);
}

interface ISAFEEngine {
  struct SAFEEngineCollateralData {
    uint256 /* WAD */ debtAmount;
    uint256 /* WAD */ lockedAmount;
    uint256 /* RAY */ accumulatedRate;
    uint256 /* RAY */ safetyPrice;
    uint256 /* RAY */ liquidationPrice;
  }
  struct SAFEEngineParams {
    uint256 /* WAD */ safeDebtCeiling;
    uint256 /* RAD */ globalDebtCeiling;
  }
  struct SAFEEngineCollateralParams {
    uint256 /* RAD */ debtCeiling;
    uint256 /* RAD */ debtFloor;
  }
  function coinBalance(address _user) external view returns (uint256 _coinBalance);
  function debtBalance(address _user) external view returns (uint256 _debtBalance);
  function globalDebt() external view returns (uint256 _globalDebt);
  function globalUnbackedDebt() external view returns (uint256 _globalUnbackedDebt);
  function cData(bytes32 _cType) external view returns (SAFEEngineCollateralData memory _cData);
  function params() external view returns (SAFEEngineParams memory _params);
  function cParams(bytes32 _cType) external view returns (SAFEEngineCollateralParams memory _cParams);
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
        uint256 liquidationCRatio;
    }
    function marketPrice() external view returns (uint256 _marketPrice);
    function redemptionPrice() external returns (uint256 _redemptionPrice);
    function redemptionRate() external view returns (uint256 _redemptionRate);
    function cParams(bytes32 _cType) external view returns (OracleRelayerCollateralParams memory _cParams);
}

interface IPIDController {
    struct DeviationObservation {
        uint256 timestamp;
        int256 proportional;
        int256 integral;
    }
    function deviationObservation() external view returns (DeviationObservation memory __deviationObservation);
    function getGainAdjustedPIOutput(int256 _proportionalTerm,int256 _integralTerm) external view returns (int256 _piOutput);
    function getBoundedRedemptionRate(int256 _piOutput) external view returns (uint256 _redemptionRate);
}

interface ITaxCollector {
    struct TaxCollectorCollateralData {
        uint256 nextStabilityFee;
        uint256 updateTime;
        uint256 secondaryReceiverAllotedTax; // [wad%]
    }
    function cData(bytes32 _cType) external view returns (TaxCollectorCollateralData memory _cData);
}

contract VirtualAnalyticsData {
    struct AnalyticsData {
        uint256 erc20Supply;
        uint256 globalDebt;
        uint256 globalDebtCeiling;
        uint256 globalUnbackedDebt;
        uint256 marketPrice;
        uint256 redemptionPrice;
        uint256 redemptionRate;
        uint256 redemptionRatePTerm;
        uint256 redemptionRateITerm;
        uint256 surplusInTreasury;
        TokenAnalyticsData[] tokenData;
    }

    struct TokenAnalyticsData {
        address delayedOracle;
        uint256 debtAmount;
        uint256 debtCeiling;
        uint256 lockedAmount;
        uint256 currentPrice;
        uint256 nextPrice;
        uint256 stabilityFee;
    }

    constructor(
        IERC20 _haiToken,
        ISAFEEngine _safeEngine,
        IOracleRelayer _oracleRelayer,
        IPIDController _pidController,
        ITaxCollector _taxCollector,
        address _stabilityFeeTreasury,
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
                delayedOracle: address(_oracle),
                debtAmount: _debtAmount,
                debtCeiling: _safeEngine.cParams(cType).debtCeiling / RAY,
                lockedAmount: _safeEngine.cData(cType).lockedAmount,
                currentPrice: _currentPrice,
                nextPrice: _nextPrice,
                stabilityFee: _taxCollector.cData(cType).nextStabilityFee
            });
        }

        IPIDController.DeviationObservation memory deviationObservation = _pidController.deviationObservation();
        int256 _pOutput = _pidController.getGainAdjustedPIOutput(deviationObservation.proportional, 0);
        int256 _iOutput = _pidController.getGainAdjustedPIOutput(0, deviationObservation.integral);

        uint256 _surplusInTreasury = 
        _haiToken.balanceOf(address(_stabilityFeeTreasury)) * RAY
         + _safeEngine.coinBalance(address(_stabilityFeeTreasury)) 
         - _safeEngine.debtBalance(address(_stabilityFeeTreasury));

        AnalyticsData memory analyticsData = AnalyticsData({
            erc20Supply: _haiToken.totalSupply(),
            globalDebt: _safeEngine.globalDebt() / RAY,
            globalDebtCeiling: _safeEngine.params().globalDebtCeiling / RAY,
            globalUnbackedDebt: _safeEngine.globalUnbackedDebt() / RAY,
            marketPrice: _oracleRelayer.marketPrice(),
            redemptionPrice: _oracleRelayer.redemptionPrice() / 1e9,
            redemptionRate: _oracleRelayer.redemptionRate(),
            redemptionRatePTerm: _pidController.getBoundedRedemptionRate(_pOutput),
            redemptionRateITerm: _pidController.getBoundedRedemptionRate(_iOutput),
            surplusInTreasury: _surplusInTreasury / RAY,
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
