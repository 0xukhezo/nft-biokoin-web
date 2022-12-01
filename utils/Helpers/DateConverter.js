function DateConverter(UNIX_timestamp, card) {
    const unixInDate = new Date(UNIX_timestamp)
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ]
    if (card) {
        return (
            unixInDate.getDate() +
            "/" +
            (unixInDate.getMonth() + 1) +
            "/" +
            unixInDate.getFullYear()
        )
    }
    return (
        unixInDate.getDate() +
        " " +
        months[unixInDate.getMonth()] +
        " " +
        unixInDate.getFullYear()
    )
}

export { DateConverter }
