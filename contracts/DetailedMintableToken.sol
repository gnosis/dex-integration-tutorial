pragma solidity >=0.5.0 <0.7.0;

// NOTE:
//  This file's purpose is to have an ERC20Detailed contract, which is not
//  just an interface, but an actual contract and can be deployed.
//  The contract is needed for the test test/stablex/send_liquidity_orders
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";

contract DetailedMintableToken is ERC20Mintable, ERC20Detailed {
    constructor(string memory symbol, uint8 decimals)
        public
        ERC20Detailed(symbol, symbol, decimals)
    {}
}
