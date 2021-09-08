const FullDate = () => {
    const date = new Date()

    let day = date.getDate()
    day = day.toString()
    if(day.length === 1) {
        day = `0${day}`
    }

    let month = date.getMonth()+1
    month = month.toString()
    if(month.length === 1) {
        month = `0${month}`
    }
    
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
}

const weekDay = () => {
    const date = new Date()
    return date.toLocaleString("default", { weekday: "long" })
}

const dayMonth = () => {
    const date = new Date()
    const weekday = date.toLocaleString("default", { weekday: "long" })
    const dayOfMonth = date.getDate()
    const month = date.toLocaleString('default', { month: 'long' })
    return dayOfMonth + " " + month
}

const Notfications = () => {
    const notfications = ["Surah Mulk after Maghrib", "Dars after Zuhr", "Collections for Eid after Jummah", "Eid on the 23rd of July"]
    return notfications
}

const customWeekDay = (date) => {
    const d = new Date();

    const dateDay = date.slice(0, 2)
    let dateMonth = date.slice(3, 5)
    dateMonth = parseInt(dateMonth)-1
    const dateYear = date.slice(6, 10)

    // Set full date
    d.setFullYear(dateYear, dateMonth, dateDay)

    const weekday = d.toLocaleString("default", { weekday: "long" })
    return weekday

}

const customDayMonthYear = (date) => {
    const d = new Date();
    // d.setFullYear(2020, 11, 3);

    const dateDay = date.slice(0, 2)
    let dateMonth = date.slice(3, 5)
    dateMonth = parseInt(dateMonth)-1
    const dateYear = date.slice(6, 10)

    // Set full date
    d.setFullYear(dateYear, dateMonth, dateDay)

    const dayOfMonth = d.getDate()
    const month = d.toLocaleString('default', { month: 'long' })
    const year = d.getFullYear();
    return dayOfMonth + " " + month + " " + year
}


module.exports = {
    "fullDate" : FullDate,
    "weekday" : weekDay,
    "dayMonth": dayMonth,
    "notfications": Notfications,
    "customWeekDay": customDayMonthYear,
    "customDayMonthYear": customDayMonthYear
}