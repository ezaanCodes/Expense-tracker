import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { addTransaction, getDashboardInformation, getTransactions, transferMoneyToAccount } from "../controllers/transactionController.js"

const router = express.Router()

router.get("/", authMiddleware, getTransactions)
router.get("/dashboard", authMiddleware, getDashboardInformation)
router.post("/add-transaction/:account_id", authMiddleware, addTransaction)
router.put("/transfer-money", authMiddleware, transferMoneyToAccount)


export default router