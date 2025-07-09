import express from "express"
import { signinUser, signupUser } from "../controllers/authController.js"

const router = express.Router()

router.post("/sign-in", signinUser)
router.post("/sign-Up", signupUser)

export default router