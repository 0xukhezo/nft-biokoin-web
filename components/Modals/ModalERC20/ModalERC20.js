import { Fragment, useRef, useState } from "react"
import { useMoralis } from "react-moralis"
import { Dialog, Transition } from "@headlessui/react"
import { networkConfig } from "../../../constants/networkConfig"

export default function ModalERC20({ getPanelModal, getAsset }) {
    const { chainId: chainIdHex } = useMoralis()

    const chainId = parseInt(chainIdHex)

    const [open, setOpen] = useState(true)
    const cancelButtonRef = useRef(null)

    let assets = networkConfig[chainId].assets

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
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-80 sm:max-w-lg">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="flex sm:items-start justify-center">
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg font-medium leading-6 text-gray-900"
                                            >
                                                Select Loan Asset
                                            </Dialog.Title>
                                            <div className="mt-10">
                                                {assets?.map((asset) => {
                                                    return (
                                                        <button
                                                            name="symbol"
                                                            className="flex w-full align-center mb-4 border-b-2 border-gray-100 pb-4"
                                                            key={asset.symbol}
                                                            onClick={() => {
                                                                getAsset(
                                                                    asset.symbol
                                                                )
                                                                getPanelModal(
                                                                    false
                                                                )
                                                            }}
                                                        >
                                                            <img
                                                                src={
                                                                    asset.image
                                                                }
                                                                className="rounded-full h-8 w-8"
                                                            />
                                                            <span className="ml-4">
                                                                {asset.symbol}
                                                            </span>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
