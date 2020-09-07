const express = require("express");
const router = express.Router();
const Video = require('../models/video')
const auth = require('../middleware/auth')

router.post('/createvideo', auth, (req, res) => {
    const { title, body, url } = req.body;
    if (!title || !body || !url) {
        return res.status(422).json({ error: "Plase add all the fields" });
    }
    req.user.password = undefined;
    const video = new Video({
        title,
        body,
        url,
        postedBy: req.user
    })
    video.save().then(result => {
        res.json({ video: result })
    }).catch(err => {
        console.log(err);
    })
})

module.exports = router;