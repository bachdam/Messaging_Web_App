import express from "express";
import { registerUser } from "../Controllers/userController.js";

const route = express.Router();

route.get("/register", registerUser);

export default route;
