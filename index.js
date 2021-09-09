const express = require('express')
const cors = require('cors')

// Middleware
const app = express()
const port = 3001
app.use(cors())
app.use(express.static(__dirname + './resources'));
app.use(express.static(__dirname + './services'));

// Routes

app.get('/', (req, res) => {
  res.send('Welcome to the digital-prayer-api')
})

const PrayerTimes = require('./services/PrayerTimes/routes/timetable-route')
app.use(PrayerTimes)

const Notifications = require('./services/Notifications/routes/notifications-route')
app.use(Notifications)

const Media = require('./services/Media/routes/media-route')
app.use(Media)

app.listen(port, () => {
  console.log(`digital-prayer-times-api listening on http://localhost:${port}`)
})