import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import router from './routes/routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;


// Use cookie-parser middleware to parse cookies

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