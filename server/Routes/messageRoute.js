import express from "express";
import {
  getMessages,
  createMessage,
} from "../Controllers/messageController.js";

const router = express.Router();

router.post("/", createMessage);
router.get("/:chatId", getMessages);

export default router;
