const router = require('express').Router()
const notfications = require('../notifications')

router.get('/notifications', (req, res) => {
    res.json({ notfications: notfications.all_notifications() })
})



module.exports = router