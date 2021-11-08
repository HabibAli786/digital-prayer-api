const router = require('express').Router()
const media = require('../media')
const fs = require('fs')
const { promisify } = require('util')
const multer  = require('multer')
const path = require('path')
const csvtojson = require('csvtojson')

const storage = multer.diskStorage({
    destination: './resources/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ 
    storage: storage,
    fileFilter: function(req, file, cb) {
        if(file.mimetype === 'text/csv') {
            cb(null, true)
        } else {
            cb("Error: This is not a csv file")
        }
    } 
}).single('prayertimes')

router.get('/media/logo', (req, res) => {
    res.sendFile(process.cwd() + "/resources/iqra-logo.png")
})

router.get('/media/slides', async (req, res) => {
    fs.readdir("./resources/slides", (err, files) => {
        try {
            let numOfFiles = files.length
            res.json({
                "numOfFiles" : numOfFiles,
                "files" : files
            })
        } catch(e) {
            console.error(e)
            res.json({ error : "There has been an error: " + e })
        }
    });
})

router.get('/media/slides/:id', async (req, res) => {
    let id = req.params.id
    try {
        res.sendFile(process.cwd() + `/resources/slides/slide${id}.jpg`)
    } catch(e) {
        console.log("There has been an error with this request: " + e)
    }
})

router.post('/media/uploadTimetable', async(req, res) => {
    // res.send('We have recieved ' + req.body.hello)

    upload(req, res, (err) => {
        if(err) {
            res.send(err)
        } else {
            console.log(req.file)

            csvtojson().fromFile(`resources/${req.file.filename}`).then(source => {
                // let current = []
                let errorRows = []
                let row = 2
                source.forEach(element => {
                    let date = element.d_date
                    let spliceDate = new Date(date.slice(6,10), date.slice(3,5), date.slice(0,2))
                    if(isNaN(spliceDate.getTime())) {
                        console.log(`Invalid Date - ensure the date is set to dd-mm-yyyy format + ${row}`)
                        errorRows.push(row)
                        // res.send(`Invalid Date - ensure the date is set to dd-mm-yyyy format. Please check row ${row}`)
                    } else {
                        console.log("date is correct for row " + row)
                        for(column in element) {
                            if(column === "d_date") {
                                continue;
                            }
                            if(element[column].length !== 5) {
                                console.log("this is incorrect " + row)
                                errorRows.push(row)
                            }
                            console.log("this is correct " + row)
                        }
                        // console.log(spliceDate)
                        // console.log(spliceDate.getDate())
                    }
                    row += 1
                });
                if(errorRows.length >= 1) {
                    res.send("Invalid Date - ensure the date is set to dd-mm-yyyy format - Here are the rows: " + errorRows)
                    fs.unlink(`./resources/${req.file.filename}`, (err) => {
                        if (err) {
                          console.error(err)
                          return
                        }
                        console.log("File has been removed")
                      })
                } else {
                    res.send("File has been uploaded successfully")
                }
                // console.log(current)
                // res.json(current)
            })


            // res.send(req)
            // res.send(req.file)
        }
    })

})


module.exports = router