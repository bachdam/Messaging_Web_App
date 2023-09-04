import express from "express";
import { registerUser } from "../Controllers/userController.js";

const route = express.Router();

route.post("/register", registerUser);

export default route;
