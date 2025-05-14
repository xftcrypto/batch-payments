// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title XFT Labs Batch Transfer
 * @author Alexander Reed
 */

interface IUSDX {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract BatchTransfer {
    IUSDX public immutable USDX;

    event Batch(address indexed sender, address[] recipients, uint256 amount);

    constructor(address _usdx) {
        USDX = IUSDX(_usdx);
    }

    function batchTransfer(address[] calldata recipients, uint256 amount) external {
        uint256 totalAmount = recipients.length * amount;
        require(USDX.allowance(msg.sender, address(this)) >= totalAmount, "Insufficient allowance");

        for (uint256 i = 0; i < recipients.length; i++) {
            USDX.transferFrom(msg.sender, recipients[i], amount);
        }

        emit Batch(msg.sender, recipients, amount);
    }
}