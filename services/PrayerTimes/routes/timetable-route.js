const router = require('express').Router()
const fs = require("fs")
const csvtojson = require('csvtojson')
const jsontocsv = require("json2csv").parse

const generateTimetable = require('../generate-timetable')

router.get('/prayertimes', (req, res) => {
    const date = generateTimetable.fullDate()

    csvtojson().fromFile(`resources/prayertimes-2021.csv`).then(source => {
        let current = []

        source.forEach(element => {
            if(element.d_date == date) {
                current.push(
                    {id: 0, date: date, weekday: generateTimetable.weekday(), dayMonth: generateTimetable.dayMonthYear()},
                    {id: 1, salah: "Fajr", startTime: element.fajr_begins, jamaat: element.fajr_jamah},
                    {id: 2, salah: "Sunrise", startTime: element.sunrise},
                    {id: 3, salah: "Zuhr", startTime: element.zuhr_begins, jamaat: element.zuhr_jamah},
                    {id: 4, salah: "Asr", startTime: element.asr_mithl_1, jamaat: element.asr_jamah},
                    {id: 5, salah: "Maghrib", startTime: element.maghrib_begins, jamaat: element.maghrib_jamah},
                    {id: 6, salah: "Isha", startTime: element.isha_begins, jamaat: element.isha_jamah},
                )
                // console.log(element)
            }
        });
        // console.log(current)
        res.json(current)
    })
})

router.get('/prayertimes/:date', (req, res) => {
    let date = req.params.date

    // Replace - with /
    let newDate = ""
    for(i=0; i < date.length; i++) {
        if(date[i] === "-") {
            newDate += "/"
            continue
        }
        newDate += date[i]
    }

    try {

        csvtojson().fromFile(`resources/prayertimes-2021.csv`).then(source => {
            let current = []

            source.forEach(element => {
                if(element.d_date == newDate) {
                    current.push(
                        {id: 0, date: date, weekday: generateTimetable.weekday(newDate), dayMonthYear: generateTimetable.dayMonthYear(newDate)},
                        {id: 1, salah: "Fajr", startTime: element.fajr_begins, jamaat: element.fajr_jamah},
                        {id: 2, salah: "Sunrise", startTime: element.sunrise},
                        {id: 3, salah: "Zuhr", startTime: element.zuhr_begins, jamaat: element.zuhr_jamah},
                        {id: 4, salah: "Asr", startTime: element.asr_mithl_1, jamaat: element.asr_jamah},
                        {id: 5, salah: "Maghrib", startTime: element.maghrib_begins, jamaat: element.maghrib_jamah},
                        {id: 6, salah: "Isha", startTime: element.isha_begins, jamaat: element.isha_jamah},
                    )
                    // console.log(element)
                }
            });
            // console.log(current)
            res.json(current)
        })
    } catch {
        res.json({error: "No prayer times matching your date"})
    }
})

router.get('/prayertimes/request/all', (req, res) => {
    console.log("I am running")

    csvtojson().fromFile(`resources/prayertimes-2021.csv`).then(source => {
        let arr = []
        let rowNum = 0

        console.log(source)

        source.forEach(element => {
            
            arr.push({
                row: rowNum,
                d_date: element.d_date,
                fajr_begins: element.fajr_begins,
                fajr_jamah: element.fajr_jamah,
                sunrise: element.sunrise,
                zuhr_begins: element.zuhr_begins,
                zuhr_jamah: element.zuhr_jamah,
                asr_mithl_1: element.asr_mithl_1,
                asr_jamah: element.asr_jamah,
                maghrib_begins: element.maghrib_begins,
                maghrib_jamah: element.maghrib_jamah,
                isha_begins: element.isha_begins,
                isha_jamah: element.isha_jamah,
            })
            rowNum += 1
        });
        res.json(arr)
    })
})

router.post('/prayertimes', (req, res) => {
    // console.log(req.body)
    const data = req.body
    const csv = jsontocsv(data, { fields : [
        "row", "d_date", "fajr_begins", "fajr_jamah", "sunrise", "zuhr_begins", "zuhr_jamah", "asr_mithl_1", "asr_jamah", "maghrib_begins", "maghrib_jamah", "isha_begins", "isha_jamah"] 
    })
    // console.log(csv)
    fs.writeFileSync("resources/prayertimes-2021.csv", csv)
    res.send("All is good")
})

router.get('/prayertimes/logo', (req, res) => {
    res.sendFile(process.cwd() + "/resources/iqra-logo.png")
})

module.exports = router