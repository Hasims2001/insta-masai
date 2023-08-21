const express = require('express');
const { auth } = require('../middleware/auth.middleware');
const { PostModel } = require("../model/postsModel");
require('dotenv').config();


const postsRouter = express.Router();

postsRouter.use(auth);

postsRouter.get('/', async (req, res) => {
    const { userId } = req.body;
    if (userId) {
        try {
            const posts = await PostModel.find({ userId: userId });
            res.status(200).send({ posts, issue: false });
        } catch (error) {
            res.status(400).send({ "error": error.message, issue: true })
        }

    } else {
        res.status(200).send({ "error": "user id is required", issue: true })
    }
});


postsRouter.post('/add', async (req, res) => {
    const { userId } = req.body;
    const { title, body, device, no_of_comments } = req.body;
    if (userId) {
        try {
            const newPost = new PostModel({
                userId: userId,
                name: req.body.name,
                title,
                body,
                device,
                no_of_comments
            })
            await newPost.save();
            res.status(200).send({ newPost, issue: false });
        } catch (error) {
            res.status(400).send({ "error": error.message, issue: true })
        }

    } else {
        res.status(200).send({ "error": "userId is required", issue: true })
    }
});


postsRouter.patch('/update/:postId', async (req, res) => {
    const { userId } = req.body;
    const { postId } = req.params;
    if (userId) {
        try {
            const findPost = await PostModel.findOne({ _id: postId });
            if (findPost) {
                const updated = await PostModel.findByIdAndUpdate({ _id: postId }, req.body, { new: true });
                res.status(200).send({ updatedPost: updated, issue: false });

            } else {
                res.status(200).send({ "error": "post not found", issue: true })
            }
        } catch (error) {
            res.status(400).send({ "error": error.message, issue: true })
        }

    } else {
        res.status(200).send({ "error": "userId is required", issue: true })
    }
});



postsRouter.delete('/delete/:postId', async (req, res) => {
    const { userId } = req.body;
    const { postId } = req.params;
    if (userId) {
        try {
            const findPost = await PostModel.findOne({ _id: postId });
            if (findPost) {
                const deletedPost = await PostModel.findByIdAndDelete(postId);
                res.status(200).send({ deletedPost, issue: false });
            } else {
                res.status(200).send({ "error": "post not found", issue: true })
            }
        } catch (error) {
            res.status(400).send({ "error": error.message, issue: true })
        }

    } else {
        res.status(200).send({ "error": "userId is required", issue: true })
    }
});
module.exports = {
    postsRouter
}