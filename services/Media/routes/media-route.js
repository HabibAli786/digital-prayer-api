const router = require('express').Router()
const media = require('../media')

router.get('/media/logo', (req, res) => {
    res.sendFile(process.cwd() + "/resources/iqra-logo.png")
})


module.exports = router