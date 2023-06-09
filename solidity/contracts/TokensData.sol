// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IERC20 {
    function balanceOf(address guy) external view returns (uint256);
}

contract TokensData {
    struct TokenData {
        uint256 balance;
    }

    constructor(address user, IERC20[] memory tokens) {
        TokenData[] memory tokensData = new TokenData[](tokens.length);
        for (uint256 i; i < tokens.length; ++i) {
            tokensData[i] = TokenData(tokens[i].balanceOf(user));
        }

        // // encode return data
        bytes memory data = abi.encode(tokensData);

        // force constructor return via assembly
        assembly {
            let dataStart := add(data, 32) // abi.encode adds an additional offset
            return(dataStart, sub(msize(), dataStart))
        }
    }
}
