import pg from "pg"
import decrypt from "dotenv"
import dotenv from "dotenv"

dotenv.config()

const { Pool } = pg;
export const pool = new Pool ({
    connectionString: process.env.DATABASE_URI,
    ssl: {
    rejectUnauthorized: false,
  }

})