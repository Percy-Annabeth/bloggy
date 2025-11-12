const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");



const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");
const commentRouter = require("./routes/commentRoutes");


const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


mongodb_uri = "mongodb://localhost:27017/bloggyDB"
mongoose.connect(`${mongodb_uri}`)
.then(()=>{
    console.log(`Mongodb connected to server: localhost:27017/bloggyDB successfully`);
})
.catch(e=>console.log(e));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);

app.get("/",(req,res)=>{
    res.send(`home page`);
});

app.listen(8000,()=>{
    console.log("server of Bloggy website being hosted on port 8000")
});