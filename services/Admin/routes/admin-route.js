const router = require('express').Router()
const admin = require('../admin')
const sqlite = require('sqlite3')

let db = new sqlite.Database('../admin.db', (err) => {
    if(err) {
      console.error(err.message)
    }
    console.log("Connected to user database")
})

router.get('/login', (req, res) => {
    const result = db.get('Select * from user', (err, results) => {
      console.log(results)
      // res.render(results)
    })
    // console.log("Here is the result " + result)
    // console.log(req.body)
  })
  
router.post('/register', (req, res) => {
    // console.log(req.body)
    // const result = db.all('Select * from user')
    // console.log(result)
})
  
router.post('/user', (req, res) => {
    console.log(req.body)
})


module.exports = router
