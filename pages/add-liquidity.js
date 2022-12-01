import React, { useState, useEffect } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import Navbar from "../components/NavBar/Navbar"
import { loanAbi, loanAddresses } from "../constants"
import LiquidityCard from "../components/LiquidityCard/LiquidityCard"

const asset = {
    symbol: "ETH",
    image: "https://imgs.search.brave.com/ViNj_1mofY7uPUeZRBaPe0Zoo6MRwndpdS1xlSbS_k8/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly93d3cu/Y3JpcHRvbW9uZWRh/cy5jby93cC1jb250/ZW50L3VwbG9hZHMv/MjAyMS8wMS9ldGhl/cmV1bS1ldGgtbG9n/by5wbmc",
    id: "1",
    value: 1600,
}

function Lend() {
    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis()

    const [assetsToCollatered, setAssetsToCollatered] = useState(0)
    const [loanBalance, setLoanBalance] = useState(0)
    const [positions, setPositions] = useState([])

    const chainId = parseInt(chainIdHex)

    const loanAddress =
        chainId in loanAddresses ? loanAddresses[chainId][0] : null

    const { runContractFunction: lendETH } = useWeb3Contract({
        abi: loanAbi,
        contractAddress: loanAddress,
        functionName: "lendETH",
        msgValue: ethers.utils.parseEther(assetsToCollatered.toString()),
        params: {},
    })

    const { runContractFunction: balanceOf } = useWeb3Contract({
        abi: loanAbi,
        contractAddress: loanAddress,
        functionName: "balanceOf",
        params: {},
    })

    const { runContractFunction: getLoansOfOwner } = useWeb3Contract({
        abi: loanAbi,
        contractAddress: loanAddress,
        functionName: "getLoansOfOwner",
        params: { _owner: account },
    })

    let handleInputChange = (e) => {
        if (e.currentTarget.value === "") {
            e.currentTarget.value = 0
        }
        setAssetsToCollatered(e.currentTarget.value)
    }

    async function updateUI() {
        const balance = await balanceOf()
        let loansOfOwner = await getLoansOfOwner()

        if (balance && loansOfOwner) {
            loansOfOwner = loansOfOwner
                .slice()
                .filter((loan) => loan.loanType.toString() === "0")
            setLoanBalance(ethers.utils.formatEther(balance.toString()))
            setPositions(loansOfOwner)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled, positions])

    return (
        <>
            <Navbar />
            <div className="relative p-6 flex align-center">
                <div className="px-4 pb-4 pt-2 w-2/3 mr-6">
                    <div className="w-2/3">
                        <div className="font-medium text-xl my-4">
                            <h1>Add liquidity</h1>
                        </div>
                        <div className="border-2 border-green-500 rounded-lg flex h-16">
                            <button className="bg-slate-50 py-2 px-3 rounded-lg w-48">
                                <div className="flex justify-between">
                                    <img
                                        src={asset.image}
                                        className="rounded-full h-10 w-10"
                                    />
                                    <span className="mx-auto my-auto pr-1">
                                        {asset.symbol}
                                    </span>
                                </div>
                            </button>
                            <input
                                type="number"
                                bl
                                className="focus:outline-none text-center p-4"
                                step="any"
                                value={assetsToCollatered}
                                min="0.0000001"
                                onChange={handleInputChange}
                                placeholder="0.0"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="font-medium text-xl my-4">
                            Your open positions
                        </div>
                        {positions.length !== 0 ? (
                            <div
                                className="overflow-auto pr-8"
                                id="lendContainer"
                            >
                                {positions.map((position, index) => (
                                    <LiquidityCard
                                        key={index}
                                        index={position.index.toString()}
                                        ownerAsset={position.ownerAsset.toString()}
                                        payOffTimestamp={position.payOffTimestamp.toString()}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center mt-8 border-2 border-green-500 p-10 rounded-lg py-16">
                                You do not have open positions. <br /> Add ETH
                                to the liquidity to generate one.
                            </div>
                        )}
                    </div>
                </div>

                {assetsToCollatered !== 0 ? (
                    <div className="border-2 border-green-500 rounded-lg px-8 py-20 h-96 w-1/2">
                        <div className="grid grid-rows-2 grid-cols-2 text-center p-4 mb-14">
                            <div className="border-b-2 border-r-2 border-green-500 pb-3">
                                Add to liquidity
                                <div>{assetsToCollatered} ETH</div>
                            </div>
                            <div className="border-b-2 border-green-500 pb-3">
                                Collateral value
                                <div>
                                    $ {Number(assetsToCollatered) * asset.value}
                                </div>
                            </div>
                            <div className="pt-3 border-r-2 border-green-500">
                                Total in contract
                                <div>{loanBalance} ETH</div>
                            </div>
                            <div className="pt-3">
                                Total value
                                <div>$ {asset.value * loanBalance}</div>
                            </div>
                        </div>
                        <button
                            onClick={async () => {
                                await lendETH({
                                    onSuccess: () => setAssetsToCollatered(0),
                                    onError: (error) => console.log(error),
                                })
                            }}
                            className="flex mx-auto py-2 px-3 rounded-lg w-48 border-2 border-green-600 bg-green-600 my-4 text-white text-semibold hover:bg-green-500 hover:border-green-500"
                        >
                            <span className="mx-auto">Add liquidity</span>
                        </button>
                    </div>
                ) : (
                    <div className="border-2 border-green-500 rounded-lg px-8 py-4 h-96 grid grid-rows-2 text-center bg-gray-50">
                        <h1 className="text-xl font-bold text-green-500 flex-end flex items-end mb-6">
                            Earn passive income with crypto.
                        </h1>
                        <p>
                            {" "}
                            Leverage up your selected asset using <br />
                            our built in function.
                        </p>
                    </div>
                )}
            </div>
        </>
    )
}

export default Lend