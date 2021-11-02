const sqlite = require('sqlite3')

let db = new sqlite.Database('./admin.db')
db.run('CREATE TABLE admin (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, username TEXT, password TEXT);')
db.close()