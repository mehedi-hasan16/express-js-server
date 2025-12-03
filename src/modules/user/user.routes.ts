import { Request, Response, Router } from "express";
import { pool } from "../../config/db";
import { userControllers } from "./user.controller";

const router = Router();

router.post("/", userControllers.createUser);

export const userRoutes = router;
