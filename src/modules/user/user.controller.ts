import { Request, Response } from "express";
import { pool } from "../../config/db";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  console.log(req.body);

  try {
    // const result = await pool.query(
    //   `INSERT INTO users(name,email) VALUES($1, $2) RETURNING *`,
    //   [name, email]
    // );

    const result = await userServices.createUser(name, email);
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
};

export const userControllers = {
  createUser,
};
