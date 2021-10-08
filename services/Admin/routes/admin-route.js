const router = require('express').Router()
const sqlite = require('sqlite3').verbose()

const admin = require('../admin')

let db = new sqlite.Database('./services/Admin/admin.db', (err) => {
    if(err) {
      console.error(err.message)
    }
    console.log("Connected to admin database")    
})

router.post('/admin/register', (req, res) => {
  const username = req.body.username
  const password = req.body.password
  console.log(username)
  console.log(password)
  const result = db.get('SELECT * FROM admin', (err, results) => {
    if(err) {
      console.log(err)
    } else {
      console.log(results)
    }
  })
})

router.get('/admin/login', (req, res) => {
  console.log(req.body)
})

  
router.post('/admin/user', (req, res) => {
    console.log(req.body)
})


module.exports = router
