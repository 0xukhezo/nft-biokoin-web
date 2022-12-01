import React, { useState, useEffect } from "react"
import { ethers } from "ethers"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { bioKoinAbi, bioKoinAddresses } from "../constants"
import { networkConfig } from "../constants/networkConfig"
import swapTokens from "../utils/Functions/SwapTokens"

import Navbar from "../components/NavBar/Navbar"

function Mint() {
    const [signer, setSigner] = useState()

    const {
        chainId: chainIdHex,
        enableWeb3,
        account,
        isWeb3Enabled,
    } = useMoralis()

    const chainId = parseInt(chainIdHex)

    const bioKoinAddress =
        chainId in bioKoinAddresses ? bioKoinAddresses[chainId][0] : null

    const { runContractFunction: mintNFTs } = useWeb3Contract({
        abi: bioKoinAbi,
        contractAddress: bioKoinAddress,
        functionName: "mintNFTs",
        msgValue: ethers.utils.parseEther("0.002"),
        params: { _count: 2 },
    })

    const swap = async () => {
        if (typeof window.ethereum !== "undefined") {
            try {
                const txResponse = await swapTokens(
                    ethers.utils.parseEther("1000"),
                    chainId,
                    networkConfig[chainId].wethToken.address,
                    networkConfig[chainId].usdcToken.address,
                    signer,
                    account
                )
            } catch (error) {
                console.log(error)
            }
        }
    }
    const getSignerByProvider = async () => {
        const web3Provider = await enableWeb3()
        if (web3Provider) {
            const signer = web3Provider.getSigner()
            setSigner(signer)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            getSignerByProvider()
        }
    }, [isWeb3Enabled])

    return (
        <>
            <Navbar />
            <button
                onClick={async () =>
                    await mintNFTs({
                        onSuccess: () => console.log("Done"),
                        onError: (error) => console.log(error),
                    })
                }
                className=" py-2 px-3 rounded-lg border-2 border-green-500"
            >
                Mint 2 NFTs
            </button>
            <button
                onClick={async () =>
                    await swap({
                        onSuccess: () => console.log("Done"),
                        onError: (error) => console.log(error),
                    })
                }
                className=" py-2 px-3 rounded-lg border-2 border-green-500"
            >
                Swap
            </button>
        </>
    )
}

export default Mint
