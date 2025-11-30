import express, { Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

// const express = require("express");
const app = express();
const port = 5000;

// parser
app.use(express.json());

// dotenv config
dotenv.config({ path: path.join(process.cwd(), ".env") });

// connection to database
const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STR}`,
});

// create database

const initDB = async () => {
  await pool.query(
    `
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        age INT,
        phone VARCHAR(15),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )

        `
  );

  await pool.query(
    `
    CREATE TABLE IF NOT EXISTS todos(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT false,
    due_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    )
    
    `
  );
};

initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World! can you refresh auto");
});

//user CURD

app.post("/users", async (req: Request, res: Response) => {
  const { name, email } = req.body;
  console.log(req.body);

  try {
    const result = await pool.query(
      `INSERT INTO users(name,email) VALUES($1, $2) RETURNING *`,
      [name, email]
    );
    // console.log(result);
    // res.send({ message: "data inserted" });
    res.status(201).json({
      success: false,
      message: "data inserted successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
    res.status(200).json({
      success: true,
      message: "users retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
});

app.get("/users/:id", async (req: Request, res: Response) => {
  //   console.log(req.params.id);
  const id = req.params.id;
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    res.status(200).json({
      success: true,
      message: "data get by id successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
//update users

app.put("/users/:id", async (req: Request, res: Response) => {
  const { name, email } = req.body;
  const id = req.params.id;
  try {
    const result = await pool.query(
      `UPDATE users SET name = $1, email=$2 WHERE id = $3 RETURNING *`,
      [name, email, id]
    );
    res.status(200).json({
      success: true,
      message: "update by id successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
