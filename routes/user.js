const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const { JWT_SECRET } = require("../config/keys");


router.post("/signup", (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(422).send({ error: "pls add all fields correctly" });
    }
    User.findOne({ email }).then((savedUser) => {
        if (savedUser) {
            return res.status(404).send({ error: "User already Exists" });
        }
        bcrypt
            .hash(password, 8)
            .then((hashPassword) => {
                const user = new User({
                    name,
                    email,
                    password: hashPassword,
                });
                user
                    .save()
                    .then(() => {
                        res.json({ message: "saved successfully" });
                    })
                    .catch((err) => res.status(404).send(err));
                //res.send({ name, email, password });
            })
            .catch((err) => res.status(404).send(err));
    });
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).send({ error: "please add email or password" });
    }
    User.findOne({ email }).then((savedUser) => {
        if (!savedUser) {
            return res.status(422).json({ error: "invalid Email or Password" });
        }
        bcrypt
            .compare(password, savedUser.password)
            .then((isMatch) => {
                if (isMatch) {
                    //res.send("User successfully signed");
                    const token = jwt.sign({ _id: savedUser._id.toString() }, JWT_SECRET);
                    const { _id, name, email } = savedUser;
                    res.send({ token, user: { _id, name, email } });
                } else {
                    return res.status(422).send("Error wromg Email or Password");
                }
            })
            .catch((err) => {
                res.status(404).send(err);
            });
    });
});

const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Please Upload Image Files"));
        }
        cb(undefined, true);
    },
});

router.post("/avatar", auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();
    req.user.avatar = buffer;
    await req.user.save()
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
}
)

router.get("/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error();
        }
        res.set("Content-Type", "image/png");
        res.send(user.avatar);
    } catch (e) {
        res.status(400).send();
    }
});

router.delete("/avatar", auth, (req, res) => {
    req.user.avatar = undefined;
    res.send()
})

module.exports = router;
