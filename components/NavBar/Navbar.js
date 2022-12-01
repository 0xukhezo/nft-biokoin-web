import React, { Fragment } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { Popover, Transition } from "@headlessui/react"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import ConnectButton from "../ConnectButton/ConnectButton"

const navigation = [
    { name: "Mint NFT", href: "mint" },
    { name: "Add liquidity", href: "lend" },
    { name: "Liquidity directed", href: "borrow" },
]

function Navbar() {
    const router = useRouter()

    return (
        <Popover>
            <div className="relative px-4 pt-6 sm:px-6 lg:px-8 flex items-center justify-between mb-10">
                <nav
                    className="relative flex items-center justify-between sm:h-10 lg:justify-center"
                    aria-label="Global"
                >
                    <div className="flex flex-shrink-0 flex-grow items-center lg:flex-grow-0">
                        <div className="flex w-full items-center justify-between md:w-auto">
                            <div className="-mr-2 flex items-center md:hidden">
                                <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-green-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500">
                                    <span className="sr-only">
                                        Open main menu
                                    </span>
                                    <Bars3Icon
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                    />
                                </Popover.Button>
                            </div>
                        </div>
                    </div>

                    {navigation.map((item) => (
                        <div
                            className={
                                router.asPath.slice(1) === item.href
                                    ? "hidden md:ml-10 md:block md:space-x-8 md:px-4 border-b-2 border-green-500 font-medium"
                                    : "hidden md:ml-10 md:block md:space-x-8 md:px-4 font-medium text-gray-500 hover:text-green-900"
                            }
                        >
                            <Link
                                key={item.name}
                                href={item.href}
                                className="font-medium text-gray-500 hover:text-green-900"
                            >
                                {item.name}
                            </Link>
                        </div>
                    ))}
                </nav>
                <ConnectButton />
            </div>

            <Transition
                as={Fragment}
                enter="duration-150 ease-out"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="duration-100 ease-in"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <Popover.Panel
                    focus
                    className="absolute inset-x-0 top-0 z-10 origin-top-right transform p-2 transition md:hidden"
                >
                    <div className="overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-black ring-opacity-5">
                        <div className="flex items-center justify-between px-5 pt-4">
                            <div>
                                <img
                                    className="h-8 w-auto"
                                    src="https://tailwindui.com/img/logos/mark.svg?color=green&shade=600"
                                    alt=""
                                />
                            </div>
                            <div className="-mr-2">
                                <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-green-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500">
                                    <span className="sr-only">
                                        Close main menu
                                    </span>
                                    <XMarkIcon
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                    />
                                </Popover.Button>
                            </div>
                        </div>
                        <div className="space-y-1 px-2 pt-2 pb-3">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-green-900"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                        <ConnectButton />
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    )
}

export default Navbar
