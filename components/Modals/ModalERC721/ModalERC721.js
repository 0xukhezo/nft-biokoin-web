import { Fragment, useRef, useState, useEffect } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { Dialog, Transition } from "@headlessui/react"
import { ethers } from "ethers"
import {
    loanAbi,
    bioKoinAbi,
    loanAddresses,
    bioKoinAddresses,
    ERC20Abi,
    LPAbi,
} from "../../../constants"

import LeverageBar from "../../Bars/LeverageBar/LeverageBar"
import ModalERC20 from "../ModalERC20/ModalERC20"

const asset = {
    symbol: "USDC",
    image: "https://imgs.search.brave.com/JXssxjDhwkYT7rZdMJFrlPG5eQ83wuqwa3PZ5iyzr2o/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9jcnlw/dG9sb2dvcy5jYy9s/b2dvcy91c2QtY29p/bi11c2RjLWxvZ28u/cG5n",
    id: "1",
    value: 1,
    address: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    decimals: 18,
}

export default function ModalERC721({
    borrowMode,
    index,
    getPanelModal,
    ownerAsset,
    tokenId,
    payOffAmountBorrowERC721,
    payAmount,
    payedAmount,
    payOffAmount,
    loanBalanceETH,
    loanBalanceERC721,
}) {
    const cancelButtonRef = useRef(null)
    const [open, setOpen] = useState(true)
    const [LPbalance, setLPBalance] = useState(0)
    const [isApprovedNft, setApprovedNft] = useState(false)
    const [isApprovedToken, setApprovedToken] = useState(false)
    const [payPanelModal, setPayPanelModal] = useState(false)
    const [borrowPanelModal, setBorrowPanelModal] = useState(true)
    const [assetsToBorrow, setAssetsToBorrow] = useState(0)
    const [ETHPayed, setETHPayed] = useState(0)

    let limit = payOffAmount - ownerAsset

    if (limit > loanBalanceETH) {
        limit = loanBalanceETH
    }

    if (payOffAmount === undefined) {
        limit = payOffAmountBorrowERC721
    }

    const { chainId: chainIdHex, account, isWeb3Enabled } = useMoralis()

    const chainId = parseInt(chainIdHex)

    const loanAddress =
        chainId in loanAddresses ? loanAddresses[chainId][0] : null

    const bioKoinAddress =
        chainId in bioKoinAddresses ? bioKoinAddresses[chainId][0] : null

    let handleInputBorrowChange = (e) => {
        if (e.currentTarget.value === "") {
            e.currentTarget.value = 0
        }
        setAssetsToBorrow(e.currentTarget.value)
    }

    let handleInputPayChange = (e) => {
        if (e.currentTarget.value === "") {
            e.currentTarget.value = 0
        }
        setETHPayed(e.currentTarget.value)
    }

    const { runContractFunction: payLoan } = useWeb3Contract({
        abi: loanAbi,
        contractAddress: loanAddress,
        functionName: "pay",
        params: {
            _index: index,
            _token: asset.address,
            _amount: ethers.utils.parseEther(ETHPayed.toString()),
        },
    })

    const { runContractFunction: balanceOfLP } = useWeb3Contract({
        abi: LPAbi,
        contractAddress: "0x32bE40dC4Db907aCf18773bfC81F1bFFA92B77c2",
        functionName: "balanceOf",
        params: {
            "": loanAddress,
        },
    })

    const { runContractFunction: collateredERC721 } = useWeb3Contract({
        abi: loanAbi,
        contractAddress: loanAddress,
        functionName: "collateredERC721",
        params: {
            _tokenA: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
            _tokenB: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
            _amount: ethers.utils.parseEther(assetsToBorrow.toString()),
            _tokenId: tokenId,
        },
    })

    const { runContractFunction: borrowToken } = useWeb3Contract({
        abi: loanAbi,
        contractAddress: loanAddress,
        functionName: "borrow",
        params: {
            _index: index,
            _token: asset.address,
            _amount: ethers.utils.parseEther(assetsToBorrow.toString()),
        },
    })

    const { runContractFunction: approve } = useWeb3Contract({
        abi: bioKoinAbi,
        contractAddress: bioKoinAddress,
        functionName: "approve",
        params: { to: loanAddress, tokenId: tokenId },
    })

    const { runContractFunction: approveToken } = useWeb3Contract({
        abi: ERC20Abi,
        contractAddress: asset.address,
        functionName: "approve",
        params: {
            amount: (ETHPayed * 10 ** asset.decimals).toString(),
            spender: loanAddress,
        },
    })

    async function updateUI() {
        const LPBalance = await balanceOfLP()

        if (LPBalance) {
            setLPBalance(LPBalance)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                initialFocus={cancelButtonRef}
                onClose={() => {
                    setOpen
                    getPanelModal(false)
                }}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>
                {isApprovedNft && <ModalERC20 />}
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all ">
                                <div className="bg-white">
                                    <div className="mt-3 text-center sm:mt-0 sm:text-left grid grid-cols-6 bg-gray-100">
                                        <button
                                            onClick={() => {
                                                setBorrowPanelModal(true)
                                                setPayPanelModal(false)
                                                setETHPayed(0)
                                            }}
                                        >
                                            <Dialog.Title
                                                as="h2"
                                                className={
                                                    !payPanelModal
                                                        ? "text-lg font-medium leading-6 text-gray-900 bg-white text-center px-4 pt-5 pb-4 sm:p-6 sm:pb-4"
                                                        : "text-lg font-medium leading-6 text-gray-900 bg-gray-100 text-center px-4 pt-5 pb-4 sm:p-6 sm:pb-4"
                                                }
                                            >
                                                Stake
                                            </Dialog.Title>
                                        </button>
                                        <button
                                            disabled={borrowMode}
                                            onClick={() => {
                                                setPayPanelModal(true)
                                                setBorrowPanelModal(false)
                                                setAssetsToBorrow(0)
                                            }}
                                        >
                                            <Dialog.Title
                                                as="h2"
                                                className={
                                                    !borrowPanelModal
                                                        ? "text-lg font-medium leading-6 bg-white text-center px-4 pt-5 pb-4 sm:p-6 sm:pb-4"
                                                        : "text-lg font-medium leading-6 bg-gray-100 text-center px-4 pt-5 pb-4 sm:p-6 sm:pb-4"
                                                }
                                            >
                                                <span
                                                    className={
                                                        borrowMode
                                                            ? "text-gray-300"
                                                            : "text-gray-900"
                                                    }
                                                >
                                                    UnStake
                                                </span>
                                            </Dialog.Title>
                                        </button>
                                    </div>
                                    {borrowPanelModal ? (
                                        <div className="grid grid-cols-2 gap-8 sm:items-start justify-center px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                <div className="border-2 border-green-500 rounded-lg flex h-16 mt-6 w-96">
                                                    <div className="bg-slate-50 py-2 px-3 rounded-lg w-48">
                                                        <div className="flex justify-around">
                                                            <img
                                                                src={
                                                                    asset.image
                                                                }
                                                                className="rounded-full h-10 w-10"
                                                            />
                                                            <span className="mx-auto my-auto pr-1">
                                                                {asset.symbol}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        bl
                                                        className="focus:outline-none text-center"
                                                        step="any"
                                                        min="0.0000001"
                                                        value={assetsToBorrow}
                                                        onChange={
                                                            handleInputBorrowChange
                                                        }
                                                        placeholder="0.0"
                                                    />
                                                    <button
                                                        className="pr-4 text-sm"
                                                        onClick={() => {
                                                            setAssetsToBorrow(
                                                                limit
                                                            )
                                                        }}
                                                    >
                                                        <span className="hover:text-green-700 ">
                                                            Max
                                                        </span>
                                                    </button>
                                                </div>
                                                <div className="mt-12">
                                                    <LeverageBar
                                                        inicialLeverage={0}
                                                        currentLeverage={
                                                            !borrowMode
                                                                ? ownerAsset +
                                                                  Number(
                                                                      assetsToBorrow
                                                                  ) -
                                                                  payedAmount
                                                                : Number(
                                                                      assetsToBorrow
                                                                  ).toFixed(3)
                                                        }
                                                        finalLeverage={
                                                            !borrowMode
                                                                ? Number(
                                                                      payOffAmount
                                                                  )
                                                                : Number(
                                                                      payOffAmountBorrowERC721
                                                                  )
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className="border-2 border-green-500 rounded-lg px-8 py-4 row-span-2">
                                                <div className="grid grid-cols-2 grid-rows-5 px-16 py-4">
                                                    <div className="mb-2">
                                                        Collateral Asset Id:
                                                    </div>
                                                    <div className="text-end">
                                                        {tokenId}
                                                    </div>
                                                    <div className="mb-2">
                                                        Total in contract:
                                                    </div>
                                                    <div className="text-end ">
                                                        {loanBalanceETH.toFixed(
                                                            3
                                                        )}{" "}
                                                        USDC
                                                    </div>
                                                    <div className="mb-2">
                                                        Total NFTs in contract:
                                                    </div>
                                                    <div className="text-end ">
                                                        {loanBalanceERC721}
                                                    </div>
                                                    <div className="mb-2">
                                                        Total to borrow:
                                                    </div>
                                                    <div className="text-end ">
                                                        {limit.toFixed(3)} USDC
                                                    </div>
                                                    <div className="mb-2">
                                                        Maximum collateral
                                                        ratio:
                                                    </div>
                                                    <div className="text-end ">
                                                        {!borrowMode
                                                            ? Number(
                                                                  payOffAmount
                                                              ).toFixed(3)
                                                            : Number(
                                                                  payOffAmountBorrowERC721
                                                              ).toFixed(3)}{" "}
                                                        USDC
                                                    </div>
                                                    <div className="mb-2">
                                                        LP Tokens:
                                                    </div>
                                                    <div className="text-end ">
                                                        {!borrowMode ? (
                                                            <div>
                                                                {Number(
                                                                    ethers.utils.formatEther(
                                                                        LPbalance
                                                                    )
                                                                ).toFixed(3)}
                                                            </div>
                                                        ) : (
                                                            <div>-</div>
                                                        )}{" "}
                                                    </div>
                                                </div>
                                                {limit >= assetsToBorrow ? (
                                                    <>
                                                        {borrowMode ? (
                                                            <>
                                                                {!isApprovedNft ? (
                                                                    <button
                                                                        onClick={async () => {
                                                                            await approve(
                                                                                {
                                                                                    onSuccess:
                                                                                        () =>
                                                                                            console.log(
                                                                                                "Done"
                                                                                            ),
                                                                                    onError:
                                                                                        (
                                                                                            error
                                                                                        ) =>
                                                                                            console.log(
                                                                                                error
                                                                                            ),
                                                                                }
                                                                            )
                                                                            setApprovedNft(
                                                                                true
                                                                            )
                                                                        }}
                                                                        className="flex mx-auto py-2 px-3 rounded-lg w-48 border-2 border-green-600 bg-green-600 my-4 text-white text-semibold hover:bg-green-500 hover:border-green-500 my-4"
                                                                    >
                                                                        <span className="mx-auto">
                                                                            Approve
                                                                            NFT
                                                                        </span>
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={async () => {
                                                                            await collateredERC721(
                                                                                {
                                                                                    onSuccess:
                                                                                        () =>
                                                                                            console.log(
                                                                                                "Done"
                                                                                            ),
                                                                                    onError:
                                                                                        (
                                                                                            error
                                                                                        ) =>
                                                                                            console.log(
                                                                                                error
                                                                                            ),
                                                                                }
                                                                            )
                                                                            getPanelModal(
                                                                                false
                                                                            )
                                                                        }}
                                                                        className="flex mx-auto py-2 px-3 rounded-lg w-48 border-2 border-green-600 bg-green-600 my-4 text-white text-semibold hover:bg-green-500 hover:border-green-500 my-4"
                                                                    >
                                                                        <span className="mx-auto">
                                                                            Borrow
                                                                            USDC
                                                                        </span>
                                                                    </button>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <button
                                                                onClick={async () => {
                                                                    await borrowToken(
                                                                        {
                                                                            onSuccess:
                                                                                () =>
                                                                                    console.log(
                                                                                        "Done"
                                                                                    ),
                                                                            onError:
                                                                                (
                                                                                    error
                                                                                ) =>
                                                                                    console.log(
                                                                                        error
                                                                                    ),
                                                                        }
                                                                    )
                                                                    getPanelModal(
                                                                        false
                                                                    )
                                                                }}
                                                                className="flex mx-auto py-2 px-3 rounded-lg w-48 border-2 border-green-600 bg-green-600 my-4 text-white text-semibold hover:bg-green-500 hover:border-green-500 my-4"
                                                            >
                                                                <span className="mx-auto">
                                                                    Borrow USDC
                                                                </span>
                                                            </button>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            className="flex mx-auto bg-green-200 py-2 px-3 rounded-lg w-48 text-gray-700 border-2 border-green-300 my-4"
                                                            disabled
                                                        >
                                                            <span className="mx-auto">
                                                                Borrow USDC
                                                            </span>
                                                        </button>
                                                        <p className="text-red-500 text-sm ">
                                                            <p className="text-center">
                                                                The amount to
                                                                borrow need be
                                                                equal or less
                                                                than
                                                            </p>
                                                            <p className="text-center">
                                                                Maximum
                                                                collateral ratio{" "}
                                                                {!borrowMode
                                                                    ? Number(
                                                                          payOffAmount
                                                                      )
                                                                    : Number(
                                                                          payOffAmountBorrowERC721
                                                                      )}{" "}
                                                                USDC
                                                            </p>
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-8 sm:items-start justify-center px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                                                    <div className="border-2 border-green-500 rounded-lg flex h-16 mt-6 w-96">
                                                        <p className="bg-slate-50 py-2 px-3 rounded-lg w-48">
                                                            <div className="flex justify-between">
                                                                <img
                                                                    src={
                                                                        asset.image
                                                                    }
                                                                    className="rounded-full h-10 w-10"
                                                                />
                                                                <span className="mx-auto my-auto pr-1">
                                                                    {
                                                                        asset.symbol
                                                                    }
                                                                </span>
                                                            </div>
                                                        </p>
                                                        <input
                                                            type="number"
                                                            bl
                                                            className="focus:outline-none text-center"
                                                            step="any"
                                                            min="0.0000001"
                                                            value={ETHPayed}
                                                            onChange={
                                                                handleInputPayChange
                                                            }
                                                            placeholder="0.0"
                                                        />
                                                        <button
                                                            className="pr-4 text-sm"
                                                            onClick={() =>
                                                                setETHPayed(
                                                                    payAmount -
                                                                        payedAmount
                                                                )
                                                            }
                                                        >
                                                            Max
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="mt-8 items-center">
                                                    <LeverageBar
                                                        inicialLeverage={0}
                                                        currentLeverage={
                                                            payAmount -
                                                            payedAmount -
                                                            ETHPayed
                                                        }
                                                        finalLeverage={
                                                            payOffAmount
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className="border-2 border-green-500 rounded-lg px-8 py-4 row-span-3">
                                                <div className="px-16 py-2">
                                                    <div className="flex justify-between mt-2">
                                                        Collateral Asset Id:{" "}
                                                        <span>{tokenId}</span>
                                                    </div>

                                                    <div className="flex justify-between mt-2">
                                                        Inicial debt:{" "}
                                                        <span>
                                                            {payAmount} USDC
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between mt-2">
                                                        Debt payed:{" "}
                                                        <span>
                                                            {payedAmount} USDC
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between mt-2">
                                                        Total debt:{" "}
                                                        <span>
                                                            {payAmount -
                                                                payedAmount}{" "}
                                                            USDC
                                                        </span>
                                                    </div>
                                                </div>

                                                {Number(ETHPayed) <=
                                                Number(payAmount) -
                                                    payedAmount ? (
                                                    !isApprovedToken ? (
                                                        <button
                                                            onClick={async () => {
                                                                await approveToken(
                                                                    {
                                                                        onSuccess:
                                                                            () =>
                                                                                console.log(
                                                                                    "Done"
                                                                                ),
                                                                        onError:
                                                                            (
                                                                                error
                                                                            ) =>
                                                                                console.log(
                                                                                    error
                                                                                ),
                                                                    }
                                                                )
                                                                setApprovedToken(
                                                                    true
                                                                )
                                                            }}
                                                            className="flex mx-auto py-2 px-3 rounded-lg w-48 border-2 border-green-600 bg-green-600 my-4 text-white text-semibold hover:bg-green-500 hover:border-green-500 my-4"
                                                        >
                                                            <span className="mx-auto">
                                                                Approve USDC
                                                            </span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={async () => {
                                                                await payLoan({
                                                                    onSuccess:
                                                                        () =>
                                                                            getPanelModal(
                                                                                false
                                                                            ),
                                                                    onError: (
                                                                        error
                                                                    ) =>
                                                                        console.log(
                                                                            error
                                                                        ),
                                                                })
                                                            }}
                                                            className="flex mx-auto py-2 px-3 rounded-lg w-48 border-2 border-green-600 bg-green-600 my-4 text-white text-semibold hover:bg-green-500 hover:border-green-500 my-4"
                                                        >
                                                            <span className="mx-auto">
                                                                Pay USDC
                                                            </span>
                                                        </button>
                                                    )
                                                ) : (
                                                    <>
                                                        <button
                                                            disabled
                                                            className="flex mx-auto bg-green-200 py-2 px-3 rounded-lg w-48 text-gray-700 border-2 border-green-300 my-4"
                                                        >
                                                            <span className="mx-auto">
                                                                Pay Debt
                                                            </span>
                                                        </button>
                                                        <p className="text-red-500 text-sm ">
                                                            <p className="text-center">
                                                                The amount to
                                                                pay need be
                                                                equal or less
                                                                than
                                                            </p>
                                                            <p className="text-center">
                                                                total debt{" "}
                                                                {payAmount} USDC
                                                            </p>
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
