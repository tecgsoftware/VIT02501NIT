import express from 'express';
import dotenv from 'dotenv';
import connectToDatabase  from './config/dbConnection.js';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import cookieParser from "cookie-parser";
import adminRouter from './routes/admin.route.js';


// configuring dotenv
dotenv.config();

// Creating express app
const app = express();
app.use(cookieParser());
// for handling json
app.use(express.json());
// for handling form data input
app.use(express.urlencoded({extended: true}));

// Connecting to database
connectToDatabase();


// middleware for user
app.use('/auth', authRouter);
app.use('/user',userRouter);

// middleware for admin
app.use('/admin', adminRouter);



const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})