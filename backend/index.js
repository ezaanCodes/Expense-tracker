import cors from "cors";
import express from "express";
import dotenv from "dotenv";

import router from "./routes/index.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();

// app.use(cors("*"))
app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// app.use("/api-v1", (req, res) => {
//     res.json({ message: "API v1 root" });
// })

app.use((req, res) => {
    res.status(401).json({
        status: "404 Not Found",
        message: "Resource/Route not found"
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})


// _ -
