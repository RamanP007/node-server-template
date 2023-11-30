import express, { Router } from "express";
import { UserController } from "./userController";

const router: Router = express.Router();
const user = new UserController();

/* Authentication */
router.post("/signin", user.authUser);

export default router;
