const router = require('express').Router()
const notifications = require('../notifications')

router.get('/notifications', (req, res) => {
    res.json({ notifications: notifications.all_notifications() })
})



module.exports = router