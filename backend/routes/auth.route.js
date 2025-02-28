import express from 'express';
import { login, logout, register } from '../controllers/auth.controller.js';
import { authUser } from '../middlewares/authMiddleware.js';



const authRouter = express.Router();

// register user
authRouter.post('/register',register);
authRouter.post('/login',login)
authRouter.post('/logout',logout);

export default authRouter;