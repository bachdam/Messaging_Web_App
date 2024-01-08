import mongoose from "mongoose";

//members: Array means that there are 2 users who are the sender and the receiver => every time we chat, there will be only them
const chatSchema = new mongoose.Schema(
  {
    members: Array,
  },
  { timestamps: true }
);

const chatModel = mongoose.model("Chat", chatSchema);

export default chatModel;
