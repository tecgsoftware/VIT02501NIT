import express from 'express';


import { authAdmin, authUser } from '../middlewares/authMiddleware.js';
import { getAllUsers } from '../controllers/admin.controller.js';


const adminRouter = express.Router();

adminRouter.get('/allUsers',authUser,authAdmin,getAllUsers);

export default adminRouter