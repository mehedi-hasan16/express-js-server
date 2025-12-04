import { Request, Response } from "express";
import { pool } from "../../config/db";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  console.log(req.body);

  try {
    // const result = await pool.query(
    //   `INSERT INTO users(name,email) VALUES($1, $2) RETURNING *`,
    //   [name, email]
    // );

    const result = await userServices.createUser(name, email, password);
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

const getUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUser();
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
};

const getSingleUser = async (req: Request, res: Response) => {
  //   console.log(req.params.id);
  const id = req.params.id;
  try {
    const result = await userServices.getSingleUser(id as string);
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
};

const updateUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  const id = req.params.id;
  try {
    const result = await userServices.updateUser(name, email, id!);
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
};

const deleteUser = async (req: Request, res: Response) => {
  //   console.log(req.params.id);
  const id = req.params.id;
  try {
    const result = await userServices.deleteUser(id!);
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
};

export const userControllers = {
  createUser,
  getUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
