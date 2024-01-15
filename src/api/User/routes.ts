import express, { Router } from "express";
import {
  AuthenticateSession,
  UserAuthenticateSession,
} from "../../middlewares/AuthenticateSession";
import UserController from "./userController";

const router: Router = express.Router();
const User = new UserController();

/* Authentication */
router.post("/logout", AuthenticateSession, User.logout);

export default router;
