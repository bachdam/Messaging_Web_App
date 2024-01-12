import express from "express";

import {
  registerUser,
  loginUser,
  findUser,
  getUsers,
} from "../Controllers/userController.js";

const route = express.Router();

route.post("/register", registerUser);
route.post("/login", loginUser);
route.get("/find/:userId", findUser);
route.get("/", getUsers);

export default route;

//remember whenever we create a route file, we need to declare a middleware to use it in index.js
