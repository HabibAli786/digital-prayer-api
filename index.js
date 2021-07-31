const express = require('express')
const cors = require('cors')

// Middleware
const app = express()
const port = 3001
app.use(cors())
app.use(express.static(__dirname + './resources'));
app.use(express.static(__dirname + './services'));

// Routes
const PrayerTimes = require('./services/PrayerTimes/routes/timetable')
app.use(PrayerTimes)

app.listen(port, () => {
  console.log(`digital-prayer-times-api listening on http://localhost:${port}`)
})