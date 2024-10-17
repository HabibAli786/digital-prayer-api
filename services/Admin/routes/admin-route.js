const router = require('express').Router()
const sqlite = require('sqlite3').verbose()
const bcrypt = require('bcryptjs');
const passport = require("passport");
const jwt = require('jsonwebtoken')
const passportLocal = require("passport-local").Strategy;

const admin = require('../admin')

const saltRounds = 10;

let db = new sqlite.Database('./services/Admin/admin.db', (err) => {
    if(err) {
      console.error(err.message)
    }
    console.log("Connected to admin database for admin route")
})

router.post('/admin/register', (req, res) => {
  const username = req.body.username
  const password = req.body.password
  // console.log(username)
  // console.log(password)
  db.serialize(() => {
    db.get(`SELECT username FROM admin WHERE username="${username}"`, async (err, result) => {
      if(err) {
        res.send(err)
        throw new Error(err)
      }
      if(result) {
        res.send(result)
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

router.post('/admin/login', (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if(err) throw err
    if(!user) {
       res.send('Unsuccessfully Authenticated')
    } else {
      req.logIn(user, err => {
        if(err) throw err;
        res.send('Successfully Authenticated')
        console.log(req.user)
        // console.log(user)
        // console.log(info)
      })
    }
  })(req, res, next)
  // const username = req.body.username
  // const password = req.body.password
  // db.serialize(() => {
  //   db.get(`SELECT username, password FROM admin WHERE username="${username}";`, async (err, result) => {
  //     try {
  //       // if(err) {
  //       //   throw new Error(err)
  //       // }      
  //       const dbUsername = result.username
  //       const dbPassword = result.password
  //       console.log(dbUsername)
  //       console.log(dbPassword)

  //       const match = await bcrypt.compare(password, dbPassword)

  //       if(match) {
  //         res.send("Passwords match")
  //       } else {
  //         res.send("Password is incorrect")
  //       }
  //     } catch(e) {
  //       console.log(e)
  //       res.send("The username is does not exist")
  //     }
  //   })
  // })
})

router.get('/admin/user', (req, res) => {
  if(req.user) {
    res.send(req.user)
  } else {
    console.log("User not logged in")
    res.send("You are not logged in, please login")
  }
})

router.get('/admin/logout', (req, res) => {
  req.logout();
  console.log("Logged out")
  res.send("Logged out")
})


module.exports = router
