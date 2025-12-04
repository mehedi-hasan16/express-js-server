import express, { Request, Response } from "express";

import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";

// const express = require("express");
const app = express();
const port = config.port;

// parser
app.use(express.json());

//initilizing db
initDB();

app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello World! can you refresh auto");
});

//user CURD
app.use("/users", userRoutes);

// auth

app.use("/auth", authRoutes);

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
