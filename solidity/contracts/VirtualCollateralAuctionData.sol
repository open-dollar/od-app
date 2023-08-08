// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IncreasingDiscountCollateralAuctionHouse {
    function getCollateralBought(uint256 _id, uint256 _wad)
        external
        returns (uint256 _boughtCollateral, uint256 _adjustedBid);
}

contract VirtualCollateralAuctionsData {
    struct CollateralAuctionsData {
        uint256 _auctionId;
        uint256 _boughtCollateral;
        uint256 _adjustedBid;
    }

    constructor(IncreasingDiscountCollateralAuctionHouse _collateralAuctionHouse, uint256[] memory _auctionIds) {
        CollateralAuctionsData[] memory collateralAuctionsData = new CollateralAuctionsData[](_auctionIds.length);
        for (uint256 i = 0; i < _auctionIds.length; i++) {
            (uint256 _boughtCollateral, uint256 _adjustedBid) =
                _collateralAuctionHouse.getCollateralBought(_auctionIds[i], type(uint256).max / 1e27);
            collateralAuctionsData[i] = CollateralAuctionsData({
                _auctionId: _auctionIds[i],
                _boughtCollateral: _boughtCollateral,
                _adjustedBid: _adjustedBid
            });
        }

        // encode return data
        bytes memory data = abi.encode(collateralAuctionsData);

        // force constructor return via assembly
        assembly {
            let dataStart := add(data, 32) // abi.encode adds an additional offset
            return(dataStart, sub(msize(), dataStart))
        }
    }
}
