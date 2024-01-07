import mongoose from "mongoose";
// const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 20 },
    email: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 200,
      unique: true,
    },
    password: { type: String, required: true, minlength: 3, maxlength: 1024 },
  },
  { timestamps: true } // allow us to know when the user is created
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
