const express = require('express');
const { UserModel } = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { blacklistModel } = require('../model/blacklistModel');
require('dotenv').config();


const auth = async (req, res, next) => {
    const token = req.headers.auth;
    console.log(token);
    if (token) {
        try {
            const findToken = await blacklistModel.findOne({ token });
            if (findToken) {
                res.status(200).send({ "error": "you are logout, try to login.", issue: true })
            } else {
                jwt.verify(token, process.env.TOKEN_KEY, (err, result) => {
                    if (err) return err;
                    if (result) {
                        req.body.name = result.name;
                        req.body.userId = result.id;
                        next();
                    }
                })
            }
        } catch (error) {
            res.status(400).send({ "error": error.message, issue: true })
        }
    } else {
        res.status(200).send({ "error": "token not found", issue: true })
    }
}

module.exports = { auth };