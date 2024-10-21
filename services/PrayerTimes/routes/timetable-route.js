const router = require('express').Router()
const fs = require("fs")
const csvtojson = require('csvtojson')
const jsontocsv = require("json2csv").parse
const sqlite = require('sqlite3').verbose()

const generateTimetable = require('../generate-timetable')
const bcrypt = require("bcryptjs");

let jummahDb = new sqlite.Database('./services/PrayerTimes/jummah.db', (err) => {
    if(err) {
        console.error(err.message);
    }
    console.log("Connected to jummah database");
});

let eventDb = new sqlite.Database('./services/PrayerTimes/eventDb.db', (err) => {
    if(err) {
        console.error(err.message);
    }
    console.log("Connected to event database");
});

async function prepareJummah() {
    await jummahDb.run(`
    CREATE TABLE IF NOT EXISTS jummahTimes (
      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
      jummahType VARCHAR NOT NULL,
      jummahTime VARCHAR NOT NULL);
    `);
}

async function prepareEventDate() {
    await eventDb.run(`
    CREATE TABLE IF NOT EXISTS eventDate (
      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
      date VARCHAR NOT NULL);
    `);
}

async function updateJummah(jummahType, time) {
    console.log(jummahType)
    console.log(time)
    await jummahDb.run(`
        UPDATE jummahTimes
        SET jummahTime = "${time}"
        WHERE jummahType = "${jummahType}";
    `);
}

async function updateEventDate(date) {
    console.log(date)
    const ifEmpty = await eventDb.run(`
        SELECT "id"
        FROM eventDate;
    `);
    console.log(ifEmpty);
    await eventDb.run(`
        UPDATE eventDate
        SET date = "${date}"
        WHERE id = 1;
    `);
}

router.get('/prayertimes', (req, res) => {
    const date = generateTimetable.fullDate()

    csvtojson().fromFile(`resources/prayertimes.csv`).then(source => {
        let current = []

        source.forEach(element => {
            if(element.d_date == date) {
                current.push(
                    {id: 0, date: date, weekday: generateTimetable.weekday(), dayMonth: generateTimetable.dayMonthYear()},
                    {id: 1, salah: "Fajr", startTime: element.fajr_begins, jamaat: element.fajr_jamaat},
                    {id: 2, sun: "Sunrise", startTime: element.sunrise},
                    {id: 3, sun: "Sunset", startTime: element.maghrib_begins},
                    {id: 4, salah: "Zuhr", startTime: element.zuhr_begins, jamaat: element.zuhr_jamaat},
                    {id: 5, salah: "Asr", startTime: element.asr_begins, jamaat: element.asr_jamaat},
                    {id: 6, salah: "Maghrib", startTime: element.maghrib_begins, jamaat: element.maghrib_jamaat},
                    {id: 7, salah: "Isha", startTime: element.isha_begins, jamaat: element.isha_jamaat},
                    {id: 8, hijriDate: element.hijri_date, hijriMonth: element.hijri_month, hijriYear: element.hijri_year}
                )
                // console.log(element)
            }
        });
        res.json(current)
    })
})

router.post('/prayertimes', (req, res) => {
    // console.log(req.body)
    const data = req.body
    const csv = jsontocsv(data, { fields : [
            "row", "d_date", "fajr_begins", "fajr_jamaat", "sunrise", "zuhr_begins", "zuhr_jamaat",
            "asr_begins", "asr_jamaat", "maghrib_begins", "maghrib_jamaat", "isha_begins", "isha_jamaat",
            "hijri_date", "hijri_month", "hijri_year" ]
    })
    // console.log(csv)
    fs.writeFileSync("resources/prayertimes.csv", csv)
    res.send("Success")
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

        csvtojson().fromFile(`resources/prayertimes.csv`).then(source => {
            let current = []

            source.forEach(element => {
                if(element.d_date == newDate) {
                    current.push(
                        {id: 0, date: date, weekday: generateTimetable.weekday(), dayMonth: generateTimetable.dayMonthYear()},
                        {id: 1, salah: "Fajr", startTime: element.fajr_begins, jamaat: element.fajr_jamaat},
                        {id: 2, sun: "Sunrise", startTime: element.sunrise},
                        {id: 3, sun: "Sunset", startTime: element.maghrib_begins},
                        {id: 4, salah: "Zuhr", startTime: element.zuhr_begins, jamaat: element.zuhr_jamaat},
                        {id: 5, salah: "Asr", startTime: element.asr_begins, jamaat: element.asr_jamaat},
                        {id: 6, salah: "Maghrib", startTime: element.maghrib_begins, jamaat: element.maghrib_jamaat},
                        {id: 7, salah: "Isha", startTime: element.isha_begins, jamaat: element.isha_jamaat},
                        {id: 8, hijriDate: element.hijri_date, hijriMonth: element.hijri_month, hijriYear: element.hijri_year}
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
    csvtojson().fromFile(`resources/prayertimes.csv`).then(source => {
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
                hijri_date: element.hijri_date,
                hijri_month: element.hijri_month,
                hijri_year: element.hijri_year
            })
            rowNum += 1
        });
        res.json(arr)
    })
})

router.get('/prayertimes/update/jummah', (req, res) => {
    console.log('received get request for jummah');
    jummahDb.serialize(() => {
        jummahDb.all('SELECT * FROM jummahTimes', async (err, result) => {
            if(err) {
                res.send(err)
                throw new Error(err)
            }
            if(result) {
                res.json({ result })
            } else {
                console.log("Something went wrong")
            }
        })
    })
});

router.post('/prayertimes/update/jummah', async (req, res) => {
    console.log(req.body);

    await prepareJummah();

    const jummahType = req.body.jummahType
    const jummahTime = req.body.time

    await updateJummah(jummahType, jummahTime);

    res.send('Updated')
});

router.get('/prayertimes/update/eventdate', (req, res) => {
    console.log('received get request for event date');
    eventDb.serialize(() => {
        eventDb.all('SELECT * FROM eventDate', async (err, result) => {
            if(err) {
                res.send(err)
                throw new Error(err)
            }
            if(result) {
                res.json({ result })
            } else {
                console.log("Something went wrong")
            }
        })
    })
});

router.post('/prayertimes/update/eventdate', async (req, res) => {
    console.log(req.body);
    await prepareEventDate();
    const date = req.body.eventDate;

    eventDb.serialize(() => {
        eventDb.get(`SELECT * FROM eventDate`, async (err, result) => {
            if(err) {
                res.send(err)
                throw new Error(err)
            }
            if(result) {
                console.log(result)
                await updateEventDate(date)
                res.send(`Updated Date`)
            } else {

                eventDb.run(`INSERT INTO eventDate (date) VALUES ('${date}');`, (err, result) => {
                    if(err) {
                        throw new Error(err)
                    } else {
                        res.send("Account succesfully made!")
                    }
                })
            }
        })
    })

    // await updateEventDate(eventDate);

    // res.send('Updated Event Date')
});

module.exports = router