// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IERC20 {
    function balanceOf(address guy) external view returns (uint256);
    function decimals() external view returns (uint256);
}

contract TokensData {
    struct TokenData {
        uint256 balanceE18;
        uint256 decimals;
    }

    constructor(address user, IERC20[] memory tokens) {
        TokenData[] memory tokensData = new TokenData[](tokens.length);
        for (uint256 i; i < tokens.length; ++i) {
            uint256 _balance = tokens[i].balanceOf(user);
            uint256 _decimals = tokens[i].decimals();
            uint256 _balanceE18 = _balance * (10 ** 18) / (10 ** _decimals);
            tokensData[i] = TokenData(_balanceE18, _decimals);
        }

        // encode return data
        bytes memory data = abi.encode(tokensData);

        // force constructor return via assembly
        assembly {
            let dataStart := add(data, 32) // abi.encode adds an additional offset
            return(dataStart, sub(msize(), dataStart))
        }
    }
}
