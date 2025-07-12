import express from "express"
import authMiddleware from "../middleware/authMiddleware.js";
import {getAccounts, createAccount, addMoneyToAccount} from "../controllers/accountController.js"
const router = express.Router()

router.get("/", authMiddleware, getAccounts);
router.get("/:id", authMiddleware, getAccounts);
router.post("/create", authMiddleware, createAccount);
router.put("/add-money/:id", authMiddleware, addMoneyToAccount)

export default router