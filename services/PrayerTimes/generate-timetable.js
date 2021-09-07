const Papa = require('papaparse')
const fs = require('fs')
const csvtojson = require('csvtojson')

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


module.exports = {
    "fullDate" : FullDate,
    "weekday" : weekDay,
    "dayMonth": dayMonth,
    "notfications": Notfications
}