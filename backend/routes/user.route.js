import express from 'express';
import { authUser } from '../middlewares/authMiddleware.js';
import { getProfile, updateProfile } from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.get('/profile',authUser,getProfile);
userRouter.put('/update',authUser,updateProfile);

export default userRouter;