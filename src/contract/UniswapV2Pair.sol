// contracts/UniswapV2Pair.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract UniswapV2Pair {
    IERC20 public token0;
    IERC20 public token1;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;

    constructor(address _token0, address _token1) {
        token0 = IERC20(_token0);
        token1 = IERC20(_token1);
    }

    // 简化的交换功能
    function swap(uint256 amount0In, uint256 amount1In) external {
        require(amount0In > 0 || amount1In > 0, "UniswapV2Pair: INSUFFICIENT_INPUT_AMOUNT");

        // 假设 1:1 的交换比例
        if (amount0In > 0) {
            token0.transferFrom(msg.sender, address(this), amount0In);
        }

        if (amount1In > 0) {
            token1.transferFrom(msg.sender, address(this), amount1In);
        }

        // 返回交换后的代币
        if (amount0In > 0) {
            token1.transfer(msg.sender, amount0In);
        }

        if (amount1In > 0) {
            token0.transfer(msg.sender, amount1In);
        }
    }

    // 添加流动性 (简化版)
    function addLiquidity(uint256 amount0, uint256 amount1) external returns (uint256 liquidity) {
        require(amount0 > 0 && amount1 > 0, "UniswapV2Pair: INSUFFICIENT_LIQUIDITY_AMOUNT");

        token0.transferFrom(msg.sender, address(this), amount0);
        token1.transferFrom(msg.sender, address(this), amount1);

        balanceOf[msg.sender] += amount0 + amount1; // 用户的流动性份额
        totalSupply += amount0 + amount1; // 总流动性
        return amount0 + amount1;
    }
}