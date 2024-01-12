import express from "express";
import {
  createChat,
  findUserChats,
  findChat,
} from "../Controllers/chatController.js";

const router = express.Router();

router.post("/", createChat);
router.get("/:userId", findUserChats);
router.get("/find/:firstId/:secondId", findChat);

export default router;

//remember whenever we create a route file, we need to declare a middleware to use it in index.js
