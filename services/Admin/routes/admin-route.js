const router = require('express').Router()
const sqlite = require('sqlite3').verbose()
const bcrypt = require('bcrypt');
const { reset } = require('nodemon');

const admin = require('../admin')

const saltRounds = 10;

let db = new sqlite.Database('./services/Admin/admin.db', (err) => {
    if(err) {
      console.error(err.message)
    }
    console.log("Connected to admin database")    
})

router.post('/admin/register', (req, res) => {
  const username = req.body.username
  const password = req.body.password
  // console.log(username)
  // console.log(password)
  db.serialize(() => {
    db.get(`SELECT username FROM admin WHERE username="${username}"`, async (err, result) => {
      if(err) {
        throw new Error(err)
      }
      if(result) {
        throw new Error("this username exists already in the database")
      } else {
        console.log("this username does not exist")
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        console.log(hashedPassword)

        db.run(`INSERT INTO admin (username, password) VALUES ('${username}', '${hashedPassword}');`, (err, result) => {
          if(err) {
            throw new Error(err)
          } else {
            res.send("Account succesfully made!")
          }
        })

        // const match = await bcrypt.compare(testMatch, hashedPassword);
        // console.log(match)
      }
    })

    // const result = db.get('SELECT * FROM admin', (err, results) => {
    //   if(err) {
    //     console.log(err)
    //   } else {
    //     console.log(results)
    //   }
    // })
  })
  // db.close()
})

router.get('/admin/login', (req, res) => {
  console.log(req.body)
})

  
router.post('/admin/user', (req, res) => {
    console.log(req.body)
})


module.exports = router
