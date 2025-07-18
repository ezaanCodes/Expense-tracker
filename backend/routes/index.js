import express from "express"
import accountRoutes from './accountRoutes.js'
import authRoutes from './authRoutes.js'
import userRoutes from './userRoutes.js'
import transactionRoutes from './transactionRoutes.js'

const router = express.Router()

router.use('/auth',authRoutes);
router.use('/user',userRoutes);
router.use('/account',accountRoutes);
router.use('/transaction',transactionRoutes);

export default router