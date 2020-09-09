pragma solidity >=0.5.0 <0.7.0;

import "./interfaces/ILiquidityValueCalculator.sol";
import "@uniswap/v2-periphery/contracts/libraries/UniswapV2Library.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";

contract LiquidityValueCalculator is ILiquidityValueCalculator {
    address public factory;

    constructor(address factory_) public {
        factory = factory_;
    }

    function pairInfo(address tokenA, address tokenB)
        internal
        view
        returns (
            uint256 reserveA,
            uint256 reserveB,
            uint256 totalSupply
        )
    {
        IUniswapV2Pair pair = IUniswapV2Pair(
            UniswapV2Library.pairFor(factory, tokenA, tokenB)
        );
        totalSupply = pair.totalSupply();
        (uint256 reserve0, uint256 reserve1, ) = pair.getReserves();
        (reserveA, reserveB) = tokenA == pair.token0()
            ? (reserve0, reserve1)
            : (reserve1, reserve0);
        return (reserve0, reserve1, totalSupply);
    }

    function computeLiquidityShareValue(
        uint256 liquidity,
        address tokenA,
        address tokenB
    ) public returns (uint256 tokenAAmount, uint256 tokenBAmount) {
        (uint256 resA, uint256 resB, uint256 supply) = pairInfo(tokenA, tokenB);
        return (resA / supply, resB / supply);
    }
}
