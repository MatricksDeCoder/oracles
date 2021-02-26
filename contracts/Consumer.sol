// SPDX-License-Identifier: MIT

pragma solidity ^0.7.3;

import './IOracle.sol';

contract Consumer {

    IOracle public oracle;

    constructor(address _oracle) {
        oracle = IOracle(_oracle);
    }


    /// @notice  use data from Oracle
    function usesOraclData() external {
        bytes32 _key = keccak256(abi.encodePacked('BTC/USD'));
        (bool result, uint date, uint payload) = oracle.getData(_key);
        require(result == true, 'could not get data');
        require(date >= block.timestamp, 'data too old');
        // can do something with the price
    }


}
