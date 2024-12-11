import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import router from './routes/routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import Redis from 'ioredis'
dotenv.config();
const app = express();
export const redis = new Redis({
    host:"localhost",
    port:6379,
});
const PORT = process.env.PORT || 8000;
redis.on("connect",()=>{
    console.log("Redis Connected successfully")
});




app.use(cors());
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended: true}))
// app.use(express.static("public"))
connectDb();


app.get('/', (req, res)=> {
    res.send("this is a test");
})

app.use('/api', router);

app.listen(PORT, ()=> {
    console.log(`Server is running on port no : ${PORT}`);
})