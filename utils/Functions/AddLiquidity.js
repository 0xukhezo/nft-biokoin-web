import { ethers } from "ethers"
import { approveERC20 } from "./ApproveERC20"
import { uniswapV2Router02 } from "../../constants/uniswapV2Router02.json"

async function addLiquidity(
    liquidityAmountToken0,
    liquidityAmountToken1,
    addressToken0,
    addressToken1,
    deployer,
    signer,
    chainId
) {
    const liquidityContract = new ethers.Contract(
        networkConfig[chainId].routerLiquidityAddress,
        uniswapV2Router02,
        signer
    )

    await approveERC20(
        addressToken0,
        networkConfig[chainId].routerLiquidityAddress,
        liquidityAmountToken0,
        signer
    )

    await approveERC20(
        addressToken1,
        networkConfig[chainId].routerLiquidityAddress,
        liquidityAmountToken1,
        signer
    )

    let response

    await liquidityContract
        .addLiquidity(
            addressToken0,
            addressToken1,
            liquidityAmountToken0.toString(),
            liquidityAmountToken1.toString(),
            1,
            1,
            deployer,
            Math.floor(Date.now() / 1000) + 60 * 10,
            { gasLimit: ethers.utils.hexlify(1000000) }
        )
        .then((tx) => {
            response = tx
        })

    return response
}

export { addLiquidity }
