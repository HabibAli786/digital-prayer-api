const express = require('express')
const app = express()
const port = 3001

app.get(['/', '/prayertimes'], (req, res) => {
  res.send('Welcome to the prayer times api')
})

app.listen(port, () => {
  console.log(`digital-prayer-times-api listening on http://localhost:${port}`)
})