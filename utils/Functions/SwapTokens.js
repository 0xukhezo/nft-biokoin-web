import { ethers } from "ethers"
import { approveERC20 } from "./ApproveERC20"
import getPoolImmutables from "../Helpers/GetPoolImmutables"
import getPoolAddress from "./GetPoolAddress"
import { ERC20Abi, networkConfig } from "../../constants"

const {
    abi: IUniswapV3PoolABI,
} = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json")
const {
    abi: SwapRouterABI,
} = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json")

async function swapTokens(
    inputAmount,
    chainId,
    addressToken0,
    addressToken1,
    signer,
    deployer
) {
    const liquidityPool = await getPoolAddress(
        addressToken0,
        addressToken1,
        signer,
        chainId
    )
    console.log(liquidityPool)
    const poolContract = new ethers.Contract(
        liquidityPool,
        IUniswapV3PoolABI,
        signer
    )

    const immutables = await getPoolImmutables(poolContract)

    const swapRouterContract = new ethers.Contract(
        networkConfig.networkConfig[chainId].swapRouterAddress,
        SwapRouterABI,
        signer
    )

    let approvalAmount = (inputAmount / 2).toString()

    if (
        addressToken0 === networkConfig.networkConfig[chainId].wethToken.address
    ) {
        approvalAmount = inputAmount.toString()
    }

    const params = {
        tokenIn: immutables.token1,
        tokenOut: immutables.token0,
        fee: immutables.fee,
        recipient: deployer,
        deadline: Math.floor(Date.now() / 1000) + 60 * 10,
        amountIn: approvalAmount,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0,
    }

    await approveERC20(
        addressToken0,
        networkConfig.networkConfig[chainId].swapRouterAddress,
        approvalAmount,
        signer
    )

    await approveERC20(
        addressToken1,
        networkConfig.networkConfig[chainId].swapRouterAddress,
        approvalAmount,
        signer
    )

    let response

    await swapRouterContract
        .exactInputSingle(params, {
            gasLimit: ethers.utils.hexlify(1000000),
        })
        .then((tx) => {
            response = tx
        })

    const token0Contract = new ethers.Contract(addressToken0, ERC20Abi, signer)
    const token1Contract = new ethers.Contract(addressToken1, ERC20Abi, signer)
    const token0Balance = await token0Contract.balanceOf(deployer)
    const token1Balance = await token1Contract.balanceOf(deployer)

    console.log(
        "WETH balance...",
        ethers.utils.formatUnits(token0Balance.toString(), 18)
    )
    console.log(
        "USDC balance...",
        ethers.utils.formatUnits(token1Balance.toString(), 6)
    )

    return response
}

export default swapTokens
