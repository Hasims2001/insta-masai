const express = require('express');
const { UserModel } = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { blacklistModel } = require('../model/blacklistModel');
require('dotenv').config();


const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {

    const { name, email, gender, password, age, city, is_married } = req.body;
    if (!name || !email || !gender || !password || !age || !city) {
        res.status(200).send({ "error": "all the fields are required", issue: true })
    } else {
        try {
            const user = await UserModel.findOne({ email });

            if (user) {
                res.status(200).send({ "error": "User already exist, please login", issue: true })
            } else {
                bcrypt.hash(password, 5, async (err, hash) => {
                    if (err) return err;
                    req.body.password = hash;
                    const newuser = new UserModel(req.body);
                    await newuser.save();
                    res.status(200).send({ "issue": false, "message": "user created" });
                })

            }
        } catch (error) {
            res.status(400).send({ "error": error.message, issue: true })
        }
    }

})

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(200).send({ "error": "all the fields are required", issue: true })
    } else {
        try {
            const user = await UserModel.findOne({ email });
            if (user) {
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) return err;
                    if (result) {
                        const token = jwt.sign({ id: user._id, name: user.name }, process.env.TOKEN_KEY, {
                            expiresIn: "7d"
                        });
                        res.status(200).send({ "token": token, issue: false })
                    }
                })
            } else {
                res.status(200).send({ "error": "User does not exist, please register", issue: true })
            }
        } catch (error) {

        }
    }
})


userRouter.get("/logout", async (req, res) => {
    const token = req.headers.auth;
    if (token) {
        // const newtoken = token.replace("Bearer ", "");
        try {
            const newToken = new blacklistModel({ token });
            await newToken.save();
            res.status(200).send({ "message": "token blacklisted", issue: false })
        } catch (error) {
            res.status(400).send({ "error": error.message, issue: true })
        }
    } else {
        res.status(200).send({ "error": "token not found", issue: true })
    }
})

module.exports = { userRouter }