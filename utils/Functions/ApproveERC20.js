import { ethers } from "ethers"
import { ERC20Abi } from "../../constants"

async function approveERC20(
    erc20Address,
    spenderAddress,
    amountToSpend,
    signer
) {
    const erc20Token = new ethers.Contract(erc20Address, ERC20Abi, signer)

    const tx = await erc20Token.approve(spenderAddress, amountToSpend)
    await tx.wait(1)
}

export { approveERC20 }
