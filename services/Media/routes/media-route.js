const router = require('express').Router()
const media = require('../media')
const fs = require('fs')
const { promisify } = require('util')
const multer  = require('multer')
const path = require('path')
const csvtojson = require('csvtojson')
const e = require('express')

const storage = multer.diskStorage({
    destination: './resources/',
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})

const slideStorage = multer.diskStorage({
    destination: './resources/slides',
    filename: function(req, file, cb) {
        console.log(file)
        cb(null, file.originalname)
    }
})

const upload = multer({ 
    storage: storage,
    fileFilter: function(req, file, cb) {
        console.log(file)
        if(file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel') {
            if(file.originalname !== "prayertimes.csv") {
                cb("Error: Please ensure filename is prayertimes.csv")
            } else {
                cb(null, true)
            }
        } else {
            cb("This is not a csv file")
        }
    } 
}).single('prayertimes')

const uploadLogo = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        console.log(file)
        if(file.mimetype === 'image/png' && file.originalname === 'logo.png') {
            cb(null, true)
        } else {
            cb("This is not a png file or filename is not logo.png")
        }
    }
}).single('logo')

const uploadFile = multer({
    storage: slideStorage,
    fileFilter: function(req, file, cb) {
        console.log(file)
        if(file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
            cb(null, true)
        } else {
            cb("Error: This is not a jpg/jpeg file")
        }
    }
}).single('slide')

router.get('/media/logo', (req, res) => {
    res.sendFile(process.cwd() + "/resources/logo.png")
})

router.post('/media/logo', (req, res) => {
    uploadLogo(req, res, (err) => {
        if(err) {
            console.log(err)
            res.send(err)
        } else {
            console.log(req.file.filename)
            res.send("File has been uploaded successfully")
        }
    })
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
        res.sendFile(process.cwd() + `/resources/slides/${id}`)
    } catch(e) {
        console.log("There has been an error with this request: " + e)
    }
})

router.post('/media/slides/admin/delete', async (req, res) => {
    const file = req.body.slideToDelete
    fs.unlink(`resources/slides/${file}`, (err) => {
        if (err) {
            console.log(err)
            res.send(err)
        } else {
            console.log(`${file} was deleted`);
            res.send(`${file} was deleted`)
        }
    });
})

router.post('/media/slides/admin/add', async (req, res) => {
    uploadFile(req, res, (err) => {
        if(err) {
            console.log(err)
            res.send(err)
        } else {
            console.log(req.file.filename)
            res.send("File has been uploaded successfully")
        }
    })
})

router.post('/media/uploadTimetable', async(req, res) => {
    // console.log('We have recieved request')

    upload(req, res, (err) => {
        if(err) {
            res.send(err)
        } else {
            console.log(req.file)

            try {

            csvtojson().fromFile(`resources/${req.file.filename}`).then(source => {
                // let current = []
                let errorRows = []
                let row = 2
                source.forEach(element => {
                    let date = element.d_date
                    let spliceDate = new Date(date.slice(6,10), date.slice(3,5), date.slice(0,2))
                    if(isNaN(spliceDate.getTime())) {
                        // console.log(`Invalid Date - ensure the date is set to dd-mm-yyyy format + ${row}`)
                        errorRows.push(row)
                        // res.send(`Invalid Date - ensure the date is set to dd-mm-yyyy format. Please check row ${row}`)
                    } else {
                        // console.log("date is correct for row " + row)
                        for(column in element) {
                            if(column === "d_date" || column === "hijri_date" || 
                               column === "hijri_month" || column === "hijri_year" || column === "row") {
                                continue;
                            }
                            if(element[column].length !== 5) {
                                // console.log("this is incorrect " + row)
                                console.log(element[column])
                                if(errorRows[errorRows.length-1] !== row) {
                                    errorRows.push(row)
                                }
                            }
                            // console.log("this is correct " + row)
                        }
                        // console.log(spliceDate)
                        // console.log(spliceDate.getDate())
                    }
                    row += 1
                });
                if(errorRows.length >= 1) {
                    fs.unlink(`./resources/${req.file.filename}`, (err) => {
                        if (err) {
                          console.error(err)
                          return
                        }
                        console.log("File has been removed")
                    })
                    res.send("Invalid Date - ensure the date is set to dd-mm-yyyy format & time is in HH:MM format \n Here are the rows with errors: " + errorRows)
                } else {
                    res.send("File has been uploaded successfully")
                }
                // console.log(current)
                // res.json(current)
            })


            // res.send(req)
            // res.send(req.file)
            } catch (err) {
                res.send("Something went wrong")
            }
        }
    })

})


module.exports = router