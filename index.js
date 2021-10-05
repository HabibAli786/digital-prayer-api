const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')

// Middleware
const app = express()
const port = 3001

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(session({
  secret: "secretcode",
  resave: true,
  saveUninitialized: true
}))
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
app.use(cookieParser('secertcode'))
app.use(express.static(__dirname + './resources'));
app.use(express.static(__dirname + './services'));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the digital-prayer-api')
})

const Admin = require('./services/Admin/routes/admin-route')
app.use(Admin)

const PrayerTimes = require('./services/PrayerTimes/routes/timetable-route')
app.use(PrayerTimes)

const Notifications = require('./services/Notifications/routes/notifications-route')
app.use(Notifications)

const Media = require('./services/Media/routes/media-route')
app.use(Media)

app.listen(port, () => {
  console.log(`digital-prayer-times-api listening on http://localhost:${port}`)
})