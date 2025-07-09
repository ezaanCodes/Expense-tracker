import { text } from "express";
import pool from "../libs/database.js"
import { comparePassword, createJWT } from "../libs/index.js";

export const signupUser = async (req, res) => {
    try {
        const { name, password, email } = req.body;

        if (!name || !password || !email) {
            return res.status(404).json({
                status: "failed",
                message: "Provide missing Fields!"
            })
        }

        const userExists = await pool.query({
            text: "SELECT EXISTS (SELECT * FROM tbluser WHERE email = $1)",
            values: [email],
        })

        if (userExists.rows[0].userExists) {
            return res.status(400).json({
                status: "failed",
                message: "Email Already Exists, Try Login"
            })
        }

        const hashedPassword = await hashPassword(password)

        const user = pool.query({
            text: `INSERT INTO tblusers (firstname, email, password) VALUES ($1, $2, $3) RETURNING *`,
            values: [firstname, email, hashedPassword],
        })

        user.rows[0].password = undefined;

        res.status(201).json({
            status: "Success",
            message: "User Created Successfully",
            user: user.row[0]
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "Failed",
            message: error.message
        })
    }
}

export const signinUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const result = pool.query({
            text: `SELECT * from tblusers WHERE email = $1`,
            values: [email]
        });

        const user = result.rows[0];

        if (!user) {
            return res.status(400).json({
                status: "failed",
                message: "Email or Password Incorrect"
            })
        }

        const isMatch = await comparePassword(password)
        if (!isMatch) {
            return res.status(400).json({
                status: "failed",
                message: "Email or Password Incorrect"
            })
        }
        const token = createJWT(user.id)

        user.password= undefined

        res.status(200).json({
            status:"success",
            message: "user Login Successful",
            user,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "Failed",
            message: error.message
        })
    }
}



// export const signinUser = async (req, res) => {
//     // try {

// } catch (error) {
// console.log(error);
// res.status(500).json({
// status: "Failed",
// message: error.message
// })
//     // }
// }