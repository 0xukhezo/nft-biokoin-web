import React, { useEffect } from "react"
import { useMoralis } from "react-moralis"

function ConnectButton() {
    const {
        enableWeb3,
        account,
        isWeb3Enabled,
        Moralis,
        deactivateWeb3,
        isWeb3EnableLoading,
    } = useMoralis()

    useEffect(() => {
        if (isWeb3Enabled) return
        if (typeof window != "undefined") {
            if (window.localStorage.getItem("connected")) {
                enableWeb3()
            }
        }
    }, [isWeb3Enabled])

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            if (account == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
            }
        })
    }, [])

    return (
        <>
            {account ? (
                <span className="ml-4 border-2 border-green-500 rounded-lg p-2">
                    {account.slice(0, 6)}...
                    {account.slice(account.length - 4)}
                </span>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3()
                        if (typeof window != "undefined") {
                            window.localStorage.setItem("connected", "injected")
                        }
                    }}
                    className="rounded-lg border-2 p-2 border-green-500"
                    disabled={isWeb3EnableLoading}
                >
                    Connect Metamask
                </button>
            )}
        </>
    )
}

export default ConnectButton
