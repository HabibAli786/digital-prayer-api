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

const CurrentDay = () => {
    const date = new Date()
    return date.toLocaleString("default", { weekday: "long" })
}

const Notfications = () => {
    const notfications = ["Surah Mulk after Maghrib", "Dars after Zuhr", "Collections for Eid after Jummah", "Eid on the 23rd of July"]
    return notfications
}


module.exports = {
    fullDate : FullDate,
    currentDay : CurrentDay,
    notfications: Notfications
}