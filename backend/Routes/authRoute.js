import express from "express";
import {
  forgetpasswordController,
  loginController,
  logoutController,
  registerController,
  resetController,
} from "../Controller/authController.js";

const route = express.Router();

route.post("/register", registerController);

route.post("/login", loginController);

route.post("/logout", logoutController);

route.post("/forget-password", forgetpasswordController);

route.post("/reset-password/:id/:passwordToken", resetController);

export default route;
