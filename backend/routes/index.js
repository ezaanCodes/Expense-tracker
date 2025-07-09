import express from "express"

// import accountRoutes from './accountRoutes.js'
import authRoutes from './authRoutes.js'
// import transactionRoutes from './transactionRoutes.js'
// import userRoutes from './userRoutes.js'

const router = express.Router()

router.use('/auth',authRoutes);
// router.use('/user',userRoutes);
// router.use('/accountRoutes',accountRoutes);
// router.use('/transaction',transactionRoutes);

export default router