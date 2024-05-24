const getDates = (startTime: Date, endTime: Date) => {
    const start = new Date(Number(startTime) * 1000)
    const end = new Date(Number(endTime) * 1000)
    const now = new Date()
    return { start, end, now }
}

export const getDuration = (startTime: Date, endTime: Date) => {
    const { start, end } = getDates(startTime, endTime)

    const yearsDifference = end.getFullYear() - start.getFullYear()
    const monthsDifference = end.getMonth() - start.getMonth()
    let totalMonths = yearsDifference * 12 + monthsDifference

    const startCopy = new Date(start)
    startCopy.setMonth(startCopy.getMonth() + totalMonths)

    let remainingDays = (end.getTime() - startCopy.getTime()) / (1000 * 60 * 60 * 24)

    if (remainingDays < 0) {
        totalMonths -= 1
        startCopy.setMonth(startCopy.getMonth() - 1)
        remainingDays = (end.getTime() - startCopy.getTime()) / (1000 * 60 * 60 * 24)
    }

    return `${totalMonths} months ${Math.floor(remainingDays)} days`
}

export const getEndDuration = (startTime: Date, endTime: Date): string => {
    const { end, now } = getDates(startTime, endTime)

    const diffMs = end.getTime() - now.getTime()

    let diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHrs = Math.floor(diffMin / 60)
    const diffDays = Math.floor(diffHrs / 24)

    const remainingMin = diffMin % 60
    const remainingHrs = diffHrs % 24

    return `${diffDays}D ${remainingHrs}h ${remainingMin}min`
}
