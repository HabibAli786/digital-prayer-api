const router = require('express').Router()

router.get('/prayertimes', (req, res) => {
    res.send('Welcome to prayertimes')
})

module.exports = router