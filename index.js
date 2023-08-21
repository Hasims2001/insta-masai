const express = require('express');
const { connectToDB } = require('./db');
const { postsRouter } = require('./routers/postsRouter');
const { userRouter } = require('./routers/userRoutes');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use("/users", userRouter);

app.use("/posts", postsRouter);

app.listen(8080, async () => {
    try {
        await connectToDB;
        console.log("server is running....")
    } catch (error) {
        console.log(error);
    }
})