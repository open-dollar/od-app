// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IERC20 {
    function balanceOf(address guy) external view returns (uint256);
}

interface IProxyRegistry {
    function proxies(address guy) external view returns (address);
}

interface ISafeManager {
    function getSafesData(address guy)
        external
        view
        returns (uint256[] memory ids, address[] memory safes, bytes32[] memory collateralTypes);
}

interface ISAFEEngine {
    struct SafeDeposit {
        uint256 lockedCollateral;
        uint256 generatedDebt;
    }

    function safes(bytes32 collateralType, address safe) external view returns (SafeDeposit memory _safe);
}

contract VirtualUserSafes {
    struct SafeData {
        address addy;
        uint256 id;
        uint256 lockedCollateral;
        uint256 generatedDebt;
        bytes32 collateralType;
    }

    constructor(
        IERC20 coin,
        IProxyRegistry proxyRegistry,
        ISAFEEngine safeEngine,
        ISafeManager safeManager,
        address user
    ) {
        uint256 coinBalance = coin.balanceOf(user);
        address userProxy = proxyRegistry.proxies(user);

        SafeData[] memory safesData;

        if (userProxy == address(0)) {
            safesData = new SafeData[](0);
        } else {
            (uint256[] memory ids, address[] memory safes, bytes32[] memory _cTypes) =
                safeManager.getSafesData(userProxy);

            safesData = new SafeData[](safes.length);
            for (uint256 i = 0; i < safes.length; i++) {
                ISAFEEngine.SafeDeposit memory _safeData = safeEngine.safes(_cTypes[i], safes[i]);
                safesData[i] = SafeData(safes[i], ids[i], _safeData.lockedCollateral, _safeData.generatedDebt, _cTypes[i]);
            }
        }

        // encode return data
        bytes memory data = abi.encode(coinBalance, safesData);

        // force constructor return via assembly
        assembly {
            let dataStart := add(data, 32) // abi.encode adds an additional offset
            return(dataStart, sub(msize(), dataStart))
        }
    }
}