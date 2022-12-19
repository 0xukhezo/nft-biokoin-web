import React from "react"

function LeverageBar({ inicialLeverage, currentLeverage = 0, finalLeverage }) {
    let totalLeverage

    if (currentLeverage > finalLeverage) {
        currentLeverage = finalLeverage
    }
    if (currentLeverage < 0) {
        currentLeverage = 0
    }

    return (
        <>
            <div className="relative pt-1 ">
                <div className="flex justify-between">
                    <div>Leverage</div>
                    <div>
                        {currentLeverage} / {finalLeverage.toFixed(3)}
                    </div>
                </div>

                <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-yellow-200 mt-3">
                    <div
                        style={{
                            width: `${
                                (currentLeverage * 100) / finalLeverage
                            }%`,
                        }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-400"
                    />
                </div>
                <div className="flex justify-between">
                    <div>{inicialLeverage.toFixed(3)}</div>
                    <div>{finalLeverage.toFixed(3)}</div>
                </div>
            </div>
        </>
    )
}

export default LeverageBar
