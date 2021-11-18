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
                    {id: 1, salah: "Fajr", startTime: element.fajr_begins, jamaat: element.fajr_jamaat},
                    {id: 2, salah: "Sunrise", startTime: element.sunrise},
                    {id: 3, salah: "Zuhr", startTime: element.zuhr_begins, jamaat: element.zuhr_jamaat},
                    {id: 4, salah: "Asr", startTime: element.asr_begins, jamaat: element.asr_jamaat},
                    {id: 5, salah: "Maghrib", startTime: element.maghrib_begins, jamaat: element.maghrib_jamaat},
                    {id: 6, salah: "Isha", startTime: element.isha_begins, jamaat: element.isha_jamaat},
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
                        {id: 1, salah: "Fajr", startTime: element.fajr_begins, jamaat: element.fajr_jamaat},
                        {id: 2, salah: "Sunrise", startTime: element.sunrise},
                        {id: 3, salah: "Zuhr", startTime: element.zuhr_begins, jamaat: element.zuhr_jamaat},
                        {id: 4, salah: "Asr", startTime: element.asr_begins, jamaat: element.asr_jamaat},
                        {id: 5, salah: "Maghrib", startTime: element.maghrib_begins, jamaat: element.maghrib_jamaat},
                        {id: 6, salah: "Isha", startTime: element.isha_begins, jamaat: element.isha_jamaat},
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

    csvtojson().fromFile(`resources/prayertimes-2021.csv`).then(source => {
        let arr = []
        let rowNum = 0

        source.forEach(element => {
            
            arr.push({
                row: rowNum,
                d_date: element.d_date,
                fajr_begins: element.fajr_begins,
                fajr_jamaat: element.fajr_jamaat,
                sunrise: element.sunrise,
                zuhr_begins: element.zuhr_begins,
                zuhr_jamaat: element.zuhr_jamaat,
                asr_begins: element.asr_begins,
                asr_jamaat: element.asr_jamaat,
                maghrib_begins: element.maghrib_begins,
                maghrib_jamaat: element.maghrib_jamaat,
                isha_begins: element.isha_begins,
                isha_jamaat: element.isha_jamaat,
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
        "row", "d_date", "fajr_begins", "fajr_jamaat", "sunrise", "zuhr_begins", "zuhr_jamaat", "asr_begins", "asr_jamaat", "maghrib_begins", "maghrib_jamaat", "isha_begins", "isha_jamaat"] 
    })
    // console.log(csv)
    fs.writeFileSync("resources/prayertimes-2021.csv", csv)
    res.send("All is good")
})

router.get('/prayertimes/logo', (req, res) => {
    res.sendFile(process.cwd() + "/resources/iqra-logo.png")
})

module.exports = router