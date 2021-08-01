const router = require('express').Router()
const generateTimetable = require('../generate-timetable')
const csvtojson = require('csvtojson')

router.get('/prayertimes', (req, res) => {
    const day = generateTimetable.FullDate()

    csvtojson().fromFile(`resources/prayertimes-2021.csv`).then(source => {
        let current = []

        source.forEach(element => {
            if(element.d_date == day) {
                current.push(
                    // {id: 0, date: day},
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

router.get('/prayertimes/currentdate', (req, res) => {
    res.json({ date : generateTimetable.FullDate() })
})

module.exports = router