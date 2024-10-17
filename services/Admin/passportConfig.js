const bcrypt = require('bcryptjs')
const localStrategy = require('passport-local').Strategy
const sqlite = require('sqlite3').verbose()

let db = new sqlite.Database('./services/Admin/admin.db', (err) => {
    if(err) {
      console.error(err.message)
    }
    console.log("Connected to admin database for passport config")
})

module.exports = function(passport) {
    passport.use(
        new localStrategy((username, password, done) => {
            db.get(`SELECT id, username, password FROM admin WHERE username="${username}";`, async (err, user) => {
                try {    
                    if(err) throw err;
                    const dbUsername = user.username
                    const dbPassword = user.password        
                    const match = await bcrypt.compare(password, dbPassword)
            
                    if(match) {
                      return done(null, user)
                    } else {
                      return done(null, false)
                    }
                  } catch(e) {
                    console.log('Error caught:', e)
                    done(null, false)
                  }
            })
        })
    )

   passport.serializeUser((user, cb) => {
       cb(null, user.id)
   })

   passport.deserializeUser((id, cb) => {
    db.get(`SELECT id, username, password FROM admin WHERE id="${id}";`, async (err, user) => {
        // Select what you want to return to the client from the db request
        const userInfo = {
            username: user.username
        }
        cb(err, userInfo);
    })
   })
}