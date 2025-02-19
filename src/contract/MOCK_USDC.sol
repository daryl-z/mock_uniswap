// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MOCK_USDC is ERC20 {
    constructor(uint256 initialSupply) ERC20("Mock USDC", "MOCK_USDC") {
        _mint(msg.sender, initialSupply);
    }
}