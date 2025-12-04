import { Request, Response, Router } from "express";
import { pool } from "../../config/db";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", userControllers.createUser);
router.get("/", auth(), userControllers.getUser);
router.get("/:id", userControllers.getSingleUser);
router.put("/:id", userControllers.updateUser);
router.delete("/:id", userControllers.updateUser);

export const userRoutes = router;
