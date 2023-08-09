// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IOracleRelayer {
    struct OracleRelayerCollateralParams {
        // Usually an oracle security module that enforces delays to fresh price feeds
        address oracle;
        // CRatio used to compute the 'safePrice' - the price used when generating debt in SAFEEngine
        uint256 safetyCRatio;
        // CRatio used to compute the 'liquidationPrice' - the price used when liquidating SAFEs
        uint256 liquidationCRatio;
    }

    function redemptionPrice() external returns (uint256);
    function redemptionRate() external view returns (uint256);
    function cParams(bytes32) external view returns (OracleRelayerCollateralParams memory);
}

interface ISAFEEngine {
    struct SAFEEngineParams {
        uint256 /* WAD */ safeDebtCeiling;
        uint256 /* RAD */ globalDebtCeiling;
    }

    struct SAFEEngineCollateralParams {
        uint256 /* RAD */ debtCeiling;
        uint256 /* RAD */ debtFloor;
    }

    struct SAFEEngineCollateralData {
        uint256 /* WAD */ debtAmount;
        uint256 /* WAD */ lockedAmount;
        uint256 /* RAY */ accumulatedRate;
        uint256 /* RAY */ safetyPrice;
        uint256 /* RAY */ liquidationPrice;
    }

    function globalDebt() external view returns (uint256);
    function params() external view returns (SAFEEngineParams memory);
    function cParams(bytes32) external view returns (SAFEEngineCollateralParams memory);
    function cData(bytes32) external view returns (SAFEEngineCollateralData memory);
}

interface ILiquidationEngine {
    struct LiquidationEngineCollateralParams {
        address collateralAuctionHouse;
        uint256 liquidationPenalty;
        uint256 liquidationQuantity;
    }

    function cParams(bytes32) external view returns (LiquidationEngineCollateralParams memory);
}

interface ITaxCollector {
    struct TaxCollectorCollateralData {
        uint256 /* RAY */ nextStabilityFee;
        uint256 updateTime;
        uint256 /* WAD % */ secondaryReceiverAllotedTax;
    }

    function cData(bytes32) external view returns (TaxCollectorCollateralData memory);
    function taxSingle(bytes32) external;
}

contract VirtualLiquidationData {
    struct LiquidationData {
        uint256 redemptionPrice;
        uint256 redemptionRate;
        uint256 globalDebt;
        uint256 globalDebtCeiling;
        uint256 safeDebtCeiling;
        TokenLiquidationData[] tokenLiquidationData;
    }

    struct TokenLiquidationData {
        uint256 accumulatedRate;
        uint256 debtFloor;
        uint256 liquidationPrice;
        uint256 safetyPrice;
        uint256 safetyCRatio;
        uint256 liquidationCRatio;
        uint256 liquidationPenalty;
        uint256 stabilityFee;
    }

    constructor(
        IOracleRelayer oracleRelayer,
        ISAFEEngine safeEngine,
        ILiquidationEngine liquidationEngine,
        ITaxCollector taxCollector,
        bytes32[] memory cTypes
    ) {
        ISAFEEngine.SAFEEngineParams memory _safeEngineParams = safeEngine.params();
        
        TokenLiquidationData[] memory tokenLiquidationData = new TokenLiquidationData[](cTypes.length);
        for (uint256 i = 0; i < cTypes.length; i++) {
            bytes32 cType = cTypes[i];
            taxCollector.taxSingle(cType);
            ISAFEEngine.SAFEEngineCollateralParams memory _safeEngineCParams = safeEngine.cParams(cType);
            ISAFEEngine.SAFEEngineCollateralData memory _safeEngineCData = safeEngine.cData(cType);
            IOracleRelayer.OracleRelayerCollateralParams memory _oracleRelayerCParams = oracleRelayer.cParams(cType);
            ILiquidationEngine.LiquidationEngineCollateralParams memory _liquidationEngineCParams =
                liquidationEngine.cParams(cType);
            ITaxCollector.TaxCollectorCollateralData memory _taxCollectorCData = taxCollector.cData(cType);

            tokenLiquidationData[i] = TokenLiquidationData({
                accumulatedRate: _safeEngineCData.accumulatedRate,
                debtFloor: _safeEngineCParams.debtFloor,
                liquidationPrice: _safeEngineCData.liquidationPrice,
                safetyPrice: _safeEngineCData.safetyPrice,
                safetyCRatio: _oracleRelayerCParams.safetyCRatio,
                liquidationCRatio: _oracleRelayerCParams.liquidationCRatio,
                liquidationPenalty: _liquidationEngineCParams.liquidationPenalty,
                stabilityFee: _taxCollectorCData.nextStabilityFee
            });
        }

        LiquidationData memory returnData = LiquidationData({
            redemptionPrice: oracleRelayer.redemptionPrice(),
            redemptionRate: oracleRelayer.redemptionRate(),
            globalDebt: safeEngine.globalDebt(),
            globalDebtCeiling: _safeEngineParams.globalDebtCeiling,
            safeDebtCeiling: _safeEngineParams.safeDebtCeiling,
            tokenLiquidationData: tokenLiquidationData
        });

        // encode return data
        bytes memory data = abi.encode(returnData);

        // force constructor return via assembly
        assembly {
            let dataStart := add(data, 32) // abi.encode adds an additional offset
            return(dataStart, sub(msize(), dataStart))
        }
    }
}
