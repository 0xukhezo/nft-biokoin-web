import React from "react"
import { DateConverter } from "../../../utils/Helpers/DateConverter"

function EpochBar({ finalEpochDate, currentEpochDate, inicialEpochDate }) {
    return (
        <>
            <div className="relative pt-1 ">
                <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-emerald-200">
                    <div
                        style={{
                            width: `${
                                ((finalEpochDate - currentEpochDate / 1000) *
                                    10000) /
                                finalEpochDate
                            }%`,
                        }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
                    />
                </div>
                <div className="flex justify-between">
                    <div>{DateConverter(inicialEpochDate * 1000)}</div>
                    <div>{DateConverter(finalEpochDate * 1000)}</div>
                </div>
            </div>
        </>
    )
}

export default EpochBar
