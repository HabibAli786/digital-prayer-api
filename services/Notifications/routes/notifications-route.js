const router = require('express').Router()
const sqlite = require('sqlite3').verbose()
// const notifications = require('../notifications')


let db = new sqlite.Database('./services/Notifications/notifications.db', (err) => {
    if(err) {
      console.error(err.message)
    }
    console.log("Connected to notification database")    
})

router.get('/notifications', (req, res) => {
    db.serialize(() => {
        db.all('SELECT * FROM notification', async (err, result) => {
          if(err) {
            res.send(err)
            throw new Error(err)
          }
          if(result) {
            // console.log(result)
            let arr = []
            for(i=0; i<result.length; i++) {
                arr.push(result[i].text)
            }
            res.json({ notifications: arr })
          } else {
            console.log("Something went wrong")
          }
        })
    })
    // res.json({ notifications: notifications })
})

router.post('/notifications/delete', (req, res) => {
    deleteElement = req.body.toDelete
    db.serialize(() => {
        db.run(`DELETE FROM notification WHERE text="${deleteElement}"`, async (err, result) => {
          if(err) {
            res.send("This notification does not exist")
            throw new Error(err)
          }
          res.send("Notification has been deleted")
          console.log(deleteElement + " notification has been deleted")
        })
    })
    // console.log(notifications)
})

router.post('/notifications/add', (req, res) => {
    addElement = req.body.toAdd
    db.serialize(() => {
        db.run(`INSERT INTO notification (text) VALUES ("${addElement}")`, async (err, result) => {
          if(err) {
            res.send("Something went wrong")
            throw new Error(err)
          }
          res.send("Notification has been added")
          console.log(addElement + " notification has been added")
        })
    })
    // console.log(notifications)
})



module.exports = router