import { text } from "express";
import { pool } from "../libs/database.js"
import { comparePassword, createJWT, hashPassword } from "../libs/index.js";


export const getAccounts = async (req, res) => {
  try {
    const { userId } = req.body.user;

    const accounts = await pool.query({
      text: `SELECT * FROM tblaccount where user_id = $1`,
            values: [userId]
        })

    res.status(200).json({
      status: "success",
            data: accounts.rows
        })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Failed",
            message: error.message
        })
  }

}
export const createAccount = async (req, res) => {
  try {
    const { userId } = req.body.user;
    const { name, account_number, amount } = req.body;

    const accountExistsQuery = {
      text: `SELECT * FROM tblaccount WHERE user_id = $1 AND account_name = $2`,
      values: [userId, name],
    };

    const accountExistResult = await pool.query(accountExistsQuery);

    if (accountExistResult.rows[0]) {
      return res.status(409).json({
        status: "failed",
                message: "account already created"
            })
        };

    const createAccountResult = await pool.query({
      text: `INSERT into tblaccount(user_id, account_name, account_number, account_balance) 
                   VALUES($1,$2,$3,$4) RETURNING *`,
            values: [userId, name, account_number, amount]
    });
    const account = createAccountResult.rows[0];


    const userAccounts = Array.isArray(name) ? name : [name];
    const updateUserAccountQuery = {
      text: `UPDATE tbluser SET accounts = array_cat(accounts, $1), updatedat = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      values: [userAccounts, userId],
    };
    await pool.query(updateUserAccountQuery);

    const description = account.account_name + " (Initial Deposit)";
    const initialDepositQuery = {
      text: `INSERT INTO tbltransaction(user_id, description, type, status, amount, source) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
      values: [
        userId,
        description,
        "income",
        "Completed",
        amount,
        account.account_name,
      ],
    };
    await pool.query(initialDepositQuery);

    res.status(200).json({
      status: "success",
      message: "Account Created successfully",
            data: account
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Failed",
            message: error.message
        })
  }
}
export const addMoneyToAccount = async (req, res) => {
  try {
    const { userId } = req.body.user;
    const { id } = req.params;
        const { amount } = req.body

    const newAmount = Number(amount);

    const result = await pool.query({
      text: `UPDATE tblaccount 
                  SET account_balance = (account_balance + $1), updatedat = CURRENT_TIMESTAMP 
                  WHERE id = $2 RETURNING *`,
            values: [newAmount, id]
        })
        const accountInformation = result.rows[0]

    const description = accountInformation.account_name + "(Deposit)";

    const transQuery = {
      text: `INSERT into tbltransaction(user_id, description, type, status, amount, source)
                  VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      values: [
        userId,
        description,
        "income",
        "completed",
        amount,
                accountInformation.account_name
            ]
        }
        await pool.query(transQuery)

    res.status(200).json({
      status: "success",
      message: "Amount Added successfully",
      data: accountInformation,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Failed",
            message: error.message
        })
  }
}
