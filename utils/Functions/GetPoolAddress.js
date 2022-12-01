import { ethers } from "ethers"
import { networkConfig } from "../../constants"
const {
    abi: UniswapV3Factory,
} = require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json")

async function getPoolAddress(address0, address1, signer, chainId) {
    const factoryContract = new ethers.Contract(
        networkConfig.networkConfig[chainId].factoryAddress,
        UniswapV3Factory,
        signer
    )

    const poolAddress = await factoryContract.getPool(address0, address1, 3000)

    return poolAddress
}

export default getPoolAddress
