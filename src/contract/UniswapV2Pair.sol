// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UniswapV2Pair {
    address public token0;
    address public token1;

    constructor(address _token0, address _token1) {
        token0 = _token0;
        token1 = _token1;
    }

    function swap(uint amount0Out, uint amount1Out, address to) public {
        // 模拟交易功能
    }

    function addLiquidity(uint amount0, uint amount1) public returns (uint liquidity) {
        // 模拟添加流动性功能
        return 0;
    }
}