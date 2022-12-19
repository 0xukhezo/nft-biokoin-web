import React, { useState, useEffect } from "react"
import { ethers } from "ethers"
import { useMoralis, useWeb3Contract } from "react-moralis"
import {
    loanAbi,
    bioKoinAbi,
    loanAddresses,
    bioKoinAddresses,
} from "../constants"

import Navbar from "../components/NavBar/Navbar"

function Mint() {
    const {
        chainId: chainIdHex,
        enableWeb3,
        account,
        isWeb3Enabled,
    } = useMoralis()

    const chainId = parseInt(chainIdHex)

    const bioKoinAddress =
        chainId in bioKoinAddresses ? bioKoinAddresses[chainId][0] : null

    const loanAddress =
        chainId in loanAddresses ? loanAddresses[chainId][0] : null

    const { runContractFunction: mintNFTs } = useWeb3Contract({
        abi: bioKoinAbi,
        contractAddress: bioKoinAddress,
        functionName: "mintNFTs",
        msgValue: ethers.utils.parseEther("0.002"),
        params: { _count: 2 },
    })

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
        </>
    )
}

export default Mint
