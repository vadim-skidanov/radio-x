const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
// import mysql from "mysql2/promise";
const mysql = require("mysql2/promise");
require("dotenv").config();

const corsOptions = {
  origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.post("/api/auth/google", async (req, res) => {
  const { googleId, email, name } = req.body;

  console.log("Received request:", { googleId, email, name });

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE google_id = ?", [
      googleId,
    ]);

    if (rows.length === 0) {
      await db.query(
        "INSERT INTO users (google_id, email, name) VALUES (?, ?, ?)",
        [googleId, email, name]
      );
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
