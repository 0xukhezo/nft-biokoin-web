import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { loanAbi, bioKoinAbi } from "../../constants"
import { ethers } from "ethers"
import { DateConverter } from "../../utils/Helpers/DateConverter"
import Image from "next/image"
import ModalERC721 from "../Modals/ModalERC721/ModalERC721"
import LeverageBar from "../Bars/LeverageBar/LeverageBar"

export default function NFTCard({
    index,
    ownerAsset,
    payAmount,
    payOffTimestamp,
    bioKoinAddress,
    loanAddress,
    tokenId,
    finalEpochDate,
    payedAmount,
    payOffAmount,
}) {
    const { isWeb3Enabled } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const [openModal, setPanelModal] = useState(false)
    const [payOffAmountBorrowERC721, setPayOffAmountBorrowERC721] = useState(0)
    const [loanBalanceETH, setLoanBalanceETH] = useState(0)
    const [loanBalanceERC721, setLoanBalanceERC721] = useState(0)

    const getPanelModal = (closedPayModal) => {
        setPanelModal(closedPayModal)
    }

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: bioKoinAbi,
        contractAddress: bioKoinAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })

    const { runContractFunction: balanceOf } = useWeb3Contract({
        abi: loanAbi,
        contractAddress: loanAddress,
        functionName: "balanceOf",
        params: { _token: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB" },
    })

    const { runContractFunction: balanceOfERC721 } = useWeb3Contract({
        abi: bioKoinAbi,
        contractAddress: bioKoinAddress,
        functionName: "balanceOf",
        params: { owner: loanAddress },
    })

    async function updateUI() {
        const tokenURI = await getTokenURI()
        const loanETHBalance = await balanceOf()
        let loanERC721Balance = await balanceOfERC721()

        if (loanERC721Balance.toString() === "0") {
            loanERC721Balance = 1
        }
        if (tokenURI && loanETHBalance && loanERC721Balance) {
            const requestURL = tokenURI.replace(
                "ipfs://",
                "https://ipfs.io/ipfs/"
            )
            const tokenURIResponse = await (await fetch(requestURL)).json()
            const imageURI = tokenURIResponse.image
            const imageURIURL = imageURI.replace(
                "ipfs://",
                "https://ipfs.io/ipfs/"
            )
            setImageURI(imageURIURL)

            setLoanBalanceETH(
                Number(ethers.utils.formatEther(loanETHBalance.toString()))
            )
            setLoanBalanceERC721(Number(loanERC721Balance.toString()))
            setPayOffAmountBorrowERC721(
                Number(ethers.utils.formatEther(loanETHBalance.toString())) /
                    Number(loanERC721Balance.toString())
            )
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    return (
        <>
            {imageURI ? (
                <>
                    {!payAmount ? (
                        <div className="border-2 border-green-500 rounded-lg px-6 py-2 mb-2 mx-40 mt-6 bg-gray-50">
                            <div className="grid grid-rows-2">
                                <div className="grid grid-cols-7 items-center grid-gap-2 mt-4">
                                    <Image
                                        loader={() => imageURI}
                                        src={imageURI}
                                        height="100"
                                        width="100"
                                        className="rounded-lg"
                                    />
                                    <div className="ml-4">
                                        Token ID: {tokenId}
                                    </div>
                                    <div className="col-start-3 col-end-8">
                                        This is a test NFT for prototyping.This
                                        is a test NFT for prototyping.This is a
                                        test NFT for prototyping.This is a test
                                        NFT for prototyping.This is a test NFT
                                        for prototyping.
                                    </div>
                                </div>
                                <div className="grid grid-cols-7 mt-4 items-center">
                                    <div className="col-start-1 col-end-6">
                                        <LeverageBar
                                            inicialLeverage={0}
                                            currentLeverage={0}
                                            finalLeverage={
                                                payOffAmountBorrowERC721
                                            }
                                        />
                                    </div>
                                    <button
                                        onClick={() => setPanelModal(true)}
                                        className="col-start-6 ml-10 py-2 px-3 rounded-lg w-48 border-2 border-green-600 bg-green-600 my-4 text-white text-semibold hover:bg-green-500 hover:border-green-500 my-4"
                                    >
                                        Borrow
                                    </button>
                                </div>
                                {openModal && (
                                    <ModalERC721
                                        borrowMode={true}
                                        index={index}
                                        getPanelModal={getPanelModal}
                                        tokenId={tokenId}
                                        finalEpochDate={finalEpochDate}
                                        payOffAmountBorrowERC721={
                                            payOffAmountBorrowERC721
                                        }
                                        payOffAmount={payOffAmount}
                                        payedAmount={payedAmount}
                                        loanBalanceETH={loanBalanceETH}
                                        loanBalanceERC721={loanBalanceERC721}
                                    />
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="border-2 border-green-500 rounded-lg px-6 py-2 mb-2 mx-40 mt-6 bg-gray-50">
                            <div className="grid grid-rows-2">
                                <div className="grid grid-cols-7 items-center grid-gap-3 mt-4">
                                    <Image
                                        loader={() => imageURI}
                                        src={imageURI}
                                        height="100"
                                        width="100"
                                        className="rounded-lg"
                                    />
                                    <div className="ml-4">
                                        Token ID: {tokenId}
                                    </div>
                                    <div className="col-span-2">
                                        Borrow: {Number(ownerAsset)} USDC
                                    </div>
                                    <div className="col-span-2">
                                        In debt: {Number(payAmount)} USDC
                                    </div>
                                    <div>
                                        Liquidation Date:{" "}
                                        {DateConverter(
                                            payOffTimestamp * 1000,
                                            true
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-7 mt-4 items-center">
                                    <div className="col-start-1 col-end-6">
                                        <LeverageBar
                                            inicialLeverage={0}
                                            currentLeverage={
                                                ownerAsset - payedAmount
                                            }
                                            finalLeverage={payOffAmount}
                                        />
                                    </div>
                                    <button
                                        onClick={() => setPanelModal(true)}
                                        className="col-start-6 ml-10 py-2 px-3 rounded-lg w-48 border-2 border-green-600 bg-green-600 my-4 text-white text-semibold hover:bg-green-500 hover:border-green-500 my-4"
                                    >
                                        Pay / Borrow
                                    </button>
                                </div>
                                {openModal && (
                                    <ModalERC721
                                        borrowMode={false}
                                        index={index}
                                        getPanelModal={getPanelModal}
                                        tokenId={tokenId}
                                        ownerAsset={ownerAsset}
                                        finalEpochDate={finalEpochDate}
                                        payOffAmountBorrowERC721={
                                            payOffAmountBorrowERC721
                                        }
                                        payOffAmount={payOffAmount}
                                        loanBalanceETH={loanBalanceETH}
                                        payedAmount={payedAmount}
                                        loanBalanceERC721={loanBalanceERC721}
                                        payAmount={payAmount}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div>Loading...</div>
            )}
        </>
    )
}
