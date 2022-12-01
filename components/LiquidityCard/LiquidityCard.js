import React from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import { DateConverter } from "../../utils/Helpers/DateConverter"
import { loanAbi, loanAddresses } from "../../constants"

function LiquidityCard({ ownerAsset, payOffTimestamp, index }) {
    const { chainId: chainIdHex } = useMoralis()

    const chainId = parseInt(chainIdHex)

    const loanAddress =
        chainId in loanAddresses ? loanAddresses[chainId][0] : null

    let ownerAssetETH = ethers.utils.formatEther(ownerAsset).toString()
    const currentEpochDate = Date.now() / 1000

    const { runContractFunction: withdrawETHLended } = useWeb3Contract({
        abi: loanAbi,
        contractAddress: loanAddress,
        functionName: "withdrawETHLended",
        params: { _index: index },
    })

    return (
        <div className="border-2 border-green-500 rounded-lg px-6 py-2 mt-2 bg-gray-50">
            <div className="flex items-center justify-between">
                <div>
                    Liquidity: <span>{Number(ownerAssetETH)} ETH</span>
                </div>
                <div className="ml-4">
                    Finish:{" "}
                    <span>{DateConverter(payOffTimestamp * 1000, true)}</span>
                </div>
                {Number(payOffTimestamp) > currentEpochDate ? (
                    <button
                        disabled
                        className="bg-green-200 py-2 px-3 rounded-lg w-48 text-gray-700"
                    >
                        Claim ETH
                    </button>
                ) : (
                    <button
                        onClick={async () =>
                            await withdrawETHLended({
                                onSuccess: () => console.log("Done"),
                                onError: (error) => console.log(error),
                            })
                        }
                        className="bg-green-600 py-2 px-2 rounded-lg w-48 text-white "
                    >
                        Claim ETH
                    </button>
                )}
            </div>
        </div>
    )
}

export default LiquidityCard
