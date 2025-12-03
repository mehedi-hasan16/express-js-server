import express, { Request, Response } from "express";

import config from "./config";
import initDB, { pool } from "./config/db";

// const express = require("express");
const app = express();
const port = config.port;

// parser
app.use(express.json());

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

//delete users
app.delete("/users/:id", async (req: Request, res: Response) => {
  //   console.log(req.params.id);
  const id = req.params.id;
  try {
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
    res.status(200).json({
      success: true,
      message: "data delete by id successfully",
      //   data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//todos curd
app.post("/todos", async (req: Request, res: Response) => {
  const { user_id, title } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`,
      [user_id, title]
    );
    res.status(201).json({
      success: true,
      message: "todo created",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
});

//404 unknow route

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "route not found",
    path: req.path,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
