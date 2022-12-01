import React, { useState, useEffect } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import Navbar from "../components/NavBar/Navbar"
import { ethers } from "ethers"
import {
    loanAbi,
    bioKoinAbi,
    loanAddresses,
    bioKoinAddresses,
} from "../constants"
import NFTCard from "../components/NFTCard/NFTCard"
import EpochBar from "../components/Bars/EpochBar/EpochBar"

function Borrow() {
    const [inicialEpochDate, setInicialEpochDate] = useState(undefined)
    const [finalEpochDate, setFinalEpochDate] = useState(undefined)
    const [balanceERC721, setBalanceERC721] = useState("0")
    const [positions, setPositions] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [ERC721OfOwner, setERC721OfOwner] = useState([])

    const currentEpochDate = Date.now()

    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis()

    const chainId = parseInt(chainIdHex)

    const loanAddress =
        chainId in loanAddresses ? loanAddresses[chainId][0] : null

    const bioKoinAddress =
        chainId in bioKoinAddresses ? bioKoinAddresses[chainId][0] : null

    const { runContractFunction: getFinalEpochDate } = useWeb3Contract({
        abi: loanAbi,
        contractAddress: loanAddress,
        functionName: "getFinalEpochDate",
        params: {},
    })

    const { runContractFunction: getInicialEpochDate } = useWeb3Contract({
        abi: loanAbi,
        contractAddress: loanAddress,
        functionName: "getInicialEpochDate",
        params: {},
    })

    const { runContractFunction: balanceOf } = useWeb3Contract({
        abi: bioKoinAbi,
        contractAddress: bioKoinAddress,
        functionName: "balanceOf",
        params: { owner: account },
    })

    const { runContractFunction: tokensOfOwner } = useWeb3Contract({
        abi: bioKoinAbi,
        contractAddress: bioKoinAddress,
        functionName: "tokensOfOwner",
        params: { _owner: account },
    })

    const { runContractFunction: getLoansOfOwner } = useWeb3Contract({
        abi: loanAbi,
        contractAddress: loanAddress,
        functionName: "getLoansOfOwner",
        params: { _owner: account },
    })

    async function updateUI() {
        const inicialEpoch = await getInicialEpochDate()
        const finalEpoch = await getFinalEpochDate()
        const balanceOfERC721 = await balanceOf()
        const ERC721OfOwner = await tokensOfOwner()
        let loansOfOwner = await getLoansOfOwner()

        if (
            inicialEpoch &&
            finalEpoch &&
            balanceOfERC721 &&
            ERC721OfOwner &&
            loansOfOwner
        ) {
            loansOfOwner = loansOfOwner
                .slice()
                .filter((loan) => loan.loanType.toString() === "1")
            setInicialEpochDate(inicialEpoch.toString())
            setFinalEpochDate(finalEpoch.toString())
            setBalanceERC721(balanceOfERC721.toString())
            setERC721OfOwner(ERC721OfOwner)
            setPositions(loansOfOwner)
            setLoading(false)
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
            {isLoading === false ? (
                <>
                    <div className="text-center font-semibold text-xl mb-3">
                        Current Epoch
                    </div>
                    <EpochBar
                        inicialEpochDate={inicialEpochDate}
                        currentEpochDate={currentEpochDate}
                        finalEpochDate={finalEpochDate}
                    />
                    {balanceERC721 === "0" && positions.length === 0 ? (
                        <div className="border-2 border-green-500 rounded-lg px-4 py-4 mx-60 mt-20 text-center">
                            You do not have NFTs to leave as collaterals.
                            <div className="mt-4">
                                {" "}
                                Buy one{" "}
                                <span className="text-green-500">here</span>.
                            </div>
                        </div>
                    ) : (
                        <div
                            className="overflow-auto mt-6"
                            id="borrowContainer"
                        >
                            {ERC721OfOwner.map((ERC721, index) => (
                                <NFTCard
                                    key={index}
                                    tokenId={ERC721.toString()}
                                    bioKoinAddress={bioKoinAddress}
                                    loanAddress={loanAddress}
                                    payedAmount={0}
                                    finalEpochDate={finalEpochDate}
                                />
                            ))}
                            <div className="flex justify-center">
                                <h1 className="text-center my-8 text-bold text-green-500 text-2xl border-b-2 border-green-500 px-6 ">
                                    Positions
                                </h1>
                            </div>
                            {positions.length !== 0 ? (
                                <div className="mb-24">
                                    {positions.map((position, index) => (
                                        <NFTCard
                                            key={index}
                                            index={position.index.toString()}
                                            ownerAsset={Number(
                                                ethers.utils.formatEther(
                                                    position.ownerAsset.toString()
                                                )
                                            )}
                                            bioKoinAddress={bioKoinAddress}
                                            loanAddress={loanAddress}
                                            tokenId={position.collateredAsset.toString()}
                                            payAmount={Number(
                                                ethers.utils.formatEther(
                                                    position.payAmount.toString()
                                                )
                                            )}
                                            payedAmount={Number(
                                                ethers.utils.formatEther(
                                                    position.payedAmount.toString()
                                                )
                                            )}
                                            payOffAmount={Number(
                                                ethers.utils.formatEther(
                                                    position.payOffAmount.toString()
                                                )
                                            )}
                                            payOffTimestamp={position.payOffTimestamp.toString()}
                                        />
                                    ))}{" "}
                                </div>
                            ) : (
                                <div className="text-center mx-36 mb-24 border-2 border-green-500 p-10 rounded-lg py-16">
                                    You do not have open positions. <br /> Add
                                    some NFT as collateral to generate one.
                                </div>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <>Loading</>
            )}
        </>
    )
}

export default Borrow
