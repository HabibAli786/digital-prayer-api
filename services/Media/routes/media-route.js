const router = require('express').Router()
const media = require('../media')
const fs = require('fs')
const { promisify } = require('util')

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


module.exports = router